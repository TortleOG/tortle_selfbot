module.exports = class Util {
  // static validateUsage() {

  // }

  static parseUsage(usage) {
    if (usage === "" || !usage) return null;
    const obj = { args: [] };

    usage = usage.split(" ");

    for (let i = 0; i < usage.length; i++) {
      let required = false;
      usage[i] = usage[i].split(":");
      if (usage[i][0][0] === "<") required = true;
      obj.args.push({ name: usage[i][0].slice(1), type: usage[i][1].slice(0, -1), required });
    }

    return obj;
  }

  static async validateArgs(parsed, args) {
    for (let i = 0; i < parsed.args.length; i++) {
      if (parsed.args[i].required && (args[i] === "" || args[i] === undefined)) throw `missing required argument ${parsed.args[i].name}`;
      try {
        if (parsed.args[i].type === "str") Util.validateStr(args[i]);
        else if (parsed.args[i].type === "int") Util.validateInt(args[i]);
        else if (parsed.args[i].type === "float") Util.validateFloat(args[i]);
        else if (parsed.args[i].type === "bool") Util.validateBool(args[i]);
      } catch (err) {
        throw `${parsed.args[i].name} ${err}`;
      }
    }
  }

  static parseArgs(parsed, args) {
    const newArgs = [];
    for (let i = 0; i < parsed.args.length; i++) {
      if (parsed.args[i].type === "str") newArgs.push(args[i]);
      else if (parsed.args[i].type === "int") newArgs.push(parseInt(args[i]));
      else if (parsed.args[i].type === "float") newArgs.push(parseFloat(args[i]));
      else if (parsed.args[i].type === "bool") newArgs.push(args[i]);
    }
    return newArgs;
  }

  static validateStr(input) {
    if (typeof input !== "string") throw "argument must be a string.";
    return true;
  }

  static validateInt(input) {
    if (isNaN(input)) throw "argument must be an integer.";
    return true;
  }

  static validateFloat(input) {
    if (isNaN(input)) throw "argument must be a floating point value.";
    return true;
  }

  static validateBool(input) {
    if (input !== "true" && input !== "false") throw "argument must be 'true' or 'false'.";
    return true;
  }
};
