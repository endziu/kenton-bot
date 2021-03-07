const ping = require('./ping')
const price = require('./price')
const gas = require('./gas')
const prune = require('./prune')
const grab = require('./grab')

const commands = {
  ping,
  price,
  gas,
  prune,
  grab,
}

module.exports = async (msg) => {
  if (msg.author.bot) return
  if (msg.channel.name === 'crypto') {
    const [commandString, ...args] = msg.content.split(' ')
    if (commandString.charAt(0) !== '!') return
    const command = commandString.substring(1)
    if (Object.keys(commands).includes(command)) {
      commands[command](msg, args)
    }
  }
}
