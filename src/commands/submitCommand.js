const { SlashCommandBuilder } = require('discord.js');
const { getAllBosses } = require('../utils/db/getAllBosses');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('submit')
    .setDescription('Submit your PB for review.')
    .addStringOption((option) => {
      return option
        .setName('boss')
        .setDescription("The boss you're submitting for.")
        .setRequired(true)
        .setAutocomplete(true);
    })
    .addIntegerOption((option) => {
      return option
        .setName('team-size')
        .setDescription('the size of your team (1-8).')
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName('team-members')
        .setDescription('player1, player2, player3, player4, ect')
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName('time-achieved')
        .setDescription('the time you achieved')
        .setRequired(true);
    }),
  // .addAttachmentOption((option) =>
  //   option
  //     .setName('screenshot-link')
  //     .setDescription('a link to the screenshot of the PB')
  //     .setRequired(true)
  // ),

  // Autocomplete method for the 'boss' option
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused();
    const bosses = await getAllBosses();

    const filteredBosses = bosses[0].bosses.filter((boss) => {
      return boss.toLowerCase().startsWith(focusedOption.toLowerCase());
    });

    const limit = filteredBosses.slice(0, 25);

    await interaction.respond(
      limit.map((boss) => ({ name: boss, value: boss }))
    );
  },
};
