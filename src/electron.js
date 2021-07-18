const { app, BrowserWindow } = require('electron')
const iohook = require('iohook')
const path = require('path')
const rj = require('robotjs')
const isDev = require('electron-is-dev')

app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 800, height: 200, autoHideMenuBar: true, frame: false, resizable: false, webPreferences: { nodeIntegration: true, nodeIntegrationInWorker: true, contextIsolation: false } })
  //win.loadURL('http://localhost:3000')
  win.loadFile(path.join(__dirname, isDev ? '../dist/web/index.html' : '../../static/index.html'))
  iohook.start()
  iohook.on('mouseclick', e => e.button === 2 && win.webContents.send('click'))
  iohook.on('keyup', e => win.webContents.send('keyup', e))
  win.webContents.on('ipc-message', (_, type, k) => {
    if (type === 'minimize')
      win.minimize()
    if (type === 'presskey')
      rj.keyTap(k)
  })
})

app.on('window-all-closed', () => {
  app.quit()
})