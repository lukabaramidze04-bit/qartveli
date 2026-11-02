const {
  SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  ChannelSelectMenuBuilder, RoleSelectMenuBuilder, ChannelType
} = require('discord.js');
const { getSettings } = require('../core/guildSettings');

const BLUE = 0x5865F2;
const GREEN = 0x2ECC71;
const RED = 0xE74C3C;

function status(enabled) {
  return enabled ? '🟢 ჩართულია' : '🔴 გამორთულია';
}
function channel(id) {
  return id ? `<#${id}>` : '⚠️ არჩეული არ არის';
}
function role(id) {
  return id ? `<@&${id}>` : '⚠️ არჩეული არ არის';
}

function dashboardEmbed(guild, cfg, page = 'home') {
  const embed = new EmbedBuilder()
    .setColor(page === 'home' ? BLUE : GREEN)
    .setAuthor({ name: 'QARTVELI • მართვის ცენტრი', iconURL: guild.iconURL({ dynamic: true }) || undefined })
    .setTitle(page === 'home' ? '⚙️ სერვერის მართვის პანელი' : pageTitles[page])
    .setDescription(page === 'home'
      ? `მოგესალმები, **${guild.name}**!\n\nაქედან შეგიძლია მართო ბოტის ფუნქციები. აირჩიე ქვემოთ სასურველი განყოფილება და შეცვალე პარამეტრები პირდაპირ Discord-ში.`
      : pageDescriptions[page])
    .setFooter({ text: 'QARTVELI • პარამეტრები ინახება ამ სერვერისთვის' })
    .setTimestamp();

  if (page === 'home') {
    embed.addFields(
      { name: '👋 მისალმება', value: `${status(cfg.welcomeEnabled)}\nარხი: ${channel(cfg.welcomeChannelId)}`, inline: true },
      { name: '🎫 ტიკეტები', value: `${status(cfg.ticketsEnabled)}\nკატეგორია: ${channel(cfg.ticketCategoryId)}`, inline: true },
      { name: '📋 ლოგები', value: `${status(cfg.logsEnabled)}\nარხი: ${channel(cfg.logChannelId)}`, inline: true },
      { name: '🛡️ სპამის დაცვა', value: status(cfg.antiSpam), inline: true },
      { name: '📢 მასობრივი ხსენების დაცვა', value: status(cfg.antiMention), inline: true },
      { name: '👮 გუნდის როლი', value: role(cfg.staffRoleId), inline: true }
    );
    embed.addFields({ name: '💡 როგორ დავიწყო?', value: '1. აირჩიე განყოფილება\n2. მიუთითე სასურველი არხი ან როლი\n3. ჩართე შესაბამისი ფუნქცია ქვედა ღილაკით' });
  }
  if (page === 'welcome') {
    embed.addFields({ name: 'მიმდინარე პარამეტრები', value: `**სტატუსი:** ${status(cfg.welcomeEnabled)}\n**მისალმების არხი:** ${channel(cfg.welcomeChannelId)}` });
  }
  if (page === 'tickets') {
    embed.addFields(
      { name: 'მიმდინარე პარამეტრები', value: `**სტატუსი:** ${status(cfg.ticketsEnabled)}\n**ტიკეტების კატეგორია:** ${channel(cfg.ticketCategoryId)}\n**ტიკეტის პანელის არხი:** ${channel(cfg.ticketPanelChannelId)}\n**გუნდის როლი:** ${role(cfg.staffRoleId)}` },
      { name: 'ℹ️ შემდეგი ნაბიჯი', value: 'აირჩიე არხი და კატეგორია, მიუთითე გუნდის როლი, შემდეგ გამოაქვეყნე ტიკეტის პანელი ბრძანებით `/ticket-panel`.' }
    );
  }
  if (page === 'logs') {
    embed.addFields({ name: 'მიმდინარე პარამეტრები', value: `**სტატუსი:** ${status(cfg.logsEnabled)}\n**ლოგების არხი:** ${channel(cfg.logChannelId)}` });
  }
  if (page === 'roles') {
    embed.addFields({ name: 'მიმდინარე პარამეტრები', value: `**ავტომატური როლი:** ${role(cfg.autoRoleId)}\n**გუნდის როლი:** ${role(cfg.staffRoleId)}` });
  }
  return embed;
}

