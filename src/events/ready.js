module.exports = async (client) => {
  client.emit("log", `Selfbot initalized. Ready to serve ${client.guilds.size} guilds.`);
};
