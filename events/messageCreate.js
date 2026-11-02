const { Events, PermissionFlagsBits } = require("discord.js");
const { read, write } = require("../src/core/db");
const { log } = require("../src/core/log");
const { getSettings } = require("../src/core/guildSettings");
const spam = new Map();
module.exports = {
  name: Events.MessageCreate,
  async execute(client, message) {
    if (!message.guild || message.author.bot || !message.member) return;
    const cfg = getSettings(message.guild.id);
    // XP: simple cooldown, persisted per guild/user.
    const key = `${message.guild.id}:${message.author.id}`;
    const now = Date.now();
    const xpdb = read("xp", {});
    const profile = xpdb[key] || { xp: 0, level: 0, last: 0 };
    if (now - profile.last > 60000) {
      profile.xp += 5 + Math.floor(Math.random() * 6);
      profile.last = now;
      const next = Math.floor(5 * Math.sqrt(profile.xp / 100));
      if (next > profile.level) {
        profile.level = next;
        message.channel.send(`🎉 ${message.author}, ახალი ლეველი: **${next}**!`).catch(() => {});
      }
      xpdb[key] = profile; write("xp", xpdb);
    }
    // Lightweight anti-spam and mass-mention protection.
    const arr = spam.get(key) || [];
    arr.push(now);
    const recent = arr.filter(t => now - t < 7000);
    spam.set(key, recent);
    const isModerator = message.member.permissions.has(PermissionFlagsBits.ManageMessages);
    const spamHit = cfg.antiSpam && recent.length >= 6;
    const mentionHit = cfg.antiMention && message.mentions.users.size >= 6;
    if (!isModerator && (spamHit || mentionHit)) {
      const reason = mentionHit ? "მასობრივი ხსენება" : "სპამი (7 წამში 6 შეტყობინება)";
      let deleted = false;
      let timedOut = false;
      try { await message.delete(); deleted = true; }
      catch (e) { console.warn("[ANTI-SPAM] Could not delete message:", e.message); }
      try { await message.member.timeout(60000, `QARTVELI: ${reason}`); timedOut = true; }
      catch (e) { console.warn("[ANTI-SPAM] Could not timeout member:", e.message); }
      await log(message.guild, cfg, "🛡️ ავტომატური მოდერაცია", `${message.author.tag} (${message.author.id}) — ${reason} — ${message.channel}\nშეტყობინების წაშლა: ${deleted ? "კი" : "არა"}; 60-წამიანი timeout: ${timedOut ? "კი" : "არა"}`, 0xED4245);
      return;
    }
    if (!message.member.permissions.has("ManageMessages") && /(https?:\/\/|discord\.gg\/)/i.test(message.content) && message.content.length < 500) {
      // Link filter is deliberately off by default. Enable by setting config.blockLinks = true.
      if (cfg.blockLinks === true) await message.delete().catch(() => {});
    }
  }
};
