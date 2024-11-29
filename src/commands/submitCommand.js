const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('submit')
    .setDescription('Submit your PB.')
    .addStringOption((option) => {
      return option
        .setName('boss')
        .setDescription("The boss you're submitting for.")
        .setRequired(true);
    }),
  // .addIntegerOption((option) => {
  //   return option
  //     .setName('team-size')
  //     .setDescription('The size of your team (1-8).')
  //     .setRequired(true);
  // })
  // .addStringOption((option) => {
  //   return option
  //     .setName('team-members')
  //     .setDescription('Player1, Player2, Player3, ect.');
  // })
  // .addStringOption((option) => {
  //   return option
  //     .setName('time-achieved')
  //     .setDescription('Enter a duration (e.g., 1h 30m, 2d 5h)');
  //   // .setRequired(true);
  // })
  // .addAttachmentOption((option) => {
  //   return option
  //     .setName('screenshot-link')
  //     .setDescription('a link to the screenshot of the PB')
  //     .setRequired(false); //TODO: Set to true before deployment
  // }),
};
