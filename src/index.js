const Discord = require("discord.js");
const now = require("performance-now");
const { loadCommands, loadEvents } = require("./classes/Client");

const client = new Discord.Client();

client.config = require("../settings");

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.login(client.config.token);

const init = async () => {
  const start = now();
  await loadCommands(client);
  await loadEvents(client);
  const end = now();
  client.initTime = (end - start).toFixed(2);
};

init();

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception: ", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Uncaught Promise Error: ", err);
});
