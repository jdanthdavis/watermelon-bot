const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const { ISSUES_CHANNEL } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('submit-pet')
    .setDescription('Submit an issue with the leaderboards.')
    .addStringOption((option) => {
      return option
        .setName('issue-desc')
        .setDescription('Your issue.')
        .setRequired(true);
    }),

  async execute(interaction) {
    const author = interaction.user;
    const request = interaction.options.getString('issue-desc');
    const channel = await interaction.client.channels.fetch(ISSUES_CHANNEL);

    try {
      if (channel) {
        await channel.send(`### New Issue from ${author}\n > ${request}`);
      }
      return interaction.reply({
        content: `Your issue has been received!\n> ${request}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Could not send issue.`, error);
    }
  },
};
