const fetch = require('node-fetch')

const Discord = require('discord.js')
const config = require('./config.json')
const prefix = '!'
const client = new Discord.Client()

const { createCanvas } = require('canvas')

const scale = (s1, e1, s2, e2) => (value) => {
  const range1 = e1 - s1
  const range2 = e2 - s2
  const ratio = (value - s1) / range1
  const newValue = ratio * range2 + s2
  return newValue
}

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
    const data = await fetch('http://178.62.249.30:64342/api')
    const json = await data.json()

    const gas = json.eth_last
    const fast = json.eth[0]
    const medium = json.eth[1]
    const slow = json.eth[2]

    const slow_min = Math.min(...slow)
    const fast_max = Math.max(...fast)
    if (args[0] === 'plot') {
      const canvas = createCanvas(400, 200)
      const ctx = canvas.getContext('2d')

      ctx.strokeStyle = 'rgba(255,0,0,1)'
      ctx.moveTo(10, 100)
      ctx.beginPath()
      fast.map((p, i) => {
        ctx.lineTo((i * canvas.width) / fast.length, scale(slow_min, fast_max, canvas.height, 0)(p))
      })
      ctx.stroke()

      ctx.strokeStyle = 'rgba(255,255,0,1)'
      ctx.moveTo(10, 100)
      ctx.beginPath()
      medium.map((p, i) => {
        ctx.lineTo(
          (i * canvas.width) / medium.length,
          scale(slow_min, fast_max, canvas.height, 0)(p)
        )
      })
      ctx.stroke()

      ctx.strokeStyle = 'rgba(0,255,0,1)'
      ctx.moveTo(10, 100)
      ctx.beginPath()
      slow.map((p, i) => {
        ctx.lineTo((i * canvas.width) / slow.length, scale(slow_min, fast_max, canvas.height, 0)(p))
      })
      ctx.stroke()

      const buf = canvas.toBuffer('image/jpeg', { quality: 0.8 })
      const attachment = new Discord.MessageAttachment(buf, 'image.jpeg')
      message.channel.send(`Gas price is [${gas}] Gwei.`, attachment)
    } else {
      message.channel.send(`Gas price is [${gas}] Gwei.`)
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
