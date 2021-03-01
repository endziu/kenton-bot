const fetch = require('node-fetch')

module.exports = async (message, args) => {
  const currency = args[0] || 'bitcoin'
  const fiat = args[1] || 'usd'

  const data = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=${fiat}`
  )
  const json = await data.json()
  const result = json[currency][fiat] || '...'
  message.reply(`${currency} is worth: ${result} ${fiat}.`)
}
