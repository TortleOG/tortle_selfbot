const Discord = require("discord.js");

exports.run = async (client, msg, [msgID]) => {
  try {
    msg.delete();
    const m = await msg.channel.fetchMessage(msgID);
    const embed = new Discord.MessageEmbed()
      .setColor(0x196619)
      .setAuthor(m.member.displayName, m.author.displayAvatarURL())
      .setDescription(`*${m.content}*`);
    return msg.channel.send({ embed });
  } catch (err) {
    client.emit("log", err, "error");
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["q"],
};

exports.help = {
  name: "quote",
  description: "Quotes a users message inside an embed",
  usage: "<msgID:str>",
  usageDelim: "",
};
