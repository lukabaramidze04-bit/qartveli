module.exports = {
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID,
  logChannelId: process.env.LOG_CHANNEL_ID,
  ticketPanelChannelId: process.env.TICKET_PANEL_CHANNEL_ID,
  ticketCategoryId: process.env.TICKET_CATEGORY_ID,
  staffRoleId: process.env.STAFF_ROLE_ID || process.env.TICKET_SUPPORT_ROLE_ID,
  suggestionChannelId: process.env.SUGGESTION_CHANNEL_ID,
  reportChannelId: process.env.REPORT_CHANNEL_ID,
  announcementChannelId: process.env.ANNOUNCEMENT_CHANNEL_ID,
  ranksChannelId: process.env.RANKS_CHANNEL_ID,
  autoRoleId: process.env.AUTO_ROLE_ID,
  ticketCategoryName: process.env.TICKET_CATEGORY_NAME || "Tickets",
  // Create these roles in Discord and paste their IDs here.
  rankRoleIds: {
    white: "PUT_WHITE_ROLE_ID_HERE",
    black: "PUT_BLACK_ROLE_ID_HERE",
    red: "PUT_RED_ROLE_ID_HERE",
    blue: "PUT_BLUE_ROLE_ID_HERE",
    green: "PUT_GREEN_ROLE_ID_HERE",
    purple: "PUT_PURPLE_ROLE_ID_HERE"
  },
  tempVoiceLobbyId: "PUT_TEMP_VOICE_LOBBY_ID_HERE",
  tempVoiceCategoryId: process.env.TICKET_CATEGORY_ID || null
};
