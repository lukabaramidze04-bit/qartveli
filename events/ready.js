const { Events } = require("discord.js");
const { cacheGuildInvites } = require("../features/invites");
module.exports = {
  name: Events.ClientReady, once: true,
  async execute(client) {
    for (const guild of client.guilds.cache.values()) await cacheGuildInvites(guild);
  }
};
