const { promisify } = require("util");

const readdir = promisify(require("fs").readdir);
const mkdir = promisify(require("fs").mkdir);

module.exports = async (client) => {
  const cmds = await readdir("./commands/").catch(async () => {
    await mkdir("./commands").catch(e => console.log(`Error when creating 'commands' dir => ${e}`));
  });
  console.log(`Loading a total of ${cmds.length} commands.`);
  cmds.forEach((cmd) => {
    try {
      const props = require(`../commands/${cmd}`);

      if (cmd.split(".").slice(-1)[0] !== "js") return;
      client.commands.set(props.help.name, props);

      if (!props.conf.aliases) props.conf.aliases = [];
      props.conf.aliases.forEach((alias) => {
        client.alias.set(alias, props.help.name);
      });

      if (props.init) props.init(client);
    } catch (err) {
      console.log(`Error occured when loading command ${cmd} => ${err}`);
    }
  });
};
