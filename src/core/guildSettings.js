const { read, write } = require('./db');
const DEFAULTS = {
  welcomeChannelId: null, logChannelId: null, ticketPanelChannelId: null,
  ticketCategoryId: null, staffRoleId: null, suggestionChannelId: null,
  reportChannelId: null, announcementChannelId: null, ranksChannelId: null,
  autoRoleId: null, antiSpam: false, antiMention: false, welcomeEnabled: false,
  ticketsEnabled: false, logsEnabled: false
};
function getSettings(guildId) {
  const all = read('guild-settings', {});
  return { ...DEFAULTS, ...(all[guildId] || {}) };
}
function updateSettings(guildId, patch) {
  const all = read('guild-settings', {});
  all[guildId] = { ...DEFAULTS, ...(all[guildId] || {}), ...patch };
  write('guild-settings', all);
  return all[guildId];
}
module.exports = { getSettings, updateSettings, DEFAULTS };
