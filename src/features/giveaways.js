const { read, write } = require("../core/db");
const { EmbedBuilder } = require("discord.js");
const timers = new Map();

async function endGiveaway(client, id) {
  const db = read("giveaways", {});
  const g = db[id];
  if (!g || g.ended) return;
  try {
    const channel = await client.channels.fetch(g.channelId);
    const msg = await channel.messages.fetch(g.messageId);
    const users = await msg.reactions.cache.get("🎉")?.users.fetch();
    const entrants = users ? [...users.values()].filter(u => !u.bot) : [];
    const winner = entrants.length ? entrants[Math.floor(Math.random() * entrants.length)] : null;
    g.ended = true; g.winnerId = winner?.id || null; write("giveaways", db);
    await channel.send(winner ? `🎉 გათამაშება დასრულდა! გამარჯვებულია ${winner}. პრიზი: **${g.prize}**` : `გათამაშება დასრულდა, მონაწილე არ აღმოჩნდა. პრიზი: **${g.prize}**`);
    await msg.edit({ embeds: [new EmbedBuilder().setTitle("Giveaway დასრულდა").setDescription(`პრიზი: **${g.prize}**\nგამარჯვებული: ${winner || "არავინ"}`).setColor(0xF1C40F)] });
  } catch (e) { console.error("[GIVEAWAY END]", e); }
}
function startGiveawayTimers(client) {
  const db = read("giveaways", {});
  for (const [id, g] of Object.entries(db)) {
    if (!g.ended) {
      const delay = Math.max(0, g.endsAt - Date.now());
      timers.set(id, setTimeout(() => endGiveaway(client, id), Math.min(delay, 2147483647)));
      if (delay > 2147483647) timers.set(id, setTimeout(() => startGiveawayTimers(client), 2147483647));
    }
  }
}
module.exports = { endGiveaway, startGiveawayTimers };
