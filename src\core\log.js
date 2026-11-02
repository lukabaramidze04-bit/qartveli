const { EmbedBuilder } = require("discord.js");
async function log(guild, config, title, description, color = 0x5865F2) {
  if (!config.logChannelId) return;
  try {
    const channel = await guild.channels.fetch(config.logChannelId);
    if (channel?.isTextBased()) await channel.send({
      embeds: [new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).setTimestamp()]
    });
  } catch (e) { console.error("[LOG FEATURE]", e.message); }
}
module.exports = { log };
