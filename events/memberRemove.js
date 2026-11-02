const { Events } = require("discord.js");
const { log } = require("../src/core/log");
const { getSettings } = require("../src/core/guildSettings");
module.exports = { name: Events.GuildMemberRemove, async execute(client, member) {
  const cfg = getSettings(member.guild.id);
  if (cfg.logsEnabled && cfg.logChannelId) await log(member.guild, cfg, "წევრი გავიდა", `${member.user.tag} (${member.id})`, 0xED4245);
} };
