module.exports = async (client) => {
  client.emit("log", `Selfbot initalized in ${client.initTime}ms. Ready to serve ${client.guilds.size} guilds.`);
};
