const fs = require("node:fs");
const path = require("node:path");
const { Collection } = require("discord.js");
function loadCommands() {
  const commands = new Collection();
  const dir = path.join(__dirname, "..", "commands");
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".js"))) {
    try {
      const command = require(path.join(dir, file));
      if (!command.data || !command.execute) continue;
      for (const data of Array.isArray(command.data) ? command.data : [command.data]) {
        commands.set(data.name, { ...command, data });
      }
    } catch (err) { console.error(`[COMMAND LOAD FAILED] ${file}`, err); }
  }
  return commands;
}
module.exports = { loadCommands };
