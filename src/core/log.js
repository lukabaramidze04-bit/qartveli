const { EmbedBuilder } = require("discord.js");
async function log(guild, config, title, description, color = 0x5865F2) {
  if (!config.logsEnabled || !config.logChannelId) return false;
  try {
    const channel = await guild.channels.fetch(config.logChannelId);
    if (!channel?.isTextBased()) return false;
    await channel.send({
      allowedMentions: { parse: [] },
      embeds: [new EmbedBuilder().setColor(color).setTitle(title).setDescription(String(description).slice(0, 4000)).setTimestamp()]
    });
    return true;
  } catch (e) { console.error("[LOG FEATURE]", e.message); return false; }
}
module.exports = { log };
