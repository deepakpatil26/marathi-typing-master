import { contextBridge, ipcRenderer, shell } from 'electron';

// Expose protected methods that allow the renderer process to use
// safe desktop functionality without exposing raw Node APIs.
contextBridge.exposeInMainWorld('electron', {
  isElectron: true,
  platform: process.platform,
  openExternal: (url: string) => {
    // Only allow http and https protocols for security
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
    }
  },
  send: (channel: string, data: unknown) => {
    const validChannels = ['toMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, func: (...args: unknown[]) => void) => {
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    }
  }
});
