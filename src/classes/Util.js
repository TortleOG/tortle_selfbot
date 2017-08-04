module.exports = class Util {
  static async validateUsage(cmd, usage) {
    return usage !== "" && usage ? (usage = usage.split(" "), usage.forEach((c) => { // eslint-disable-line
      if (c[0] === "<") {
        if (c[c.length - 1] === ">") return !0;
        throw `Invalid usage statment at cmd: ${cmd.help.name}`;
      } else if (c[0] === "[") {
        if (c[c.length - 1] === "]") return !0;
        throw `Invalid usage statement at cmd: ${cmd.help.name}`;
      }
      throw `Invalid usage statement at cmd: ${cmd.help.name}`;
    })) : !0;
  }

  static parseUsage(usage) {
    if (usage === "" || !usage) return null;
    const args = [];
    usage = usage.split(" ");
    for (let i = 0, req = !1; i < usage.length; i++) {
      usage[i] = usage[i].split(":");
      if (usage[i][0][0] === "<") req = !0;
      args.push({
        name: usage[i][0].slice(1),
        type: usage[i][1].slice(0, -1),
        required: req,
      });
      req = !1;
    }
    return args;
  }

  static async validateArgs(parsed, args) {
    for (let i = 0; i < parsed.length; i++) {
      if (parsed[i].required && (args[i] === "" || args[i] === undefined)) throw `Missing required argument ${parsed.args[i].name}`;
      try {
        if (parsed[i].type === "str") Util.validateStr(args[i]);
        else if (parsed[i].type === "int") Util.validateInt(args[i]);
        else if (parsed[i].type === "float") Util.validateFloat(args[i]);
        else if (parsed[i].type === "bool") Util.validateBool(args[i]);
      } catch (err) {
        throw `${parsed[i].name} ${err}`;
      }
    }
  }

  static parseArgs(parsed, args) {
    const newArgs = [];
    for (let i = 0; i < parsed.length; i++) {
      if (parsed[i].type === "str") newArgs.push(args[i]);
      else if (parsed[i].type === "int") newArgs.push(parseInt(args[i]));
      else if (parsed[i].type === "float") newArgs.push(parseFloat(args[i]));
      else if (parsed[i].type === "bool") newArgs.push(args[i]);
    }
    return newArgs;
  }

  static validateStr(input) {
    if (typeof input !== "string") throw "argument must be a string.";
    return true;
  }

  static validateInt(input) {
    if (isNaN(input)) throw "argument must be an integer.";
    return !0;
  }

  static validateFloat(input) {
    if (isNaN(input)) throw "argument must be a floating point value.";
    return !0;
  }

  static validateBool(input) {
    if (input !== "true" && input !== "false") throw "argument must be 'true' or 'false'.";
    return !0;
  }
};
