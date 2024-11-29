const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Sends an embed message to a specific channel.'),
  async execute(interaction) {
    // Command logic can be placed here (or you can call the event handler)
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Example Embed')
      .setDescription('This is an embed sent to a specific channel!')
      .setTimestamp()
      .setFooter({ text: 'Your Bot Footer Text' });

    const channel = await interaction.client.channels.fetch(
      'SPECIFIC_CHANNEL_ID'
    );
    if (channel) {
      await channel.send({ embeds: [embed] });
      await interaction.reply({
        content: 'Embed sent to the specified channel!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'Channel not found!',
        ephemeral: true,
      });
    }
  },
};
