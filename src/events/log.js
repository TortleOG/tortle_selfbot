const { bgBlue, bgRed } = require("chalk");

module.exports = (client, data, type = "log") => {
  if (type === "error") return console.error(`${bgRed(`[${new Date().toLocaleTimeString("en-US", { hour12: true })}]`)} ${data}`);
  return console.log(`${bgBlue(`[${new Date().toLocaleTimeString("en-US", { hour12: true })}]`)} ${data}`);
};
