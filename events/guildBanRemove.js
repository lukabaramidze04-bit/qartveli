const { Events } = require("discord.js");
const { log } = require("../src/core/log");
const { getSettings } = require("../src/core/guildSettings");

module.exports = {
  name: Events.GuildBanRemove,
  async execute(client, ban) {
    await log(ban.guild, getSettings(ban.guild.id), "✅ წევრის ბანი მოიხსნა", `${ban.user.tag} (${ban.user.id})`, 0x57F287);
  }
};
