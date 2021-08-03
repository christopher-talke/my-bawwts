import { Client } from "discord.js";
import chalk from "chalk";
import config from "./config.json";
import { getSettings } from "../server/controller/settings.js";

async function startDiscordBots() {
  config.bots.forEach(async (bot) => {
    await instaniateBot(bot);
  });
}

async function instaniateBot(bot) {
  const client = new Client();

  client.on("ready", () => {
    console.log(chalk.green(`>>> DISCORD: 🤖 Logged in as ${client.user.tag}`));
  });

  client.on("message", async (msg) => {
    const { discord } = await getSettings();
    if (!discord.enabled) return;

    if (!msg.author.username.includes(client.user.username)) {
      // Documentation Message
      if (msg.content.toLowerCase().includes("!doco")) {
        let commands = "Here is what I listen for:\n```json\n";
        bot.commands.forEach((iCommand) => {
          if (iCommand.event === "message") {
            commands += "- " + iCommand.listener + "\n";
          }
        });
        commands += "```";
        msg.channel.send(commands);
        return;
      }

      // Iterate over bot commands
      bot.commands.forEach((command) => {
        if (command.event === "message" && msg.content.toLowerCase().includes(command.listener.toLowerCase())) {
          msg.channel.send(command.response);
          return;
        }
      });
    }
  });

  client.login(bot.token);
}

export default startDiscordBots;
