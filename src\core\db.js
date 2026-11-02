const fs = require("node:fs");
const path = require("node:path");
const dir = path.join(process.cwd(), "data");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
function read(name, fallback = {}) {
  const file = path.join(dir, `${name}.json`);
  try { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback; }
  catch (e) { console.error(`[DB READ ${name}]`, e); return fallback; }
}
function write(name, value) {
  const file = path.join(dir, `${name}.json`);
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(value, null, 2));
  fs.renameSync(temp, file);
}
module.exports = { read, write };
