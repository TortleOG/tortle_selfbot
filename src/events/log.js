const { bgBlue, bgRed } = require("chalk");

exports.run = (client, data, type = "log") => {
  if (type === "error") return console.error(`${bgRed(`[${new Date().toLocaleTimeString("en-US", { hour12: true })}]`)} ${data}`);
  return console[type](data.split("\n").map(str => `${bgBlue(`[${new Date().toLocaleTimeString("en-US", { hour12: true })}]`)} ${str}`).join("\n"));
};
