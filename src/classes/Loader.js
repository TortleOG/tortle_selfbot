const fs = require("fs-nextra");
const { resolve, join } = require("path");
const ParseUsage = require("./ParseUsage");

class Loader {
  constructor(client) {
    Object.defineProperty(this, "client", { value: client });
    const makeDirsObject = dir => ({
      commands: resolve(dir, "commands"),
      events: resolve(dir, "events"),
    });
    this.coreDirs = makeDirsObject(this.client.coreBaseDir);
  }

  async loadAll() {
    const [[commands, aliases], events] = await Promise.all([
      this.loadCommands(),
      this.loadEvents(),
    ]).catch((err) => {
      console.error(err);
      process.exit();
    });
    this.client.emit("log", [
      `Loaded ${commands} commands with ${aliases} aliases.`,
      `Loaded ${events} events.`,
    ].join("\n"));
  }

  async loadCommands() {
    this.client.commands.clear();
    this.client.aliases.clear();
    await this.walkCommandDirs(this.coreDirs.commands)
      .catch((err) => { throw err; });
    return [this.client.commands.size, this.client.aliases.size];
  }

  async walkCommandDirs(dir) {
    const files = await fs.readdir(dir).catch(() => {
      fs.ensureDir(dir).catch(e => this.client.emit("log", e, "error"));
    });
    if (!files) return false;
    await this.loadFiles(files.filter(file => file.endsWith(".js")).map(file => [file]), dir, this.loadNewCommand)
      .catch((err) => { throw err; });
  }

  loadNewCommand(file, dir) {
    const cmd = require(join(dir, ...file));
    this.client.commands.set(cmd.help.name, cmd);
    cmd.conf.aliases = cmd.conf.aliases || [];
    cmd.conf.aliases.forEach(alias => this.client.aliases.set(alias, cmd.help.name));
    cmd.usage = new ParseUsage(this.client, cmd);
    delete require.cache[join(dir, ...file)];
  }

  async loadEvents() {
    this.client.eventHandlers.forEach((listener, event) => this.client.removeListener(event, listener));
    this.client.eventHandlers.clear();
    const files = await fs.readdir(this.coreDirs.events).catch(() => {
      fs.ensureDir(this.coreDirs.events).catch((e) => { this.client.emit("log", e, "error"); });
    });
    if (files) {
      await this.loadFiles(files.filter(file => file.endsWith(".js")), this.coreDirs.events, this.loadNewEvent)
        .catch((err) => { throw err; });
    }
    return this.client.eventHandlers.size;
  }

  loadNewEvent(file, dir) {
    const eventName = file.split(".")[0];
    this.client.eventHandlers.set(eventName, (...args) => require(join(dir, file)).run(this.client, ...args));
    this.client.on(eventName, this.client.eventHandlers.get(eventName));
    delete require.cache[join(dir, file)];
  }

  async loadFiles(files, dir, loadNew) {
    try {
      files.forEach(file => loadNew.call(this, file, dir));
    } catch (err) {
      throw `\`\`\`${err.stack || err}\`\`\``;
    }
  }
}

module.exports = Loader;
