module.exports = async (message, args) => {
  const timeTaken = message.createdTimestamp - Date.now()
  message.channel.send(`${JSON.stringify(args)} => pong! :: latency: ${timeTaken}ms.`)
}
