import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const intialData = {
  validators: {
    options: ["discord", "twitch"],
    keys: ["enabled"],
    options: [true, false],
  },
  discord: {
    enabled: true,
  },
  twitch: {
    enabled: true,
  },
};

async function upsertFile(name) {
  try {
    await fs.readFileSync(name, "utf8");
  } catch (error) {
    await fs.writeFileSync(name, JSON.stringify(intialData, null, 4));
  }
}

async function setup() {
  await upsertFile(`${__dirname}\\.temp\\settings.json`);
}

export default setup;
