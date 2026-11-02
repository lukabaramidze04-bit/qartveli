const { Events } = require("discord.js");
const { log } = require("../src/core/log");
const { getSettings } = require("../src/core/guildSettings");

module.exports = {
  name: Events.GuildRoleDelete,
  async execute(client, role) {
    await log(role.guild, getSettings(role.guild.id), "➖ როლი წაიშალა", `${role.name} (${role.id})`, 0xED4245);
  }
};
