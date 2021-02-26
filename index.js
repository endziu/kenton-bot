const fetch = require('node-fetch')

const Discord = require('discord.js')
const config = require('./config.json')
const prefix = '!'
const client = new Discord.Client()

// const asciichart = require('asciichart')
// const chartConfig = {
//   colors: [asciichart.red, asciichart.yellow, asciichart.green],
//   height: 15,
// }

client.on('message', async function (message) {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  const commandBody = message.content.slice(prefix.length)
  const args = commandBody.split(' ')
  const command = args.shift().toLowerCase()

  if (command === 'ping') {
    const timeTaken = message.createdTimestamp - Date.now()
    message.channel.send(`${command}(${JSON.stringify(args)}) => pong! :: latency: ${timeTaken}ms.`)
  }

  if (command === 'prune' && message.author.id === '214820207452094466') {
    message.channel.bulkDelete(args[0] || 3, true)
  }

  if (message.channel.name.toLowerCase() === 'crypto' && command === 'gas') {
    try {
      const data = await fetch('http://178.62.249.30:64342/api')
      const json = await data.json()
      const gas = json.eth_last
      message.reply(`Gas price is [${gas}] Gwei.`)
    } catch (e) {
      console.log(e)
      message.reply(
        `${JSON.stringify({ error: { message: "You're really bad at this!" } }, null, 2)}`
      )
    }
  }

  if (message.channel.name.toLowerCase() === 'crypto' && command === 'price') {
    const currency = args[0] || 'bitcoin'
    const fiat = args[1] || 'usd'
    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=${fiat}`
      )
      const json = await data.json()
      const result = json[currency][fiat] || '...'
      message.reply(`${currency} is worth: ${result} ${fiat}.`)
    } catch (e) {
      message.reply(
        `${JSON.stringify(
          {
            error: {
              request: `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=${fiat}`,
              message: "You're really bad at this!",
            },
          },
          null,
          2
        )}`
      )
    }
  }
})

client.login(config.BOT_TOKEN)
