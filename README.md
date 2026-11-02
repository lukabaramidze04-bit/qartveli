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
- Optional `/ai` assistant: can use the bot's registered slash-command features. Server-changing commands require a separate confirmation button from the person who requested them, and command permission requirements still apply.

## Configure optional features
Set the corresponding IDs in `.env` where listed. Create the rank roles manually and put their IDs in `src/config.js` (`rankRoleIds`). For temporary voice rooms, create a voice lobby and use `/ai` to set `tempVoiceLobbyId` to its channel mention; you can also set a category. These settings are stored per server. Existing `src/config.js` lobby IDs remain as fallbacks.

## Important
This is a modular starter bot, not a hosted service. It must be running on a computer or hosting provider to stay online. Test permissions and role hierarchy in a private test server first.

## AI assistant (optional)

`/ai` uses Groq's chat-completions API and the `openai/gpt-oss-20b` model by default. It can call every currently registered slash command, plus ticket open/claim/close, rank selection, and `/setup` settings actions including anti-link protection and temporary voice setup. Add `GROQ_API_KEY` as a private variable in the host dashboard; do not put the real key in GitHub, `.env.example`, or Discord chat. `GROQ_MODEL` can select another Groq model that supports tool calling.

Only the text explicitly entered in `/ai`, plus generic command descriptions and system instructions, is sent to Groq. The bot does not read or forward ordinary server messages or server data to the AI. Do not include passwords, bot tokens, or private information in an AI prompt. Commands that change server settings, moderate members, publish messages, or create public items require an approval click in Discord. The requester must also have the slash command's required Discord permission. AI requests are rate-limited to one per user every 8 seconds; the API key is optional, so the bot's non-AI commands keep working without it.

## QARTVELI Dashboard (/setup)

The `/setup` command opens a private Discord control panel (visible only to the administrator who opened it). Server administrators can choose Welcome, Ticket, Logs, and role settings with Discord channel/role dropdowns and switch features ON/OFF with buttons. Settings are stored separately per Discord server in `data/guild-settings.json`.

### Publish slash commands

Set `DISCORD_TOKEN` and `CLIENT_ID` in `.env`. For quick testing, also set `GUILD_ID` to your test server ID and run `npm run commands`. To publish commands globally, leave `GUILD_ID` empty and run `npm run commands`; global command propagation can take time.

### Important hosting note

The JSON database is suitable for testing. For a public bot with multiple servers, configure persistent storage on your host or migrate the settings store to a managed database (for example PostgreSQL), otherwise host restarts/redeploys may lose local JSON data. Never share your bot token or commit `.env` to GitHub.
