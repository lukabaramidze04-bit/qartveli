const { Events } = require("discord.js");
const { log } = require("../src/core/log");
const { getSettings } = require("../src/core/guildSettings");

module.exports = {
  name: Events.GuildRoleCreate,
  async execute(client, role) {
    await log(role.guild, getSettings(role.guild.id), "➕ როლი შეიქმნა", `${role.name} (${role.id})`, 0x57F287);
  }
};
