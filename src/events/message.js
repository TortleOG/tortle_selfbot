// const { validateUsage, parseUsage, validateArgs, parseArgs } = require("../classes/Util");

exports.run = async (client, msg) => {
  if (msg.author.id !== client.user.id) return;
  else if (msg.content.indexOf(client.config.prefix) !== 0) return;

  const command = msg.content.split(/\s+/g)[0].slice(client.config.prefix.length).toLowerCase();
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  if (cmd && cmd.conf.enabled) {
    console.log(cmd.help.usage);
    // const args = !cmd.help.usageDelim || cmd.help.usageDelim === "" ? msg.content.split(/\s+/g).slice(1) : msg.content.split(/\s+/g).slice(1).join(" ").split(cmd.help.usageDelim);
    try {
      // No usage, run command
      if (cmd.help.usage === "") return cmd.run(client, msg);

      // CMD Usage parsing and validation
      // await validateUsage(cmd, cmd.help.usage);
      // const usage = parseUsage(cmd.help.usage);

      // If only one argument, pass all args as one array
      // args = usage.length === 1 ? [args.join(" ")] : args;

      // Argument validation and parsing
      // await validateArgs(usage, args);
      // const params = parseArgs(usage, args);

      // If cmd exists and is enabled run the command
      return cmd.run(client, msg);
    } catch (err) {
      return msg.channel.send(err.stack ? `\`\`\`js\n${err.stack}\`\`\`` : `\`\`\`js\nError: ${err}\`\`\``);
    }
  }
};
