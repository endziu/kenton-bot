const Discord = require('discord.js')
const puppeteer = require('puppeteer')

module.exports = async (message, args) => {
  // const data = await fetch()
  // const json = await data.json()

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://example.com')
  const buffer = await page.screenshot({ type: 'jpeg' })
  await browser.close()

  const attachment = new Discord.MessageAttachment(buffer, 'image.jpeg')
  message.channel.send(`Gas price is [${gas}] Gwei.`, attachment)
}
