/**
 * Google Calendar API integration - runs in Electron main process.
 * Uses OAuth 2.0 credentials from "Google Cal API/credentials.json".
 */

const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const { shell } = require('electron');

const OAUTH_PORT = 9999;
const TOKEN_FILE = 'google_calendar_tokens.json';
const SCOPES = ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly'];

function getCredentialsPath() {
  const base = process.cwd();
  return path.join(base, 'Google Cal API', 'credentials.json');
}

function getCredentials() {
  const credPath = getCredentialsPath();
  if (!fs.existsSync(credPath)) {
    throw new Error('Google Cal API credentials not found at: ' + credPath);
  }
  const data = fs.readFileSync(credPath, 'utf8');
  const json = JSON.parse(data);
  const c = json.installed || json.web;
  if (!c || !c.client_id || !c.client_secret) {
    throw new Error('Invalid credentials: need client_id and client_secret');
  }
  return {
    clientId: c.client_id,
    clientSecret: c.client_secret,
    redirectUri: (c.redirect_uris && c.redirect_uris[0]) || `http://localhost:${OAUTH_PORT}`,
  };
}

function getTokenPath() {
  const { app } = require('electron');
  return path.join(app.getPath('userData'), TOKEN_FILE);
}

function loadTokens() {
  try {
    const p = getTokenPath();
    if (fs.existsSync(p)) {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (data.access_token) return data;
    }
  } catch (_) {}
  return null;
}

function saveTokens(tokens) {
  const p = getTokenPath();
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, JSON.stringify(tokens), 'utf8');
}

function getAuthUrl() {
  const cred = getCredentials();
  const params = new URLSearchParams({
    client_id: cred.clientId,
    redirect_uri: cred.redirectUri,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
}

function exchangeCodeForTokens(code) {
  return new Promise((resolve, reject) => {
    const cred = getCredentials();
    const body = new URLSearchParams({
      code,
      client_id: cred.clientId,
      client_secret: cred.clientSecret,
      redirect_uri: cred.redirectUri,
      grant_type: 'authorization_code',
    }).toString();

    const req = https.request(
      {
        hostname: 'oauth2.googleapis.com',
        path: '/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (ch) => (data += ch));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.error) return reject(new Error(json.error_description || json.error));
            saveTokens(json);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function apiRequest(method, pathname, body = null) {
  return new Promise((resolve, reject) => {
    const tokens = loadTokens();
    if (!tokens || !tokens.access_token) {
      return reject(new Error('Not signed in to Google Calendar'));
    }
    const opts = {
      hostname: 'www.googleapis.com',
      path: pathname,
      method,
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json',
      },
    };
    if (body) {
      const str = JSON.stringify(body);
      opts.headers['Content-Length'] = Buffer.byteLength(str);
    }
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (ch) => (data += ch));
      res.on('end', () => {
        if (res.statusCode === 401) {
          return reject(new Error('Session expired. Please connect Google Calendar again.'));
        }
        try {
          resolve(data ? JSON.parse(data) : null);
        } catch {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function initGoogleCalendar(ipcMain) {
  ipcMain.handle('google-calendar:getAuthUrl', () => {
    try {
      return { ok: true, url: getAuthUrl() };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });

  ipcMain.handle('google-calendar:exchangeCode', (_, code) => {
    return exchangeCodeForTokens(code).then(() => ({ ok: true })).catch((e) => ({ ok: false, error: e.message }));
  });

  ipcMain.handle('google-calendar:isConnected', () => {
    return { connected: !!loadTokens() };
  });

  ipcMain.handle('google-calendar:getEvents', async (_, { timeMin, timeMax, maxResults = 50 } = {}) => {
    try {
      const params = new URLSearchParams();
      if (timeMin) params.set('timeMin', timeMin);
      if (timeMax) params.set('timeMax', timeMax);
      params.set('maxResults', String(maxResults));
      params.set('singleEvents', 'true');
      params.set('orderBy', 'startTime');
      const pathname = `/calendar/v3/calendars/primary/events?${params.toString()}`;
      const result = await apiRequest('GET', pathname);
      return { ok: true, events: result.items || [] };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });

  ipcMain.handle('google-calendar:createEvent', async (_, event) => {
    try {
      const result = await apiRequest('POST', '/calendar/v3/calendars/primary/events', event);
      return { ok: true, event: result };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });

  ipcMain.handle('google-calendar:disconnect', () => {
    try {
      const p = getTokenPath();
      if (fs.existsSync(p)) fs.unlinkSync(p);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });

  ipcMain.handle('google-calendar:startAuth', () => {
    return new Promise((resolve) => {
      try {
        const authUrl = getAuthUrl();
        const server = http.createServer(async (req, res) => {
          const url = new URL(req.url || '', `http://127.0.0.1:${OAUTH_PORT}`);
          const code = url.searchParams.get('code');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          if (code) {
            try {
              await exchangeCodeForTokens(code);
              res.end('<script>window.close();</script><p style="font-family:sans-serif">Success! You can close this tab and return to the app.</p>');
              server.close();
              resolve({ ok: true });
            } catch (e) {
              res.end(`<p style="font-family:sans-serif">Error: ${e.message}</p>`);
              server.close();
              resolve({ ok: false, error: e.message });
            }
          } else {
            res.end('<p style="font-family:sans-serif">No authorization code received. Try again from the app.</p>');
          }
        });
        server.listen(OAUTH_PORT, '127.0.0.1', () => {
          shell.openExternal(authUrl);
        });
        server.on('error', (e) => resolve({ ok: false, error: e.message }));
      } catch (e) {
        resolve({ ok: false, error: e.message });
      }
    });
  });

  return {
    startOAuthServer() {
      return new Promise((resolve, reject) => {
        const server = http.createServer(async (req, res) => {
          const url = new URL(req.url || '', `http://localhost:${OAUTH_PORT}`);
          if (url.pathname !== '/' && !url.pathname.startsWith('/?')) {
            res.writeHead(404);
            res.end();
            return;
          }
          const code = url.searchParams.get('code');
          res.writeHead(200, { 'Content-Type': 'text/html' });
          if (code) {
            try {
              await exchangeCodeForTokens(code);
              res.end('<script>window.close();</script><p>Success! You can close this window and return to the app.</p>');
            } catch (e) {
              res.end(`<p>Error: ${e.message}</p>`);
            }
            server.close();
            resolve(code);
          } else {
            res.end('<p>No code received. Try again from the app.</p>');
          }
        });
        server.listen(OAUTH_PORT, '127.0.0.1', () => {
          const authUrl = getAuthUrl();
          shell.openExternal(authUrl);
          resolve(null);
        });
        server.on('error', reject);
      });
    },
  };
}

module.exports = { initGoogleCalendar, getAuthUrl, loadTokens, getCredentialsPath };
