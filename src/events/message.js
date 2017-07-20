const parseUsage = require("../util/parseUsage");
const validateArgs = require("../util/validateArgs");
const parseArgs = require("../util/parseArgs");

module.exports = async (client, msg) => {
  if (msg.author.id !== client.user.id) return;
  else if (msg.content.indexOf(client.config.prefix) !== 0) return;

  const command = msg.content.split(/\s+/g)[0].slice(client.config.prefix.length).toLowerCase();
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  let args = !cmd.help.usageDelim || cmd.help.usageDelim === "" ? msg.content.split(/\s+/g).slice(1) : msg.content.split(/\s+/g).slice(1).join(" ").split(cmd.help.usageDelim);
  try {
    const usage = parseUsage(cmd.help.usage);
    args = usage.args.length === 1 ? [args.join(" ")] : args;
    await validateArgs(usage, args);
    const params = parseArgs(usage, args);
    if (cmd && cmd.conf.enabled) return cmd.run(client, msg, params);
  } catch (err) {
    msg.channel.send(`\`\`\`js\nError: ${err}\`\`\``);
  }
};
