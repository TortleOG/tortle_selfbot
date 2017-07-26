const { parseUsage, validateArgs, parseArgs } = require("../classes/Util");

module.exports = async (client, msg) => {
  if (msg.author.id !== client.user.id) return;
  else if (msg.content.indexOf(client.config.prefix) !== 0) return;

  const command = msg.content.split(/\s+/g)[0].slice(client.config.prefix.length).toLowerCase();
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  let args = !cmd.help.usageDelim || cmd.help.usageDelim === "" ? msg.content.split(/\s+/g).slice(1) : msg.content.split(/\s+/g).slice(1).join(" ").split(cmd.help.usageDelim);

  try {
    // CMD Usage parsing and validation
    const usage = parseUsage(cmd.help.usage);
    if (usage === null) return cmd.run(client, msg);

    // If only one argument, pass all args as one array
    args = usage.args.length === 1 ? [args.join(" ")] : args;

    // Argument validation and parsing
    await validateArgs(usage, args);
    const params = parseArgs(usage, args);

    // If cmd exists and is enabled run the command
    if (cmd && cmd.conf.enabled) return cmd.run(client, msg, params);
  } catch (err) {
    return msg.channel.send(`\`\`\`js\n${err.stack}\`\`\``);
  }
};
