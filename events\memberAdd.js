const { Events, EmbedBuilder } = require("discord.js");
const { identifyInvite, addInvite } = require("../features/invites");
const { log } = require("../core/log");
const { getSettings } = require("../core/guildSettings");
module.exports = {
  name: Events.GuildMemberAdd,
  async execute(client, member) {
    const cfg = getSettings(member.guild.id);
    const invite = await identifyInvite(member.guild);
    addInvite(member.guild.id, member.id, invite?.inviter?.id, invite?.code);
    if (cfg.autoRoleId) {
      try { await member.roles.add(cfg.autoRoleId, "Automatic member role"); }
      catch (e) { console.error("[AUTO ROLE]", e.message); }
    }
    if (cfg.welcomeEnabled && cfg.welcomeChannelId) {
      try {
        const ch = await member.guild.channels.fetch(cfg.welcomeChannelId);
        if (ch) await ch.send({ embeds: [new EmbedBuilder().setColor(0x57F287).setTitle("მოგესალმები!").setDescription(`${member} შემოუერთდა სერვერს!\nმოგიწვია: ${invite?.inviter ? `<@${invite.inviter.id}>` : "ვერ დადგინდა"}\nწევრი №${member.guild.memberCount}`).setThumbnail(member.user.displayAvatarURL()).setTimestamp()] });
      } catch (e) { console.error("[WELCOME]", e.message); }
    }
    if (cfg.logsEnabled && cfg.logChannelId) await log(member.guild, cfg, "წევრი შემოვიდა", `${member.user.tag} (${member.id})`, 0x57F287);
  }
};
