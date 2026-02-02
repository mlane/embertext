const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs/promises')
const fg = require('fast-glob')
let browserWindow

app.whenReady().then(() => {
  browserWindow = new BrowserWindow({
    backgroundColor: '#1e1e1e',
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 1200,
  })
  browserWindow.loadURL('http://localhost:5173')
})

ipcMain.handle('init', async (_, projectPath, excludeFromSearch = []) => {
  console.log('excludeFromSearch', excludeFromSearch)
  const paths = await fg(['**/*'], {
    absolute: true,
    cwd: projectPath,
    deep: 10,
    dot: true,
    followSymbolicLinks: false,
    ignore: excludeFromSearch,
    markDirectories: true,
    onlyFiles: false,
  })
  console.log(paths?.[0], paths?.[1])
  return paths
})

ipcMain.handle('selectProject', async () => {
  const { dialog } = require('electron')
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })
  return result.canceled ? null : result.filePaths[0]
})

ipcMain.handle('readFile', async (_, filePath) => {
  return fs.readFile(filePath, 'utf8')
})

ipcMain.handle('reinit', async (_, projectPath, excludeFromSearch = []) => {
  console.log('excludeFromSearch', excludeFromSearch)
  const paths = await fg(['**/*'], {
    absolute: true,
    cwd: projectPath,
    deep: 10,
    dot: true,
    followSymbolicLinks: false,
    ignore: excludeFromSearch,
    markDirectories: true,
    onlyFiles: false,
  })
  console.log(paths?.[0], paths?.[1])
  return paths
})

ipcMain.handle('writeFile', async (_, filePath, content) => {
  return fs.writeFile(filePath, content)
})
