const { Events, ChannelType, PermissionFlagsBits } = require("discord.js");
module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(client, oldState, newState) {
    const lobbyId = client.config.tempVoiceLobbyId;
    if (!lobbyId || lobbyId.includes("PUT_") || newState.channelId !== lobbyId) return;
    try {
      const member = newState.member;
      const room = await newState.guild.channels.create({
        name: `${member.user.username}-room`.slice(0, 95),
        type: ChannelType.GuildVoice,
        parent: client.config.tempVoiceCategoryId || undefined,
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
