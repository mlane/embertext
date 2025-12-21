const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('embertext', {
  readFile: path => ipcRenderer.invoke('readFile', path),
})
