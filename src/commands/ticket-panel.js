const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { getSettings } = require("../core/guildSettings");
module.exports = {
 data: new SlashCommandBuilder().setName("ticket-panel").setDescription("გამოაქვეყნე ტიკეტის პანელი").setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
 async execute(i, client) {
   const cfg = getSettings(i.guildId);
   if (!cfg.ticketsEnabled) return i.reply({ content: "ჯერ /setup-ში ჩართე Tickets და აირჩიე პანელის არხი.", ephemeral: true });
   const ch = cfg.ticketPanelChannelId ? await i.guild.channels.fetch(cfg.ticketPanelChannelId).catch(() => null) : i.channel;
   if (!ch?.isTextBased()) return i.reply({ content: "ტიკეტის პანელის არხი ვერ მოიძებნა. /setup → ტიკეტები-ში აირჩიე ტექსტური არხი.", ephemeral: true });
   const permissions = ch.permissionsFor(client.user);
   if (!permissions?.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])) {
     return i.reply({ content: `ბოტს ${ch}-ში View Channel, Send Messages და Embed Links უფლებები სჭირდება.`, ephemeral: true });
   }
   await ch.send({ embeds: [new EmbedBuilder().setTitle("დახმარების ცენტრი").setDescription("დააჭირე ღილაკს ახალი ტიკეტის გასახსნელად.").setColor(0x5865F2)], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("ticket_open").setLabel("ტიკეტის გახსნა").setEmoji("🎫").setStyle(ButtonStyle.Primary))] });
   await i.reply({ content: `პანელი გამოქვეყნდა ${ch}`, ephemeral: true });
 }
};
