module.exports = async (client, msg) => {
  if (msg.author.id !== client.user.id) return;
  else if (msg.content.indexOf(client.config.prefix) !== 0) return;

  const args = msg.content.split(/\s+/g);
  const command = args.shift().slice(client.config.prefix.length).toLowerCase();

  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (cmd && cmd.conf.enabled) return cmd.run(client, msg, args);
};
