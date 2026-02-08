const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('googleCalendar', {
  startAuth: () => ipcRenderer.invoke('google-calendar:startAuth'),
  isConnected: () => ipcRenderer.invoke('google-calendar:isConnected'),
  getEvents: (opts) => ipcRenderer.invoke('google-calendar:getEvents', opts),
  createEvent: (event) => ipcRenderer.invoke('google-calendar:createEvent', event),
  disconnect: () => ipcRenderer.invoke('google-calendar:disconnect'),
});
