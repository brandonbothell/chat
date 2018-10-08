// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import * as path from 'path'
import * as url from 'url'
import * as os from 'os'
import { app, Menu, BrowserWindow, Tray } from 'electron'
import { devMenuTemplate } from './menu/dev_menu_template'
import { editMenuTemplate } from './menu/edit_menu_template'
import { fileMenuTemplate } from './menu/file_menu_template'
import createWindow from './helpers/window'
import env from './env'

export let quitting = { quitting: false }

const isSecondInstance = app.makeSingleInstance(() => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.show()
    mainWindow.focus()
  }
})

if (isSecondInstance) {
  app.quit()
}

let mainWindow: BrowserWindow
let appIcon

function setApplicationMenu () {
  const menus: any[] = [ fileMenuTemplate, editMenuTemplate ]

  if (env.name !== 'production') {
    menus.push(devMenuTemplate)
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(menus))
}

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
  const userDataPath = app.getPath('userData')
  app.setPath('userData', userDataPath + ' (' + env.name + ')')
}

app.on('ready', createWindows)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindows()
  }
})

function platformToEnglish (platform: NodeJS.Platform) {
  switch (platform) {
    case 'win32':
      return 'Windows'
    case 'sunos':
      return 'SunOS'
    case 'openbsd':
      return 'OpenBSD'
    case 'freebsd':
      return 'FreeBSD'
    case 'linux':
      return 'Linux'
    case 'darwin':
      return 'Darwin'
    case 'android':
      return 'Android'
    case 'aix':
      return 'AIX'
    default:
      return 'Unknown'
  }
}

function createWindows () {
  setApplicationMenu()

  mainWindow = createWindow('main', {
    width: 1000,
    height: 600
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.setTitle('Chat - ' + platformToEnglish(os.platform()))
  mainWindow.on('page-title-updated', event => event.preventDefault())

  mainWindow.on('close', function (event) {
    if (!quitting.quitting) {
      event.preventDefault()
      mainWindow.hide()
    }

    return false
  })

  if (env.name === 'development') {
    mainWindow.webContents.openDevTools()
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click:  function () {
      mainWindow.show()
    } },
    { label: 'Quit', click:  function () {
      quitting.quitting = true
      app.quit()
    } }
  ])

  appIcon = new Tray(path.join(__dirname, 'images', 'macho.png'))
  appIcon.setToolTip('Custom Discord RPC - ' + app.getVersion())
  appIcon.setContextMenu(contextMenu)
  appIcon.addListener('double-click', () => {
    mainWindow.show()
  })
}
