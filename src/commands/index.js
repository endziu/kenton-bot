const ping = require('./ping')
const price = require('./price')
const gas = require('./gas')

const commands = {
  ping,
  price,
  gas,
}

module.exports = async (msg) => {
  // console.log(msg)
  if (msg.channel.name === 'dev') {
    const args = msg.content.split(' ')
    if (args.length == 0 || args[0].charAt(0) !== '!') return
    const command = args.shift().substr(1)
    if (Object.keys(commands).includes(command)) {
      commands[command](msg, args)
    }
  }
}
