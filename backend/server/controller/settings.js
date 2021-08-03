import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getSettings() {
  const settings = JSON.parse(fs.readFileSync(`${__dirname}/../../.temp/settings.json`));
  return settings;
}

async function changeSettings(setting, key, value) {
  const settings = JSON.parse(await fs.readFileSync(`${__dirname}/../../.temp/settings.json`));
  settings[setting][key] = value;
  await fs.writeFileSync(`${__dirname}/../../.temp/settings.json`, JSON.stringify(settings, null, 4));
  return settings;
}

export { getSettings, changeSettings };
