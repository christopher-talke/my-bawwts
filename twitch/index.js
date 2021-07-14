import tmi from "tmi.js";
import _ from "lodash";
import chalk from "chalk";
import dotenv from "dotenv";
import data from "./data.json";

dotenv.config();

const { TWITCH_USERNAME, TWITCH_0AUTH_TOKEN, CHANNELS } = process.env;
const log = console.log;
const clear = console.clear;

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

  let plays = [];
  let alreadyIn = false;

  function skatebeardBot(target, context, msg, self) {
    if (msg.toLowerCase().includes("!play")) {
      plays.push(1);
      return;
    }

    if (alreadyIn) {
      plays = [];
    }
    clear();
    log(chalk.blue(`>>> Plays Mentioned: ${plays.length}`));

    if (alreadyIn) {
      log(chalk.green(`>>> In The Game: ${alreadyIn}`));
    }

    if (plays.length > 20 && !alreadyIn) {
      const num = randomNumber();
      alreadyIn = true;
      plays = [];

      const commandName = _.sample([1, 2]) === 1 ? `!play` : `!play ${num} ${_.sample(data.emotes)}`;
      client.say(target, commandName);

      setTimeout(() => {
        alreadyIn = false;
      }, 60000 * 2);
    }
  }

  function randomNumber() {
    const sides = 12;
    return Math.floor(Math.random() * sides) + 1;
  }

  function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }
}

export default startTwitchBots;
