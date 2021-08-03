import tmi from "tmi.js";
import _ from "lodash";
import chalk from "chalk";
import dotenv from "dotenv";
import data from "./data.json";

import { getSettings } from "../server/controller/settings.js";
import { getState, setState } from "../state.js";

dotenv.config();

const { TWITCH_USERNAME, TWITCH_0AUTH_TOKEN, CHANNELS } = process.env;

function startTwitchBots() {
  const opts = {
    identity: {
      username: TWITCH_USERNAME,
      password: TWITCH_0AUTH_TOKEN,
    },
    channels: CHANNELS.split(","),
  };

  const client = new tmi.client(opts);

  client.on("message", skatebeardBot);
  client.on("connected", onConnectedHandler);
  client.connect();

  async function skatebeardBot(target, context, msg, self) {
    const { twitch } = await getSettings();
    if (!twitch.enabled) return;

    const state = _.cloneDeep(await getState());
    const { plays, alreadyIn } = state.twitch;

    if (msg.toLowerCase().includes("!play") && !alreadyIn) {
      plays.push(1);
      setState({ twitch: { plays, alreadyIn } });
      return;
    }

    if (alreadyIn) {
      setState({ twitch: { plays: [], alreadyIn } });
    }

    if (plays.length > 20 && !alreadyIn) {
      const num = randomNumber();
      setState({ twitch: { plays: [], alreadyIn: true } });

      const commandName = _.sample([1, 2]) === 1 ? `!play` : `!play ${num} ${_.sample(data.emotes)}`;
      client.say(target, commandName);

      setTimeout(() => {
        setState({ twitch: { plays: [], alreadyIn: false } });
      }, 60000 * 2);
    }
  }

  function randomNumber() {
    const sides = 12;
    return Math.floor(Math.random() * sides) + 1;
  }

  function onConnectedHandler(addr, port) {
    console.log(chalk.green(`>>> TWITCH: 🤖 Connected via ${addr}:${port}`));
  }
}

export default startTwitchBots;
