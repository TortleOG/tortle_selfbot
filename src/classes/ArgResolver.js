const Resolver = require("./Resolver");

/* eslint-disable class-methods-use-this */

class ArgResolver extends Resolver {
  async literal(arg, currentUsage, possible, repeat) {
    if (arg.toLowerCase() === currentUsage.possibles[possible].name.toLowerCase()) return arg.toLowerCase();
    if (currentUsage.type === "optional" && !repeat) return null;
    throw [
      `Your option did not literally match the only possibility: (${currentUsage.possibles.map(poss => poss.name).join(", ")})`,
      "This is likely caused by a mistake in the usage string.",
    ].join("\n");
  }

  async str(...args) {
    return this.string(...args);
  }

  async string(arg, currentUsage, possible, repeat) {
    return arg;
  }

  async bool(...args) {
    return this.boolean(...args);
  }

  async boolean(arg, currentUsage, possible, repeat) {
    const boolean = await super.boolean();
    if (boolean !== null) return boolean;
    if (currentUsage.type === "optional" && !repeat) return null;
    throw `${currentUsage.possibles[possible].name} must be true or false.`;
  }

  async int(...args) {
    return this.integer(...args);
  }

  async integer(arg, currentUsage, possible, repeat) {
    arg = await super.integer(arg);
    if (arg === null) {
      if (currentUsage.type === "optional" && !repeat) return null;
      throw `${currentUsage.possibles[possible].name} must be an integer.`;
    }
    return arg;
  }

  async num(...args) {
    return this.float(...args);
  }

  async float(arg, currentUsage, possible, repeat) {
    arg = await super.float(arg);
    if (arg === null) {
      if (currentUsage.type === "optional" && !repeat) return null;
      throw `${currentUsage.possibles[possible].name} must be a valid number.`;
    }
    return arg;
  }
}

module.exports = ArgResolver;
