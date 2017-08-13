/* eslint-disable class-methods-use-this */

class Resolver {
  constructor(client) {
    Object.defineProperty(this, "client", { value: client });
  }

  async string(string) {
    return String(string);
  }

  async integer(integer) {
    if (isNaN(integer)) return null;
    integer = parseInt(integer);
    if (Number.isInteger(integer)) return integer;
    return null;
  }

  async float(float) {
    if (isNaN(float)) return null;
    float = parseFloat(float);
    return float;
  }

  async boolean(bool) {
    if (bool instanceof Boolean) return bool;
    if (["1", "true", "+", "t", "yes", "y"].includes(String(bool).toLowerCase())) return true;
    if (["0", "false", "-", "f", "no", "n"].includes(String(bool).toUpperCase())) return false;
    return null;
  }
}

module.exports = Resolver;
