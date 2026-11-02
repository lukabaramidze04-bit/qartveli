const { read, write } = require("../core/db");
const cache = new Map();

async function cacheGuildInvites(guild) {
  try {
    const invites = await guild.invites.fetch();
    cache.set(guild.id, new Map(invites.map(i => [i.code, i.uses ?? 0])));
  } catch (e) { console.warn("[INVITES] Cannot fetch invites; check Manage Server permission:", e.message); }
}
async function identifyInvite(guild) {
  try {
    const before = cache.get(guild.id) || new Map();
    const current = await guild.invites.fetch();
    let used = null;
    for (const invite of current.values()) {
      if ((invite.uses ?? 0) > (before.get(invite.code) ?? 0)) { used = invite; break; }
    }
    cache.set(guild.id, new Map(current.map(i => [i.code, i.uses ?? 0])));
    return used;
  } catch (e) { console.warn("[INVITES] Could not identify invite:", e.message); return null; }
}
function addInvite(guildId, userId, inviterId, code) {
  const db = read("invites", {});
  db[`${guildId}:${userId}`] = { inviterId: inviterId || null, code: code || null, at: Date.now() };
  if (inviterId) db.counts = { ...(db.counts || {}), [`${guildId}:${inviterId}`]: ((db.counts || {})[`${guildId}:${inviterId}`] || 0) + 1 };
  write("invites", db);
}
function getInviteCount(guildId, userId) {
  const db = read("invites", {});
  return (db.counts || {})[`${guildId}:${userId}`] || 0;
}
module.exports = { cacheGuildInvites, identifyInvite, addInvite, getInviteCount };
