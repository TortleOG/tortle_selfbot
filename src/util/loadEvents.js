const { promisify } = require("util");

const readdir = promisify(require("fs").readdir);
const mkdir = promisify(require("fs").mkdir);

module.exports = async (client) => {
  const events = await readdir("./events/").catch(async () => {
    await mkdir("./events").catch(e => console.log(`Error when creating 'events' dir => ${e}`));
  });
  console.log(`Loading a total of ${events.length} events.`);
  events.forEach((file) => {
    const eventName = file.split(".")[0];
    const event = require(`../events/${file}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`../events/${file}`)];
  });
};
