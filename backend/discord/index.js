import { Client } from "discord.js";
import chalk from "chalk";
import { getSettings } from "../server/controller/settings.js";
import { getBots, addCommand } from "./update.js";

async function startDiscordBots() {
  const bots = await getBots();
  bots.forEach(async (bot, index) => {
    await instaniateBot(bot, index);
  });
}

async function instaniateBot(bot, index) {
  const client = new Client();

  client.on("ready", () => {
    console.log(chalk.green(`>>> DISCORD: 🤖 Logged in as ${client.user.tag}`));
  });

  client.on("message", async (msg) => {
    const { discord } = await getSettings();
    if (!discord.enabled) return;

    if (!msg.author.username.includes(client.user.username)) {
      /**
       * Dumps the config into a code field
       */
      if (msg.content.toLowerCase().includes("!doco")) {
        let commands = "Here is what I listen for:\n```json\n";
        bot.commands.forEach((iCommand) => {
          if (iCommand.event === "message") {
            commands += "- " + iCommand.listener + "\n";
          }
        });
        commands += "```\n";
        commands += "You can add a command using the !add command, example:\n";
        commands += "`!add | @Brett Baz | !cunt | Yep, thats me!`";
        msg.channel.send(commands);
        return;
      }

      /**
       * Adds a command to the bot's config file
       */
      if (msg.content.toLowerCase().includes("!add")) {
        // Looks for a command that looks like this
        // !add|@bot#3245|!dicks|I love looking at dicks
        const [_, botid, listener, response] = msg.content
          .replace(/(\s\|\s)/gi, "|")
          .replace(/(<@!)|>/gi, "")
          .split("|");

        if (botid === client.user.id) {
          const res = await addCommand(index, listener, response);

          if (res) {
            msg.reply("This command has been uproaded.");
          } else {
            msg.reply("You're a fuckin dropkick, that command already exists.");
          }
        }

        return;
      }

      /**
       * Compares message contents to bot commands array and responds if a match occurs
       */
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
