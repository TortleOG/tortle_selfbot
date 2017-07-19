exports.run = (client, msg) => {
  msg.delete();
  msg.channel.send("Ping!").then(m => m.edit(`🏓 Pong!\nLatency is **${m.createdTimestamp - msg.createdTimestamp}ms**.\nAPI Latency is **${Math.round(client.ping)}ms**.`));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
};

exports.help = {
  name: "ping",
  description: "A Ping/Pong command to test latency.",
  usage: "",
};
