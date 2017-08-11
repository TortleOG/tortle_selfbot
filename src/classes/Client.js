const Discord = require("discord.js");
const path = require("path");
const now = require("performance-now");
const Loader = require("./Loader");

class Client extends Discord.Client {
  constructor(config = {}) {
    if (typeof config !== "object") throw new TypeError("Client configuration must be an object.");
    super(config.clientOptions);
    this.config = config;
    if (!("prefix" in config)) this.config.prefix = "/";
    this.coreBaseDir = path.join(__dirname, "../");
    this.funcs = new Loader(this);
    this.commands = new Discord.Collection();
    this.aliases = new Discord.Collection();
    this.eventHandlers = new Discord.Collection();
    this.methods = {
      Collection: Discord.Collection,
      Embed: Discord.MessageEmbed,
    };
    // this.once("ready", this._ready.bind(this));
  }
  async login(token) {
    const start = now();
    await this.funcs.loadAll();
    this.emit("log", `Loaded in ${(now() - start).toFixed(2)}ms.`);
    super.login(token);
  }
}

module.exports = Client;
