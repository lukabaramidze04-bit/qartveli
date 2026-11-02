# QARTVELI Discord Bot

Modular Discord.js v14 bot. Features are split into separate files so a failure in one feature is less likely to stop the others.

## Requirements
- Node.js 20+
- A Discord application and bot
- Enable **Server Members Intent** and **Message Content Intent** in Developer Portal if you want welcome/member tracking and XP/anti-spam features.
- Invite the bot with `bot` and `applications.commands` scopes. Give only the permissions it needs (Manage Roles, Manage Channels, Moderate Members, Manage Messages, View Audit Log, Send Messages, Embed Links, Read Message History).

## Setup (Windows)
1. Extract the ZIP.
2. Open CMD inside the `QARTVELI` folder.
3. Run `npm install`.
4. Rename `.env.example` to `.env` and fill in the values.
5. Run `npm run commands` to register slash commands to the server in `GUILD_ID`.
6. Run `npm start`.

Never share `.env` or your bot token. If a token leaks, reset it in Discord Developer Portal.

## Included
- Slash-command moderation: ban, kick, timeout, warn, warnings, clear, lock, unlock, slowmode
- Welcome and member counter voice channel (optional)
- Invite tracking (best-effort; Discord may not identify every invite)
- Ticket panel with **Claim** and **Close** buttons
- Self-assignable rank colors (white, black, red, blue, green, purple)
- XP / levels / leaderboard
- Join-to-create temporary voice rooms (configure lobby ID)
- Fun commands: coinflip, dice, 8ball, rock-paper-scissors
- Announcement command
- Polls, suggestions, reports, giveaways, reminders
- Temporary voice rooms (join-to-create)
- Server/user information, avatar, AFK
- Anti-spam, anti-mass-mention and anti-link basic protections
- Event logging

## Configure optional features
Set the corresponding IDs in `.env`. Create the rank roles manually and put their IDs in `src/config.js` (RANK_ROLE_IDS). For temporary voice rooms, create a voice lobby and set its ID as `tempVoiceLobbyId` in `src/config.js`.

## Important
This is a modular starter bot, not a hosted service. It must be running on a computer or hosting provider to stay online. Test permissions and role hierarchy in a private test server first.

## QARTVELI Dashboard (/setup)

The `/setup` command opens a private Discord control panel (visible only to the administrator who opened it). Server administrators can choose Welcome, Ticket, Logs, and role settings with Discord channel/role dropdowns and switch features ON/OFF with buttons. Settings are stored separately per Discord server in `data/guild-settings.json`.

### Publish slash commands

Set `DISCORD_TOKEN` and `CLIENT_ID` in `.env`. For quick testing, also set `GUILD_ID` to your test server ID and run `npm run commands`. To publish commands globally, leave `GUILD_ID` empty and run `npm run commands`; global command propagation can take time.

### Important hosting note

The JSON database is suitable for testing. For a public bot with multiple servers, configure persistent storage on your host or migrate the settings store to a managed database (for example PostgreSQL), otherwise host restarts/redeploys may lose local JSON data. Never share your bot token or commit `.env` to GitHub.
