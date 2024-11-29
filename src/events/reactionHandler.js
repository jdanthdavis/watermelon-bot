const { EmbedBuilder } = require('discord.js');

//TODO: Create logic to update DB based on the type of reaction.
module.exports = async (interaction, user) => {
  console.log(interaction.emoji.name);
  if (interaction.emoji.name !== '👍' && interaction.emoji.name !== '👎') {
    return;
  }
  console.dir(interaction, { depth: null, colors: true });
  return;
  // Fetch the channel by ID and send the embed
  const channel = await interaction.client.channels.fetch(
    '1267621876432375879'
  );
  if (channel) {
    //   await channel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Submitted!' });
  } else {
    await interaction.reply({
      content: 'Channel not found!',
      ephemeral: true,
    });
  }
};
