const { Events } = require("discord.js");
const { log } = require("../src/core/log");
const { getSettings } = require("../src/core/guildSettings");

module.exports = {
  name: Events.ChannelCreate,
  async execute(client, channel) {
    if (!channel.guild) return;
    await log(channel.guild, getSettings(channel.guild.id), "➕ არხი შეიქმნა", `${channel.name} (${channel.id})`, 0x57F287);
  }
};
