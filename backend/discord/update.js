import * as fs from "fs";
import _ from "lodash";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getBots() {
  const config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, "utf8"));
  return config.bots;
}

async function addCommand(id, listener, response) {
  const config = JSON.parse(await fs.readFileSync(`${__dirname}/config.json`, "utf8"));

  const exists = await _.filter(config.bots[id].commands, (cmd) => cmd.listener === listener);

  if (exists.length > 0) {
    return false;
  }

  config.bots[id].commands.push({
    event: "message",
    listener,
    response,
  });

  await fs.writeFileSync(`${__dirname}/config.json`, JSON.stringify(config, null, 4));

  return true;
}

export { getBots, addCommand };
