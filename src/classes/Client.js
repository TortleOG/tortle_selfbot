const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const mkdir = promisify(require("fs").mkdir);

module.exports = class Client {
  static async loadCommands(client) {
    const cmds = await readdir("./commands/").catch(async () => {
      await mkdir("./commands").catch(e => console.log(`Error when creating 'commands' dir => ${e}`));
    });
    client.funcs.log(`Loading a total of ${cmds.length} commands.`);
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
        console.error(`Error occured when loading command ${cmd} => ${err}`);
      }
    });
  }

  static async loadEvents(client) {
    const events = await readdir("./events/").catch(async () => {
      await mkdir("./events").catch(e => console.log(`Error when creating 'events' dir => ${e}`));
    });
    client.funcs.log(`Loading a total of ${events.length} events.`);
    events.forEach((file) => {
      try {
        const eventName = file.split(".")[0];
        const event = require(`../events/${file}`);
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`../events/${file}`)];
      } catch (err) {
        console.error(err);
      }
    });
  }

  static log(data) {
    const { bgBlue } = require("chalk");
    console.log(`${bgBlue(`[${new Date().toLocaleTimeString("en-US", { hour12: true })}]`)} ${data}`);
  }
};
