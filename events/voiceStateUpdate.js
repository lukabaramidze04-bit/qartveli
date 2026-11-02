const { Events, ChannelType, PermissionFlagsBits } = require("discord.js");
const { getSettings } = require("../src/core/guildSettings");
module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(client, oldState, newState) {
    const settings = getSettings(newState.guild.id);
    const lobbyId = settings.tempVoiceLobbyId || client.config.tempVoiceLobbyId;
    const categoryId = settings.tempVoiceCategoryId || client.config.tempVoiceCategoryId;
    if (!lobbyId || lobbyId.includes("PUT_") || newState.channelId !== lobbyId) return;
    try {
      const member = newState.member;
      const room = await newState.guild.channels.create({
        name: `${member.user.username}-room`.slice(0, 95),
        type: ChannelType.GuildVoice,
        parent: categoryId && !categoryId.includes("PUT_") ? categoryId : undefined,
        permissionOverwrites: [
          { id: member.id, allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MoveMembers, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak] }
        ]
      });
      await member.voice.setChannel(room);
    } catch (e) { console.error("[TEMP VOICE CREATE]", e.message); }
    if (oldState.channel && oldState.channel.id !== lobbyId &&
        oldState.channel.members.size === 0 &&
        oldState.channel.name.endsWith("-room")) {
      await oldState.channel.delete("Temporary voice room is empty").catch(() => {});
    }
  }
};
