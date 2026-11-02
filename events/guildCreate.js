const { Events } = require("discord.js");
const { cacheGuildInvites } = require("../src/features/invites");
module.exports = { name: Events.GuildCreate, async execute(client, guild) { await cacheGuildInvites(guild); } };

