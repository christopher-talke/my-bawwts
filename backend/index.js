import dotenv from "dotenv";
import setup from "./config.js";
import startServer from "./server/index.js";
import startTwitchBots from "./twitch/index.js";
import startDiscordBots from "./discord/index.js";

dotenv.config();

setup();

startTwitchBots();
startDiscordBots();
startServer();
