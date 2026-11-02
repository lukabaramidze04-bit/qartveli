const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
 data: new SlashCommandBuilder().setName("ranks").setDescription("გამოაქვეყნე ფერის რანგების არჩევის მენიუ").setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
 async execute(i, client) {
   const menu = new StringSelectMenuBuilder().setCustomId("rank_select").setPlaceholder("აირჩიე შენი ფერი").addOptions(
     { label: "თეთრი", value: "white", emoji: "⚪" },
     { label: "შავი", value: "black", emoji: "⚫" },
     { label: "წითელი", value: "red", emoji: "🔴" },
     { label: "ლურჯი", value: "blue", emoji: "🔵" },
     { label: "მწვანე", value: "green", emoji: "🟢" },
     { label: "იასამნისფერი", value: "purple", emoji: "🟣" }
   );
   const ch = client.config.ranksChannelId ? await i.guild.channels.fetch(client.config.ranksChannelId) : i.channel;
   await ch.send({ embeds: [new EmbedBuilder().setTitle("აირჩიე შენი რანკი").setDescription("აირჩიე ერთი ფერი ჩამოსაშლელი მენიუდან. არჩევანი შეცვლის წინა ფერის როლს.").setColor(0x5865F2)], components: [new ActionRowBuilder().addComponents(menu)] });
   await i.reply({ content: `რანკების პანელი გამოქვეყნდა ${ch}`, ephemeral: true });
 }
};
