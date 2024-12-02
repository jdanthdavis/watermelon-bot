const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const { REQUESTS_CHANNEL } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('request')
    .setDescription('Submit a request for the leaderboards.')
    .addStringOption((option) => {
      return option
        .setName('request-desc')
        .setDescription('Your request.')
        .setRequired(true);
    }),

  async execute(interaction) {
    const author = interaction.user;
    const request = interaction.options.getString('request-desc');
    const channel = await interaction.client.channels.fetch(REQUESTS_CHANNEL);

    try {
      if (channel) {
        await channel.send(`### New Request from ${author}\n > ${request}`);
      }
      return interaction.reply({
        content: `Your request has been received!\n> ${request}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Could not send request.`, error);
    }
  },
};
