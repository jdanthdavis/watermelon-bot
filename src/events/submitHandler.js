const { EmbedBuilder } = require('discord.js');
const path = require('path');

module.exports = async (interaction) => {
  if (!interaction.isCommand()) return;

  const options = interaction.options;
  const member = interaction.member;
  const boss = options.getString('boss');
  const teamSize = options.getInteger('team-size');
  const teamMembers = options.getString('team-members');
  const time = options.getString('time-achieved');
  const submitter = member.nickname ? member.nickname : member.username;
  // const ssLink = options.getString('screenshot-link');

  // Create an embed message
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('**Submission Received!**')
    .setDescription(
      'React with a 👍 to approve this submission\nor a 👎 to deny this submission.'
    )
    .addFields(
      {
        name: 'Submitter',
        value: submitter,
        inline: false,
      },
      {
        name: 'Boss',
        value: boss,
        inline: false,
      },
      {
        name: 'Time',
        value: time,
        inline: false,
      },
      {
        name: 'Team Size',
        value: teamSize?.toString(),
        inline: false,
      },
      {
        name: 'Team List',
        value: teamMembers,
        inline: false,
      }
    )
    .setThumbnail(
      'https://raw.githubusercontent.com/jdanthdavis/leaderboard-bot/refs/heads/main/levi.png'
    )
    .setTimestamp()
    .setFooter({ text: 'Powered by Watermelons' }); //TODO: Add watermelon img

  // Fetch the channel by ID and send the embed
  const channel = await interaction.client.channels.fetch(
    '1267621876432375879'
  );
  if (channel) {
    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Submitted!' });
  } else {
    await interaction.reply({
      content: 'Channel not found!',
      ephemeral: true,
    });
  }
};
