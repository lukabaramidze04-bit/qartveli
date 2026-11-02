const { Events } = require("discord.js");
const { log } = require("../src/core/log");
const { getSettings } = require("../src/core/guildSettings");

module.exports = {
  name: Events.MessageDelete,
  async execute(client, message) {
    if (!message.guild) return;
    if (message.partial) await message.fetch().catch(() => null);
    if (message.author?.bot) return;
    const author = message.author ? `${message.author.tag} (${message.author.id})` : "ავტორი ვერ დადგინდა";
    await log(message.guild, getSettings(message.guild.id), "🗑️ შეტყობინება წაიშალა", `${author}\nარხი: ${message.channel || "უცნობი"}\nშეტყობინების ID: ${message.id}`, 0xED4245);
  }
};
