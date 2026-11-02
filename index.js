require("dotenv").config();
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./src/config");
const { loadEvents } = require("./src/core/loader");
const { loadCommands } = require("./src/core/commands");
const { startGiveawayTimers } = require("./src/features/giveaways");

const token = process.env.DISCORD_TOKEN;

console.log("TOKEN STATUS:", token ? "FOUND" : "MISSING");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember, Partials.User]
});

client.commands = loadCommands();
client.config = config;

process.on("unhandledRejection", error => console.error("[UNHANDLED REJECTION]", error));
process.on("uncaughtException", error => console.error("[UNCAUGHT EXCEPTION]", error));

(async () => {
  await loadEvents(client);
  await client.login(process.env.DISCORD_TOKEN);
})().catch(error => {
  console.error("Bot startup failed:", error);
  process.exitCode = 1;
});

client.once("clientReady", () => {
  console.log(`QARTVELI is online as ${client.user.tag}`);
  startGiveawayTimers(client);
});
