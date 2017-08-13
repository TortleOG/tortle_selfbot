exports.run = async (client, msg) => {
  if (!client.user.bot && msg.author.id !== client.user.id) return;
  else if (msg.content.indexOf(client.config.prefix) !== 0) return;
  const res = await this.parseCommand(client, msg);
  if (!res.command) return;
  this.handleCommand(client, msg, res);
};

exports.parseCommand = async (client, msg) => {
  const prefix = msg.content.slice(msg.content.indexOf(client.config.prefix), client.config.prefix.length);
  if (!prefix) return false;
  return {
    command: msg.content.slice(prefix.length).split(" ")[0].toLowerCase(),
    prefix,
    prefixLength: prefix.length,
  };
};

exports.handleCommand = (client, msg, { command, prefix, prefixLength }) => {
  const validCommand = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (!validCommand || !validCommand.conf.enabled) return;
  const proxy = this.createProxy(msg, new client.CommandMessage(msg, validCommand, prefix, prefixLength));
  this.runCommand(client, proxy);
};

exports.createProxy = (msg, cmdMsg) => new Proxy(msg, {
  get: function handler(target, param) {
    return param in msg ? msg[param] : cmdMsg[param];
  },
});

exports.runCommand = (client, msg) => {
  msg.validateArgs()
    .then((params) => {
      msg.cmd.run(client, msg, params).catch(err => msg.channel.send(`\`\`\`${err.stack || err}\`\`\``));
    })
    .catch(err => msg.channel.send(`\`\`\`${err.stack || err}\`\`\``));
};
