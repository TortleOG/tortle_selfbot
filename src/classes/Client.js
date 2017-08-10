const Discord = require("discord.js");
const path = require("path");
const { promisify } = require("util");
const now = require("performance-now");
const readdir = promisify(require("fs").readdir);
const mkdir = promisify(require("fs").mkdir);
const ParseUsage = require("./ParseUsage");

class Client extends Discord.Client {
  constructor(config = {}) {
    if (typeof config !== "object") throw new TypeError("Client configuration must be an object.");
    super(config.clientOptions);
    this.config = config;
    if (!("prefix" in config)) this.config.prefix = "/";
    this.coreBaseDir = path.join(__dirname, "../");
    this.commands = new Discord.Collection();
    this.aliases = new Discord.Collection();
    this.methods = {
      Collection: Discord.Collection,
      Embed: Discord.MessageEmbed,
    };
    // this.once("ready", this._ready.bind(this));
  }
  async login(token) {
    const start = now();
    await this.loadCommands(this);
    await this.loadEvents(this);
    this.emit("log", `Loaded in ${(now() - start).toFixed(2)}ms.`);
    super.login(token);
  }

  async loadCommands(client) {
    const cmds = await readdir("./commands/").catch(async () => {
      await mkdir("./commands").catch(e => this.emit("log", `Error when creating 'commands' dir => ${e}`, "error"));
    });
    this.emit("log", `Loading a total of ${cmds.length} commands.`);
    cmds.forEach((cmd) => {
      try {
        const props = require(`../commands/${cmd}`);

        if (cmd.split(".").slice(-1)[0] !== "js") return;
        props.usage = new ParseUsage(props);
        client.commands.set(props.help.name, props);

        if (!props.conf.aliases) props.conf.aliases = [];
        props.conf.aliases.forEach((alias) => {
          client.aliases.set(alias, props.help.name);
        });

        if (props.init) props.init(client);
      } catch (err) {
        this.emit("log", `Error occured when loading command ${cmd} => ${err.stack}`, "error");
      }
    });
  }

  async loadEvents(client) {
    const events = await readdir("./events/").catch(async () => {
      await mkdir("./events").catch(e => this.emit("log", `Error when creating 'events' dir => ${e}`, "error"));
    });
    this.emit("log", `Loading a total of ${events.length} events.`);
    events.forEach((file) => {
      try {
        const eventName = file.split(".")[0];
        const event = require(`../events/${file}`);
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`../events/${file}`)];
      } catch (err) {
        this.emit("log", err, "error");
      }
    });
  }
}

module.exports = Client;