const pageTitles = {
  welcome: '👋 მისალმების პარამეტრები',
  tickets: '🎫 ტიკეტების პარამეტრები',
  logs: '📋 ლოგების პარამეტრები',
  roles: '🎨 როლების მართვა'
};
const pageDescriptions = {
  welcome: 'აირჩიე ტექსტური არხი, სადაც ახალი წევრების მისალმება გამოჩნდება.',
  tickets: 'მოაწესრიგე ტიკეტების სისტემა: არხი, კატეგორია და დამხმარე გუნდის როლი.',
  logs: 'აირჩიე არხი, სადაც სერვერის მნიშვნელოვანი მოვლენები ჩაიწერება.',
  roles: 'აირჩიე ავტომატური როლი ახალი წევრებისთვის და გუნდის როლი ტიკეტებისთვის.'
};

function dashboardRows(page, cfg) {
  const nav = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('qs:home').setLabel('მთავარი').setEmoji('🏠').setStyle(page === 'home' ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('qs:welcome').setLabel('მისალმება').setEmoji('👋').setStyle(page === 'welcome' ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('qs:tickets').setLabel('ტიკეტები').setEmoji('🎫').setStyle(page === 'tickets' ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('qs:logs').setLabel('ლოგები').setEmoji('📋').setStyle(page === 'logs' ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('qs:roles').setLabel('როლები').setEmoji('🎨').setStyle(page === 'roles' ? ButtonStyle.Primary : ButtonStyle.Secondary)
  );
  const toggles = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('qs:toggle-welcome').setLabel(cfg.welcomeEnabled ? 'მისალმების გამორთვა' : 'მისალმების ჩართვა').setEmoji('👋').setStyle(cfg.welcomeEnabled ? ButtonStyle.Danger : ButtonStyle.Success),
    new ButtonBuilder().setCustomId('qs:toggle-tickets').setLabel(cfg.ticketsEnabled ? 'ტიკეტების გამორთვა' : 'ტიკეტების ჩართვა').setEmoji('🎫').setStyle(cfg.ticketsEnabled ? ButtonStyle.Danger : ButtonStyle.Success),
    new ButtonBuilder().setCustomId('qs:toggle-logs').setLabel(cfg.logsEnabled ? 'ლოგების გამორთვა' : 'ლოგების ჩართვა').setEmoji('📋').setStyle(cfg.logsEnabled ? ButtonStyle.Danger : ButtonStyle.Success),
    new ButtonBuilder().setCustomId('qs:toggle-antispam').setLabel(cfg.antiSpam ? 'სპამის დაცვა: ჩართულია' : 'სპამის დაცვა: გამორთულია').setEmoji('🛡️').setStyle(cfg.antiSpam ? ButtonStyle.Success : ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('qs:toggle-antimention').setLabel(cfg.antiMention ? 'ხსენების დაცვა: ჩართულია' : 'ხსენების დაცვა: გამორთულია').setEmoji('📢').setStyle(cfg.antiMention ? ButtonStyle.Success : ButtonStyle.Secondary)
  );
  return [nav, toggles];
}

function selectRows(page) {
  if (page === 'welcome') return [
    new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder().setCustomId('qs-channel:welcomeChannelId').setPlaceholder('აირჩიე მისალმების არხი').setChannelTypes(ChannelType.GuildText))
  ];
  if (page === 'tickets') return [
    new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder().setCustomId('qs-channel:ticketPanelChannelId').setPlaceholder('აირჩიე ტიკეტის პანელის არხი').setChannelTypes(ChannelType.GuildText)),
    new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder().setCustomId('qs-channel:ticketCategoryId').setPlaceholder('აირჩიე ტიკეტების კატეგორია').setChannelTypes(ChannelType.GuildCategory)),
    new ActionRowBuilder().addComponents(new RoleSelectMenuBuilder().setCustomId('qs-role:staffRoleId').setPlaceholder('აირჩიე დამხმარე გუნდის როლი'))
  ];
  if (page === 'logs') return [
    new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder().setCustomId('qs-channel:logChannelId').setPlaceholder('აირჩიე ლოგების არხი').setChannelTypes(ChannelType.GuildText))
  ];
  if (page === 'roles') return [
    new ActionRowBuilder().addComponents(new RoleSelectMenuBuilder().setCustomId('qs-role:autoRoleId').setPlaceholder('აირჩიე ახალი წევრის ავტომატური როლი')),
    new ActionRowBuilder().addComponents(new RoleSelectMenuBuilder().setCustomId('qs-role:staffRoleId').setPlaceholder('აირჩიე დამხმარე გუნდის როლი'))
  ];
  return [];
}

module.exports = {
  data: new SlashCommandBuilder().setName('setup').setDescription('გახსენი QARTVELI-ის მართვის პანელი').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(i) {
    const cfg = getSettings(i.guildId);
    await i.reply({ embeds: [dashboardEmbed(i.guild, cfg)], components: [...dashboardRows('home', cfg), ...selectRows('home')], ephemeral: true });
  },
  dashboardEmbed, dashboardRows, selectRows
};
