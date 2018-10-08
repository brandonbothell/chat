// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import { remote } from 'electron' // native electron module
import * as jetpack from 'fs-jetpack' // module loaded from npm
import * as io from 'socket.io-client'
import env from './env'

const socket = io.connect('https://macho.ninja/chat')

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
    socket.emit('chatMessage', message.value)
    console.log(`Sent message ${message.value}`)
    message.value = ''
  }

  socket.on('chatMessage', (message: string) => {
    const messages = document.getElementById('messages') as HTMLUListElement
    messages.appendChild(document.createElement('li')).textContent = message
  })
})
