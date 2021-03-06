/* eslint-disable no-underscore-dangle, newline-per-chained-call */

class CommandMessage {
  constructor(msg, cmd, prefix, prefixLength) {
    Object.defineProperty(this, "client", { value: msg.client });
    this.msg = msg;
    this.cmd = cmd;
    this.prefix = prefix;
    this.prefixLength = prefixLength;
    this.args = this.constructor.getArgs(this);
    this.params = [];
    this._currentUsage = {};
    this._repeat = false;
  }

  async validateArgs() {
    if (this.params.length >= this.cmd.usage.parsedUsage.length && this.params.length >= this.args.length) {
      return this.params;
    } else if (this.cmd.usage.parsedUsage[this.params.length]) {
      if (this.cmd.usage.parsedUsage[this.params.length].type !== "repeat") this._currentUsage = this.cmd.usage.parsedUsage[this.params.length];
      else if (this.cmd.usage.parsedUsage[this.params.length].type === "repeat") {
        this._currentUsage.type = "optional";
        this._repeat = true;
      }
    } else if (!this._repeat) {
      return this.params;
    }
    if (this._currentUsage.type === "optional" && (this.args[this.params.length] === undefined || this.args[this.params.length] === "")) {
      if (this.cmd.usage.parsedUsage.slice(this.params.length).some(usage => usage.type === "required")) {
        this.args.splice(this.params.length, 0, undefined);
        this.args.splice(this.params.length, 1, null);
        throw "Missing one or more required arguments after input.";
      } else {
        return this.params;
      }
    } else if (this._currentUsage.type === "required" && this.args[this.params.length] === undefined) {
      this.args.splice(this.params.length, 1, null);
      throw this._currentUsage.possibles.length === 1 ?
        `${this._currentUsage.possibles[0].name} is a required argument.` : `Missing a required option: (${this._currentUsage.possibles.map(poss => poss.name).join(", ")})`;
    } else if (this._currentUsage.possibles.length === 1) {
      if (this.client.argResolver[this._currentUsage.possibles[0].type]) {
        return this.client.argResolver[this._currentUsage.possibles[0].type](this.args[this.params.length], this._currentUsage, 0, this._repeat, this.msg)
          .catch((err) => {
            this.args.splice(this.params.length, 1, null);
            throw err;
          })
          .then((res) => {
            if (res !== null) {
              this.params.push(res);
              return this.validateArgs();
            }
            this.args.splice(this.params.length, 0, undefined);
            this.params.push(undefined);
            return this.validateArgs();
          });
      }
      this.client.emit("log", "Unkown argument type encountered", "error");
      return this.validateArgs();
    } else {
      console.log("oh no");
    }
  }

  static getArgs(cmdMsg) {
    const args = cmdMsg.msg.content.slice(cmdMsg.prefixLength).trim().split(" ").slice(1).join(" ")
      .split(cmdMsg.cmd.help.usageDelim !== "" ? cmdMsg.cmd.help.usageDelim : undefined);
    if (args[0] === "") return [];
    return args;
  }
}

module.exports = CommandMessage;
