const { Events } = require("discord.js");
const { log } = require("../src/core/log");
const { getSettings } = require("../src/core/guildSettings");

module.exports = {
  name: Events.ChannelDelete,
  async execute(client, channel) {
    if (!channel.guild) return;
    await log(channel.guild, getSettings(channel.guild.id), "➖ არხი წაიშალა", `${channel.name} (${channel.id})`, 0xED4245);
  }
};
