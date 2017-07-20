module.exports = (usage) => {
  const obj = { args: [] };

  usage = usage.split(" ");

  for (let i = 0; i < usage.length; i++) {
    let required = false;
    usage[i] = usage[i].split(":");
    if (usage[i][0][0] === "<") required = true;
    obj.args.push({ name: usage[i][0].slice(1), type: usage[i][1].slice(0, -1), required });
  }

  return obj;
};
