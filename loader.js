const fs = require("node:fs");
const path = require("node:path");

async function loadEvents(client) {
  const dir = path.join(__dirname, "events");

  if (!fs.existsSync(dir)) {
    console.error(`[ERROR] Events folder not found: ${dir}`);
    return;
  }

  for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".js"))) {
    try {
      const event = require(path.join(dir, file));

      if (!event.name || typeof event.execute !== "function") {
        console.error(`[EVENT INVALID] ${file}`);
        continue;
      }

      const runner = (...args) =>
        Promise.resolve(event.execute(client, ...args))
          .catch(err => console.error(`[EVENT ${file}]`, err));

      if (event.once) {
        client.once(event.name, runner);
      } else {
        client.on(event.name, runner);
      }

      console.log(`[EVENT] Loaded ${file}`);
    } catch (err) {
      console.error(`[EVENT LOAD FAILED] ${file}`, err);
    }
  }
}

module.exports = { loadEvents };

