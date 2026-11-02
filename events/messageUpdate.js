const { Events } = require("discord.js");
const { log } = require("../src/core/log");
const { getSettings } = require("../src/core/guildSettings");

module.exports = {
  name: Events.MessageUpdate,
  async execute(client, oldMessage, newMessage) {
    if (!newMessage.guild) return;
    if (oldMessage.partial) await oldMessage.fetch().catch(() => null);
    if (newMessage.partial) await newMessage.fetch().catch(() => null);
    if (!newMessage.author || newMessage.author.bot || oldMessage.content === newMessage.content) return;
    await log(newMessage.guild, getSettings(newMessage.guild.id), "✏️ შეტყობინება შეიცვალა", `${newMessage.author.tag} (${newMessage.author.id})\nარხი: ${newMessage.channel}\nშეტყობინების ID: ${newMessage.id}`, 0xF1C40F);
  }
};
