const { inspect } = require("util");
const Discord = require("discord.js");

exports.run = async (client, msg, [input]) => {
  try {
    let evaled = eval(input);
    if (evaled instanceof Promise) evaled = await evaled;
    const type = typeof evaled;
    const insp = inspect(evaled, { depth: 0 });

    if (evaled.toString().includes(client.token) || insp.toString().includes(client.token)) return msg.channel.send("dumbass");

    if (evaled === null) evaled = "null";
    if (evaled === undefined) evaled = "undefined";
    if (evaled === "") evaled = "\u200b";
    if (insp === "[]") evaled = "\u200b";
    if (insp === "{}") evaled = "\u200b";

    const embed = new Discord.MessageEmbed()
      .setColor(0x00ff00)
      .addField("EVAL:", `\`\`\`js\n${input}\`\`\``)
      .addField("Evaluates to:", evaled);

    if (evaled instanceof Object) embed.addField("Inspect:", `\`\`\`js\n${insp}\`\`\``);
    else embed.addField("Type:", type);

    return msg.channel.send({ embed });
  } catch (err) {
    if (err.toString().includes(client.token)) return msg.channel.send("dumbass");

    const embed = new Discord.MessageEmbed()
      .setColor(0xff0000)
      .addField("EVAL:", input)
      .addField("Error:", err);

    return msg.channel.send({ embed });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["ev"],
};

exports.help = {
  name: "eval",
  description: "Evaluates javascript",
  usage: "<input:str>",
  usageDelim: "",
};
