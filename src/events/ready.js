const chalk = require("chalk");

module.exports = async (client) => {
  const end = new Date();
  console.log(`${chalk.bgBlue(`[${new Date().toLocaleTimeString("en-US", { hour12: true })}]`)} Selfbot initalized in ${end.getTime() - client.startTime.getTime()}ms. Ready to serve ${client.users.size} users on ${client.guilds.size} guilds.`);
  delete client.startTime;
};
