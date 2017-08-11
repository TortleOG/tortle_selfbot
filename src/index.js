const Tortle = require("./classes/Client");

const client = new Tortle(require("../settings"));

client.login(client.config.token);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception: ", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Uncaught Promise Error: ", err);
});
