# Google Calendar API

OAuth 2.0 credentials and integration for Google Calendar.

## Setup

1. **Credentials**  
   `credentials.json` is already in this folder (OAuth 2.0 “Desktop app” / installed app type).

2. **Google Cloud Console**  
   In [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → your OAuth 2.0 Client ID:
   - Under **Authorized redirect URIs**, add:
     - `http://localhost:9999` (used by the app for the OAuth callback)
   - Ensure **Google Calendar API** is enabled for the project (APIs & Services → Library → “Google Calendar API” → Enable).

3. **First run**  
   When you use “Connect Google Calendar” in the app, it will open your browser to sign in. After you allow access, the app will receive the token and use it for calendar actions.

## Usage in the app

- **Connect**: Use the “Connect Google Calendar” option (e.g. in Settings or Dashboard).
- **Events**: Once connected, the app can list and create calendar events via the exposed API.

## Security

- Do not commit `credentials.json` if it contains a client secret and the repo is public. Add `Google Cal API/credentials.json` to `.gitignore` in that case.
- Tokens are stored in Electron’s `userData` directory on your machine.
