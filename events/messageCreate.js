const { Events } = require("discord.js");
const { read, write } = require("../core/db");
const { log } = require("../core/log");
const { getSettings } = require("../core/guildSettings");
const spam = new Map();
module.exports = {
  name: Events.MessageCreate,
  async execute(client, message) {
    if (!message.guild || message.author.bot) return;
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
    if (!message.member.permissions.has("ManageMessages") && ((cfg.antiSpam && recent.length >= 6) || (cfg.antiMention && message.mentions.users.size >= 6))) {
      try { await message.delete(); await message.member.timeout(60000, "Anti-spam / mass mention"); }
      catch (e) { console.warn("[ANTI-SPAM] Could not moderate:", e.message); }
      return;
    }
    if (!message.member.permissions.has("ManageMessages") && /(https?:\/\/|discord\.gg\/)/i.test(message.content) && message.content.length < 500) {
      // Link filter is deliberately off by default. Enable by setting config.blockLinks = true.
      if (cfg.blockLinks === true) await message.delete().catch(() => {});
    }
  }
};
