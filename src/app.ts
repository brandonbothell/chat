// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import { remote } from 'electron' // native electron module
import * as jetpack from 'fs-jetpack' // module loaded from npm
import * as WebSocket from 'ws'
import env from './env'

// const socket = io.connect('ws://https://macho.ninja/chat', { rejectUnauthorized: false })
const ws = new WebSocket('wss://www.macho.ninja/chat/')

console.log('Loaded environment variables:', env)

let app = remote.app
let appDir = jetpack.cwd(app.getAppPath())

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
console.log('The author of this app is:', appDir.read('package.json', 'json').author)

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form') as HTMLFormElement
  form.onsubmit = event => {
    event.preventDefault()

    const message = document.getElementById('message') as HTMLInputElement
    ws.send('message:' + message.value)
    console.log(`Sent message ${message.value}`)
    message.value = ''
  }

  ws.on('message', (message: string) => {
    if (message.startsWith('message:')) {
      const msg = message.substring(8, message.length)
      const messages = document.getElementById('messages') as HTMLUListElement

      messages.appendChild(document.createElement('li')).textContent = msg
    } else {
      console.log('Message from websocket: ' + message)
    }
  })
})
