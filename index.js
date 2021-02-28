const fetch = require('node-fetch')

const Discord = require('discord.js')
const config = require('./config.json')
const prefix = '!'
const client = new Discord.Client()

const { createCanvas } = require('canvas')

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

  if (command === 'img') {
    const canvas = createCanvas(200, 200)
    const ctx = canvas.getContext('2d')
    const txt = args[0] || 'szipupi!'
    ctx.font = '42px Impact'
    ctx.fillStyle = 'rgba(255,255,255,1)'
    ctx.fillText(txt, 20, 100)

    ctx.strokeStyle = 'rgba(255,255,255,1)'
    ctx.beginPath()
    ctx.lineTo(20, 40)
    ctx.lineTo(180, 40)
    ctx.stroke()

    const buf = canvas.toBuffer('image/jpeg', { quality: 0.8 })
    const attachment = new Discord.MessageAttachment(buf, 'image.jpeg')

    message.channel.send('an image!', attachment)
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
