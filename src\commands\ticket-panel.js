const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { getSettings } = require("../core/guildSettings");
module.exports = {
 data: new SlashCommandBuilder().setName("ticket-panel").setDescription("გამოაქვეყნე ტიკეტის პანელი").setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
 async execute(i, client) {
   const cfg = getSettings(i.guildId);
   if (!cfg.ticketsEnabled) return i.reply({ content: "ჯერ /setup-ში ჩართე Tickets და აირჩიე პანელის არხი.", ephemeral: true });
   const ch = cfg.ticketPanelChannelId ? await i.guild.channels.fetch(cfg.ticketPanelChannelId) : i.channel;
   await ch.send({ embeds: [new EmbedBuilder().setTitle("დახმარების ცენტრი").setDescription("დააჭირე ღილაკს ახალი ტიკეტის გასახსნელად.").setColor(0x5865F2)], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("ticket_open").setLabel("ტიკეტის გახსნა").setEmoji("🎫").setStyle(ButtonStyle.Primary))] });
   await i.reply({ content: `პანელი გამოქვეყნდა ${ch}`, ephemeral: true });
 }
};
