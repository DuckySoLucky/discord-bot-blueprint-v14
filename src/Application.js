const DiscordManager = require("./discord/DiscordManager");

class Application {
  async register() {
    this.discord = new DiscordManager(this);
  }

  async connect() {
    this.discord.connect();
  }
}

module.exports = new Application();
