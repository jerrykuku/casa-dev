'use strict'

import { app, BrowserWindow, globalShortcut, Menu } from 'electron'
import '../renderer/store'
import ini from 'ini'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import log from 'electron-log'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
// let tray = null

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 1080,
    useContentSize: true,
    width: 1600,
    webPreferences: {
      devTools: true,
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  globalShortcut.register('f5', function () {
    console.log('f5 is pressed')
    mainWindow.reload()
  })

  globalShortcut.register('f6', function () {
    console.log('f6 is pressed')
    mainWindow.toggleDevTools()
  })
}

function runFront() {
  // const icon = path.join(__dirname, '..', '..', 'build', 'icons', 'icon.ico')
  // // Set Tray
  // tray = new Tray(icon)
  // const contextMenu = Menu.buildFromTemplate([
  //   { label: 'Item1', type: 'radio' },
  //   { label: 'Item2', type: 'radio' },
  //   { label: 'Item3', type: 'radio', checked: true },
  //   { label: 'Item4', type: 'radio' }
  // ])
  // tray.setToolTip('这是我的应用程序.')
  // tray.setContextMenu(contextMenu)

  createWindow()
  Menu.setApplicationMenu(null)
  globalShortcut.register('CommandOrControl+Shift+L', () => {
    let focusWin = BrowserWindow.getFocusedWindow()
    focusWin && focusWin.toggleDevTools()
  })
  // hide menu for Mac
  if (process.platform === 'darwin') {
    // app.dock.hide()
  }
}

// 启动后端
let serviceIsRunning = false
function runServer() {
  const binFolder = process.platform === 'darwin' ? 'bin/mac' : 'bin/win'
  const dirPath = process.env.NODE_ENV === 'development' ? './' + binFolder : path.dirname(process.execPath)
  const configPath = path.join(dirPath, 'conf.ini')
  const execPath = (process.platform === 'darwin') ? path.join(dirPath, `server`) : path.join(dirPath, `server.exe`)
  const dbPath = path.join(app.getPath('appData'), '/CasaConnect')
  const config = ini.parse(fs.readFileSync(configPath, 'utf-8'))
  const parmras = ['-db', dbPath, '-c', configPath]
  process.env.SERVER_PORT = config.server.HttpPort
  log.info('dbPath', dbPath)
  log.info('dirPath', dirPath)
  log.info('configPath', configPath)
  log.info('execPath', execPath)
  log.info('parmras', parmras)

  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath)
  }

  const casaService = spawn(execPath, parmras)
  casaService.on('error', (data) => {
    log.info('error', data)
  })
  casaService.on('close', (data) => {
    log.info('close', data)
  })
  casaService.stdout.on('data', (data) => {
    log.info('data', data)
    if (!serviceIsRunning) {
      serviceIsRunning = true
      setTimeout(function () {
        runFront()
      }, 5000);

    }
  })


}

app.on('ready', () => {
  runServer()
})
app.on('spawn', () => {
  console.log('spawn is ok')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// if (app.isPackaged) {
//   // Set auto start with system
//   app.setLoginItemSettings({
//     openAtLogin: true,
//     args: ["--openAsHidden"],
//   })
// }

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
