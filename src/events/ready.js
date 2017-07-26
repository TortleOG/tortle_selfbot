module.exports = async (client) => {
  const end = new Date();
  client.funcs.log(`Selfbot initalized in ${end.getTime() - client.startTime.getTime()}ms. Ready to serve ${client.guilds.size} guilds.`);
  delete client.startTime;
};
