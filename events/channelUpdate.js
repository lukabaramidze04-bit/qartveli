const { Events } = require("discord.js");
const { log } = require("../src/core/log");
const { getSettings } = require("../src/core/guildSettings");

module.exports = {
  name: Events.ChannelUpdate,
  async execute(client, oldChannel, newChannel) {
    if (!newChannel.guild || oldChannel.name === newChannel.name) return;
    await log(newChannel.guild, getSettings(newChannel.guild.id), "✏️ არხის სახელი შეიცვალა", `${oldChannel.name} → ${newChannel.name} (${newChannel.id})`, 0xF1C40F);
  }
};
