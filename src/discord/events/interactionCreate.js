const { EmbedBuilder } = require("discord.js");
const Logger = require("../../Logger");

const verifyEmbed = new EmbedBuilder()
  .setColor(15548997)
  .setAuthor({ name: "An Error has occurred" })
  .setDescription(
    `You must link your account using \`/verify\` before using this command.`
  )
  .setFooter({
    text: `by DuckySoLucky#5181 | /help [command] for more information`,
    iconURL: "https://imgur.com/tgwQJTX.png",
  });

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      await interaction.deferReply({ ephemeral: false }).catch(() => {});

      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        Logger.discordMessage(
          `${interaction.user.username} - [${interaction.commandName}]`
        );
        bridgeChat = interaction.channelId;
        await command.execute(interaction, interaction.client);
      } catch (error) {
        console.log(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
};
