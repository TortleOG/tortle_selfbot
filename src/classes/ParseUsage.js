/* eslint-disable class-methods-use-this */

class ParseUsage {
  constructor(client, command) {
    Object.defineProperty(this, "client", { value: client });
    this.names = [command.help.name, ...command.conf.aliases];
    this.commands = this.names.length === 1 ? this.names[0] : `(${this.names.join("|")})`;
    this.deliminatedUsage = command.help.usage !== "" ? `${command.help.usage.split(" ").join(command.help.usageDelim)}` : "";
    this.usageString = command.help.usage;
    this.parsedUsage = this.parseUsage();
  }

  parseUsage() {
    let usage = {
      tags: [],
      opened: 0,
      current: "",
      openReq: false,
      last: false,
      char: 0,
      from: 0,
      at: "",
      fromTo: "",
    };

    this.usageString.split("").forEach((ele, i) => {
      usage.char = i + 1;
      usage.from = usage.char - usage.current.length;
      usage.at = `at char #${usage.char} '${ele}'`;
      usage.fromTo = `from char #${usage.from} to #${usage.char} '${usage.current}'`;

      if (usage.last && ele !== " ") throw `${usage.at}: There cannot be anything else after a repeat tag.`;

      if (this[ele]) {
        usage = this[ele](usage);
      } else {
        usage.current += ele;
      }
    });
    if (usage.opened) throw `From char #${this.usageString.length - usage.current.length} '${this.usageString.substr(-usage.current.length - 1)}' to end: A tag was left open.`;
    if (usage.current) throw `From char #${(this.usageString.length + 1) - usage.current.length} to end '${usage.current}': A literal was found outside a tag.`;
    return usage.tags;
  }

  ["<"](usage) {
    if (usage.opened) throw `${usage.at}: You cannot open another tag inside a tag.`;
    if (usage.current) throw `${usage.fromTo}: There cannot be a literal outside a tag.`;
    usage.opened++;
    usage.openReq = true;
    return usage;
  }

  [">"](usage) {
    if (!usage.opened) throw `${usage.at}: Invalid close tag found.`;
    if (!usage.openReq) throw `${usage.at}: Invalid closure of '[' tag with '>'.`;
    usage.opened--;
    if (usage.current) {
      usage.tags.push({
        type: "required",
        possibles: this.parseTags(usage.current, usage.tags.length + 1),
      });
      usage.current = "";
    } else { throw `${usage.at}: Empty tag found.`; }
    return usage;
  }

  ["["](usage) {
    if (usage.opened) throw `${usage.at}: You cannot open another tag inside a tag.`;
    if (usage.current) throw `${usage.fromTo}: There cannot be a literal outside a tag.`;
    usage.opened++;
    usage.openReq = false;
    return usage;
  }

  ["]"](usage) {
    if (!usage.opened) throw `${usage.at}: Invalid close tag found.`;
    if (usage.openReq) throw `${usage.at}: Invalid closure of '<' tag with ']'.`;
    usage.opened--;
    if (usage.current === "...") {
      if (usage.tags.length < 1) throw `${usage.fromTo}: There cannot be a loop at the beginning.`;
      usage.tags.push({ type: "repeat" });
      usage.last = true;
      usage.current = "";
    } else if (usage.current) {
      usage.tags.push({
        type: "optional",
        possibles: this.parseTags(usage.current, usage.tags.length + 1),
      });
      usage.current = "";
    } else { throw `${usage.at}: Empty tag found.`; }
    return usage;
  }

  [" "](usage) {
    if (usage.opened) throw `${usage.at}: There cannot be a space inside a tag.`;
    if (usage.current) throw `${usage.fromTo}: There cannot be a literal outside a tag.`;
    return usage;
  }

  ["\n"](usage) {
    throw `${usage.at}: There cannot be a line break in the command.`;
  }

  parseTags(tag, count) {
    const literals = [];
    const types = [];
    const toRet = [];

    const members = tag.split("|");

    members.forEach((element, i) => {
      const current = `at tag #${count} at bound #${i + 1}`;
      const result = /^([^:]+)(?::([^{}]+))?(?:{([^,]+)?(?:,(.+))?})?$/i.exec(element);
      if (!result) throw `${current}: Invalid syntax, non-specific.`;
      const fill = {
        name: result[1],
        type: result[2] ? result[2].toLowerCase() : "literal",
      };
      if (fill.type === "literal") {
        if (literals.includes(fill.name)) throw `${current} There cannot be two literals with the same name.`;
        literals.push(fill.name);
      } else if (members.length > 1) {
        if (fill.type === "string" && members.length - 1 !== i) throw `${current}: The 'String' type is vague, you must specifiy it at the last bound.`;
        if (types.includes(fill.type)) throw `${current}: There cannot be two bounds with the same type (${fill.type}).`;
        types.push(fill.type);
      }
      toRet.push(fill);
    });
    return toRet;
  }
}

module.exports = ParseUsage;
