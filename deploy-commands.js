require("dotenv").config();
const { REST, Routes } = require("discord.js");
const { loadCommands } = require("./src/core/commands");

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
if (!token || !clientId) {
  console.error("Set DISCORD_TOKEN and CLIENT_ID in .env");
  process.exit(1);
}
const commands = [...loadCommands().values()].map(c => c.data.toJSON());
const rest = new REST({ version: "10" }).setToken(token);
rest.put(guildId ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId), { body: commands })
  .then(() => console.log(`Registered ${commands.length} ${guildId ? `guild commands to ${guildId}` : "global commands"}`))
  .catch(console.error);
