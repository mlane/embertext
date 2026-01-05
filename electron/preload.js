const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('embertext', {
  init: (projectPath, excludeFromSearch = []) =>
    ipcRenderer.invoke('init', projectPath, excludeFromSearch),
  readFile: path => ipcRenderer.invoke('readFile', path),
  /** @todo might consider calling init here but as a wrapper */
  reinit: (projectPath, excludeFromSearch = []) =>
    ipcRenderer.invoke('reinit', projectPath, excludeFromSearch),
  selectProject: () => ipcRenderer.invoke('selectProject'),
})
