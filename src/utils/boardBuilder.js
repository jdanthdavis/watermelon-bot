const { EmbedBuilder } = require('discord.js');

//TODO: Loop through every boss in the db to do this post.
module.exports = {
  boardBuilder: async () => {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('**The Leviathan**')
      .setDescription(
        '🥇 LSx Swap - 10s\n' + '🥈 Gout Hever - 15s\n' + '🥉 ScottVc - 5m'
      )
      .setThumbnail(
        'https://raw.githubusercontent.com/jdanthdavis/leaderboard-bot/refs/heads/main/levi.png'
      );

    return embed;
  },
};
