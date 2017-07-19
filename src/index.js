const Discord = require("discord.js");

const client = new Discord.Client();

client.config = require("../settings.json");

client.on("ready", () => {
  console.log("Selfbot initalized. Ready to serve.");
});

client.on("message", (msg) => {
  if (msg.author.id !== client.user.id) return;
  else if (!msg.content.startsWith(client.config.prefix)) return;

  if (msg.content.startsWith(`${client.config.prefix}ping`)) {
    msg.delete();
    return msg.channel.send("Ping!").then(m => m.edit(`Pong! Client Latency: **${m.createdTimestamp - msg.createdTimestamp}ms**. API Latency: **${Math.round(client.ping)}ms**`));
  }
});

client.login(client.config.token);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception: ", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Uncaught Promise Error: ", err);
});
