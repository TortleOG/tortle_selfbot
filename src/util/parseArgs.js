module.exports = (parsed, args) => {
  const newArgs = [];
  for (let i = 0; i < parsed.args.length; i++) {
    if (parsed.args[i].type === "str") newArgs.push(args[i]);
    else if (parsed.args[i].type === "int") newArgs.push(parseInt(args[i]));
    else if (parsed.args[i].type === "float") newArgs.push(parseFloat(args[i]));
    else if (parsed.args[i].type === "bool") newArgs.push(args[i]);
  }
  return newArgs;
};
