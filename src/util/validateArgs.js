const validateStr = async (input) => {
  if (typeof input !== "string") throw "argument must be a string.";
  return true;
};

const validateInt = (input) => {
  if (isNaN(input)) throw "argument must be an integer.";
  return true;
};

const validateFloat = (input) => {
  if (isNaN(input)) throw "argument must be a floating point value.";
  return true;
};

const validateBool = (input) => {
  if (input !== "true" && input !== "false") throw "argument must be 'true' or 'false'.";
  return true;
};

module.exports = async (parsed, args) => {
  for (let i = 0; i < parsed.args.length; i++) {
    if (parsed.args[i].required && (args[i] === "" || args[i] === undefined)) throw `missing required argument ${parsed.args[i].name}`;
    try {
      if (parsed.args[i].type === "str") validateStr(args[i]);
      else if (parsed.args[i].type === "int") validateInt(args[i]);
      else if (parsed.args[i].type === "float") validateFloat(args[i]);
      else if (parsed.args[i].type === "bool") validateBool(args[i]);
    } catch (err) {
      throw `${parsed.args[i].name} ${err}`;
    }
  }
};
