import { app, Menu } from 'electron'
import { quitting, mainWindow } from '../background'

export const contextMenuTemplate = Menu.buildFromTemplate([
  { label: 'Show App', click:  function () {
    mainWindow.show()
  } },
  { label: 'Quit', click:  function () {
    quitting.quitting = true
    app.quit()
  } }
])
