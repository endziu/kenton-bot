const Discord = require('discord.js')
const fetch = require('node-fetch')

module.exports = async (message, args) => {
  const data = await fetch('http://178.62.249.30:64342/api')
  const json = await data.json()

  const gas = json.eth_last
  const fast = json.eth[0]
  const medium = json.eth[1]
  const slow = json.eth[2]

  if (args[0] === 'plot') {
    const { createCanvas } = require('canvas')
    const canvas = createCanvas(400, 200)
    const ctx = canvas.getContext('2d')

    const scale = (s1, e1, s2, e2) => (value) => {
      const range1 = e1 - s1
      const range2 = e2 - s2
      const ratio = (value - s1) / range1
      const newValue = ratio * range2 + s2
      return newValue
    }

    const slow_min = Math.min(...slow)
    const fast_max = Math.max(...fast)
    const toScreenHeight = scale(slow_min, fast_max, canvas.height, 0)

    // bg color
    ctx.fillStyle = '#0f0f0f'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // fast tx speed gas plot
    ctx.strokeStyle = 'rgba(255,0,0,1)'
    ctx.moveTo(10, toScreenHeight(fast[0]))
    ctx.beginPath()
    fast.map((p, i) => ctx.lineTo((i * canvas.width) / fast.length, toScreenHeight(p)))
    ctx.stroke()
    // medium tx speed gas plot
    ctx.strokeStyle = 'rgba(0,0,255,1)'
    ctx.moveTo(10, toScreenHeight(medium[0]))
    ctx.beginPath()
    medium.map((p, i) => ctx.lineTo((i * canvas.width) / medium.length, toScreenHeight(p)))
    ctx.stroke()
    // slow tx speed gas plot
    ctx.strokeStyle = 'rgba(0,255,0,1)'
    ctx.moveTo(10, toScreenHeight(slow[0]))
    ctx.beginPath()
    slow.map((p, i) => ctx.lineTo((i * canvas.width) / slow.length, toScreenHeight(p)))
    ctx.stroke()
    // scale & values
    ctx.fillStyle = '#fff'
    ctx.font = '14px Impact'
    ctx.fillText(`${fast_max} Gwei`, 2, 13)
    ctx.fillText(`${slow_min} Gwei`, 2, 198)
    ctx.fillText(`${gas[0]}`, 370, toScreenHeight(gas[0]) + 5)
    ctx.fillText(`${gas[1]}`, 370, toScreenHeight(gas[1]) + 5)
    ctx.fillText(`${gas[2]}`, 370, toScreenHeight(gas[2]) + 5)
    // make image
    const buf = canvas.toBuffer('image/jpeg', { quality: 0.8 })
    // send discord message
    const attachment = new Discord.MessageAttachment(buf, 'image.jpeg')
    message.channel.send(`Gas price is [${gas}] Gwei.`, attachment)
  } else {
    message.channel.send(`Gas price is [${gas}] Gwei.`)
  }
}
