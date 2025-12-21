const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs/promises')

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  win.loadURL('http://localhost:5173')
})

ipcMain.handle('readFile', async (_, filePath) => {
  return fs.readFile(filePath, 'utf8')
})
