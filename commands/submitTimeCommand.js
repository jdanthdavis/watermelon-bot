const { SlashCommandBuilder } = require('discord.js');
const Bosses = require('../models/bossSchema');
const { convertTime } = require('../utils/convertTime');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('submit-time')
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
        .setDescription('The size of your team (1-8).')
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName('team-members')
        .setDescription('player1, player2, player3, player4, etc')
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName('time-achieved')
        .setDescription('The time you achieved (mm:ss format).')
        .setRequired(true);
    }),
  // .addAttachmentOption((option) =>
  //   option
  //     .setName('screenshot-link')
  //     .setDescription('A link to the screenshot of the PB')
  //     .setRequired(true)
  // ),

  async execute(interaction) {
    const timeAchieved = interaction.options.getString('time-achieved');

    if (convertTime(timeAchieved) === 0) {
      // Send a reply if the time is in an invalid format
      return interaction.reply({
        content:
          'Invalid time format! Please use the format `mm:ss` (e.g., `01:30`).',
        ephemeral: true,
      });
    }

    // Proceed with your normal logic after validation
    const boss = interaction.options.getString('boss');
    const teamSize = interaction.options.getInteger('team-size');
    const teamMembers = interaction.options
      .getString('team-members')
      .split(',');
    const screenshotLink = interaction.options.getAttachment('screenshot-link');

    // Handle the submission logic here (e.g., save to database, etc.)
    // For now, we'll just reply with the provided data.
    return interaction.reply({
      content: `Successfully submitted your PB for ${boss} with a time of ${timeAchieved} from team of size ${teamSize}.\nTeam members: ${teamMembers.join(
        ', '
      )}.\nScreenshot: ${screenshotLink?.url}`,
      ephemeral: true,
    });
  },

  // Autocomplete method for the 'boss' option
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused();
    const bosses = await await Bosses.find();

    const filteredBosses = bosses[0].bosses
      .filter((boss) =>
        boss.toLowerCase().startsWith(focusedOption.toLowerCase())
      )
      .sort((a, b) => {
        const aName = a.startsWith('The ') ? a.slice(4) : a;
        const bName = b.startsWith('The ') ? b.slice(4) : b;

        return aName.localeCompare(bName);
      });

    const limit = filteredBosses.slice(0, 25);

    await interaction.respond(
      limit.map((boss) => ({ name: boss, value: boss }))
    );
  },
};
