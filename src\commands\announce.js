const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
module.exports = {
 data: new SlashCommandBuilder().setName("announce").setDescription("გამოაქვეყნე განცხადება").setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild).addStringOption(o=>o.setName("text").setDescription("განცხადების ტექსტი").setRequired(true)),
 async execute(i,client) {
  const channel=client.config.announcementChannelId?await i.guild.channels.fetch(client.config.announcementChannelId):i.channel;
  await channel.send({embeds:[new EmbedBuilder().setTitle("📢 განცხადება").setDescription(i.options.getString("text")).setColor(0x5865F2).setFooter({text:`გამოაქვეყნა ${i.user.tag}`}).setTimestamp()]});
  return i.reply({content:`განცხადება გამოქვეყნდა ${channel}.`,ephemeral:true});
 }
};
