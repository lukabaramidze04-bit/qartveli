const { Events, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { safeReply } = require("../src/core/safeReply");
const { read, write } = require("../src/core/db");
const { log } = require("../src/core/log");
const { getSettings, updateSettings } = require("../src/core/guildSettings");
const setupUI = require("../src/commands/setup");

module.exports = {
  name: Events.InteractionCreate,
  async execute(client, i) {
    if (i.isChatInputCommand()) {
      const command = client.commands.get(i.commandName);
      if (!command) return;
      try { await command.execute(i, client); }
      catch (e) { console.error(`[COMMAND ${i.commandName}]`, e); await safeReply(i, { content: "შეცდომა მოხდა. შეამოწმე ბოტის უფლებები და კონსოლი." }); }
      return;
    }
    // QARTVELI private setup dashboard: each server has its own saved settings.
    if (i.customId?.startsWith("qs:") || i.customId?.startsWith("qs-channel:") || i.customId?.startsWith("qs-role:")) {
      if (!i.guild || !i.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
        return safeReply(i, { content: "მართვის პანელის გამოყენება მხოლოდ სერვერის ადმინისტრატორს შეუძლია." });
      }
      const cfg = getSettings(i.guildId);
      if (i.isButton()) {
        const action = i.customId.slice(3);
        if (action === "toggle-welcome") updateSettings(i.guildId, { welcomeEnabled: !cfg.welcomeEnabled });
        else if (action === "toggle-tickets") updateSettings(i.guildId, { ticketsEnabled: !cfg.ticketsEnabled });
        else if (action === "toggle-logs") updateSettings(i.guildId, { logsEnabled: !cfg.logsEnabled });
        else if (action === "toggle-antispam") updateSettings(i.guildId, { antiSpam: !cfg.antiSpam });
        else if (action === "toggle-antimention") updateSettings(i.guildId, { antiMention: !cfg.antiMention });
        const page = ["home", "welcome", "tickets", "logs", "roles"].includes(action) ? action : "home";
        const latest = getSettings(i.guildId);
        return i.update({ embeds: [setupUI.dashboardEmbed(i.guild, latest, page)], components: [...setupUI.dashboardRows(page, latest), ...setupUI.selectRows(page)] });
      }
      if (i.isChannelSelectMenu()) {
        const key = i.customId.split(":")[1];
        updateSettings(i.guildId, { [key]: i.values[0] });
      } else if (i.isRoleSelectMenu()) {
        const key = i.customId.split(":")[1];
        updateSettings(i.guildId, { [key]: i.values[0] });
      }
      const page = i.customId.includes("welcome") ? "welcome" : i.customId.includes("ticket") ? "tickets" : i.customId.includes("log") ? "logs" : "roles";
      const latest = getSettings(i.guildId);
      return i.update({ embeds: [setupUI.dashboardEmbed(i.guild, latest, page)], components: [...setupUI.dashboardRows(page, latest), ...setupUI.selectRows(page)] });
    }
    if (i.isStringSelectMenu() && i.customId === "rank_select") {
      const roleId = client.config.rankRoleIds[i.values[0]];
      if (!roleId || roleId.includes("PUT_")) return safeReply(i, { content: "როლის ID ჯერ არ არის კონფიგურირებული." });
      try {
        const all = Object.values(client.config.rankRoleIds).filter(x => x && !x.includes("PUT_"));
        await i.member.roles.remove(all);
        await i.member.roles.add(roleId);
        return safeReply(i, { content: `როლი განახლდა: **${i.values[0]}**` });
      } catch (e) { console.error("[RANK SELECT]", e); return safeReply(i, { content: "როლის მიცემა ვერ მოხერხდა. შეამოწმე Manage Roles და ბოტის როლის იერარქია." }); }
    }
    if (i.isButton()) {
      if (i.customId === "ticket_open") {
        const guildCfg = getSettings(i.guildId);
        if (!guildCfg.ticketsEnabled) {
          return safeReply(i, { content: "Ticket სისტემა ჯერ არ არის კონფიგურირებული. ადმინისტრატორმა გამოიყენოს /setup." });
        }
        try {
          const existing = i.guild.channels.cache.find(c => c.name === `ticket-${i.user.id}`);
          if (existing) return safeReply(i, { content: `შენი ტიკეტი უკვე არსებობს: ${existing}` });
          const perms = [
            { id: i.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: i.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles] }
          ];
          if (guildCfg.staffRoleId) perms.push({ id: guildCfg.staffRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] });
          const ch = await i.guild.channels.create({ name: `ticket-${i.user.id}`, type: ChannelType.GuildText, parent: guildCfg.ticketCategoryId || undefined, permissionOverwrites: perms });
          await ch.send({ content: `${i.user} დახმარება გჭირდება? ${guildCfg.staffRoleId ? `<@&${guildCfg.staffRoleId}>` : ""}`, embeds: [new EmbedBuilder().setTitle("Support Ticket").setDescription("აღწერე შენი პრობლემა. Staff-ს შეუძლია Claim ღილაკით ტიკეტის აღება.").setColor(0x5865F2)], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("ticket_claim").setLabel("Claim").setStyle(ButtonStyle.Success), new ButtonBuilder().setCustomId("ticket_close").setLabel("Close").setStyle(ButtonStyle.Danger))] });
          return safeReply(i, { content: `ტიკეტი შეიქმნა: ${ch}` });
        } catch (e) { console.error("[TICKET OPEN]", e); return safeReply(i, { content: "ტიკეტის შექმნა ვერ მოხერხდა. შეამოწმე Manage Channels და კატეგორიის ID." }); }
      }
      if (i.customId === "ticket_claim") {
        const staffRoleId = getSettings(i.guildId).staffRoleId;
        if (staffRoleId && !i.member.roles.cache.has(staffRoleId) && !i.member.permissions.has(PermissionFlagsBits.ManageChannels)) return safeReply(i, { content: "Claim-ისთვის Staff როლი გჭირდება." });
        await i.channel.setTopic(`Claimed by ${i.user.tag}`).catch(() => {});
        await i.channel.send(`🛠️ ტიკეტი აიღო ${i.user}.`);
        return safeReply(i, { content: "ტიკეტი შენ აიღე." });
      }
      if (i.customId === "ticket_close") {
        const staffRoleId = getSettings(i.guildId).staffRoleId;
        if (staffRoleId && !i.member.roles.cache.has(staffRoleId) && !i.member.permissions.has(PermissionFlagsBits.ManageChannels)) return safeReply(i, { content: "ტიკეტის დახურვა Staff-ს შეუძლია." });
        await safeReply(i, { content: "ტიკეტი 5 წამში დაიხურება." });
        setTimeout(() => i.channel.delete("Ticket closed").catch(() => {}), 5000);
      }
    }
  }
};

