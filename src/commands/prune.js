module.exports = (message, args) => {
  if (message.author.id === '214820207452094466') {
    message.channel.bulkDelete(args[0] || 3, true)
  }
}
