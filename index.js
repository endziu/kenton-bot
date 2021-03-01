const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')

const commandHandler = require('./src/commands')

client.on('message', commandHandler)

client.login(config.BOT_TOKEN)
