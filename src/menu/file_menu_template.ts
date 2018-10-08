import { app } from 'electron'
import { quitting } from '../background'

export const fileMenuTemplate = {
  label: 'File',
  submenu: [
    { label: 'Exit', click:  function () {
      quitting.quitting = true
      app.quit()
    } }
  ]
}
