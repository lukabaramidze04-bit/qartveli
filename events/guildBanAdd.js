const { Events } = require("discord.js");
const { log } = require("../src/core/log");
const { getSettings } = require("../src/core/guildSettings");

module.exports = {
  name: Events.GuildBanAdd,
  async execute(client, ban) {
    await log(ban.guild, getSettings(ban.guild.id), "⛔ წევრი დაიბანა", `${ban.user.tag} (${ban.user.id})\nმიზეზი: ${ban.reason || "არ არის მითითებული"}`, 0xED4245);
  }
};
