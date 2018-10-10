import { remote } from 'electron'
import * as jetpack from 'fs-jetpack'
import * as WebSocket from 'ws'
import env from './env'
import * as M from 'materialize-css'

const ws = new WebSocket('wss://www.macho.ninja/chat/')

console.log('Loaded environment variables:', env)

let app = remote.app
let appDir = jetpack.cwd(app.getAppPath())
let nickname: string
let instances: M.Modal[]

console.log('The author of this app is:', appDir.read('package.json', 'json').author)

document.addEventListener('DOMContentLoaded', function () {
  const nicknameInput = document.getElementById('nickname') as HTMLInputElement
  const nickname = window.localStorage.getItem('nickname')

  if (nickname) {
    nicknameInput.value = nickname
    onNicknameChange()
  } else {
    const elems = document.querySelectorAll('.modal')
    instances = M.Modal.init(elems, { dismissible: false, onCloseEnd: onNicknameChange })
    instances[0].open()
  }

  const form = document.getElementById('form') as HTMLFormElement

  form.onsubmit = event => {
    event.preventDefault()

    const message = document.getElementById('message') as HTMLInputElement

    ws.send(JSON.stringify({ message: message.value, nickname }))
    console.log(`Sent message ${message.value}`)
    message.value = ''
  }

  ws.on('message', (message: string) => {
    const msg: { message: string, nickname: string } = JSON.parse(message)

    if (msg.message) {
      const messages = document.getElementById('messages') as HTMLUListElement

      messages.appendChild(document.createElement('li')).textContent = msg.nickname + ' - ' + msg.message

      if (msg.nickname === 'Socket') {
        messages.lastElementChild.setAttribute('style', 'color:green;')
      }
    } else {
      console.log('Message from websocket: ' + message)
    }
  })
})

function onNicknameChange () {
  nickname = (document.getElementById('nickname') as HTMLInputElement).value

  if (nickname === '' || nickname.toLowerCase() === 'socket') {
    return instances[0].open()
  }

  if (nickname.length > 20) {
    nickname = nickname.substring(0, nickname.length - 19)
  }

  window.localStorage.setItem('nickname', nickname)
  console.log('Nickname: ' + nickname)
}
