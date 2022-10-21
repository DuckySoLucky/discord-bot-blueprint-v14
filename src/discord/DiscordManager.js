const { Client, Collection, GatewayIntentBits } = require("discord.js");
const CommandHandler = require("./CommandHandler");
const config = require("../../config.json");
const Logger = require("../Logger");
const path = require("node:path");
const fs = require("fs");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { kill } = require("node:process");

class DiscordManager {
  constructor(app) {
    this.app = app;

    this.commandHandler = new CommandHandler(this);
  }

  async connect() {
    try {
      global.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
      });
      const client = global.client;

      client.login(config.discord.token);

      client.on("ready", () =>
        Logger.successfulMessage(
          "Client ready, logged in as " + client.user.tag
        )
      );

      client.commands = new Collection();

      for (const file of fs.readdirSync(__dirname + "/commands").filter((file) => file.endsWith(".js"))) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
      }


      for (const file of fs.readdirSync(__dirname + "/events").filter((file) => file.endsWith(".js"))) {
        const filePath = path.join(__dirname + "/events", file);
        const event = require(filePath);
        event.once ? client.once(event.name, (...args) => event.execute(...args)) : client.on(event.name, (...args) => event.execute(...args));
      }

      process.on("SIGINT", () => {
        Logger.logoutMessage(
          "Client successfuly logged out as " + client.user.tag
        ).then(() => {
          client.destroy();
          kill(process.pid);
        });
      });
    } catch (error) {
      Logger.errorMessage(error);
    }
  }
}

module.exports = DiscordManager;
