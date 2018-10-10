import * as path from 'path'
import * as url from 'url'
import * as os from 'os'
import { app, Menu, BrowserWindow, Tray } from 'electron'
import { devMenuTemplate, editMenuTemplate, fileMenuTemplate, contextMenuTemplate } from './menu/index'
import { createWindow, platformToEnglish } from './helpers/index'
import env from './env'

export let quitting = { quitting: false }

checkSecondsInstance()

export let mainWindow: BrowserWindow
let appIcon

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

  minimizeOnClose()
  setTitle('Chat - ' + platformToEnglish(os.platform()))

  if (env.name === 'development') {
    mainWindow.webContents.openDevTools()
  }

  initAppIcon()
}

function setTitle (title: string) {
  mainWindow.setTitle(title)
  mainWindow.on('page-title-updated', event => event.preventDefault())
}

function minimizeOnClose () {
  mainWindow.on('close', function (event) {
    if (!quitting.quitting) {
      event.preventDefault()
      mainWindow.hide()
    }

    return false
  })
}

function initAppIcon () {
  appIcon = new Tray(path.join(__dirname, 'images', 'macho.png'))
  appIcon.setToolTip('Chat - ' + app.getVersion())
  appIcon.setContextMenu(contextMenuTemplate)
  appIcon.addListener('double-click', () => {
    mainWindow.show()
  })
}

function setApplicationMenu () {
  const menus: any[] = [ fileMenuTemplate, editMenuTemplate ]

  if (env.name !== 'production') {
    menus.push(devMenuTemplate)
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(menus))
}

function checkSecondsInstance () {
  const isSecondInstance = app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.show()
      mainWindow.focus()
    }
  })

  if (isSecondInstance) {
    app.quit()
  }
}
