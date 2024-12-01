const { EmbedBuilder } = require('discord.js');
const { convertTime } = require('./convertTime');
require('dotenv').config();

function buildDesc(playerInfo) {
  // Sort players by killTime (assuming killTime is in seconds or a comparable format)
  const sortedPlayers = playerInfo.times.sort(
    (a, b) => convertTime(a.killTime) - convertTime(b.killTime)
  ); // Sort from fastest to slowest

  // Map through the sorted players and assign the rank emojis
  return sortedPlayers
    .map((player, index) => {
      const rankEmojis = ['🥇', '🥈', '🥉'];
      const rank = rankEmojis[index];
      return `${rank} ${player.players} - ${player.killTime}`;
    })
    .join('\n');
}

module.exports = {
  boardBuilder: async (bossInfo) => {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(bossInfo.bossName)
      .setDescription(
        Array.isArray(bossInfo.times) && bossInfo.times.length > 0
          ? buildDesc(bossInfo)
          : 'No submissions.'
      )
      .setThumbnail(
        'https://raw.githubusercontent.com/jdanthdavis/leaderboard-bot/refs/heads/main/levi.png'
      );

    return embed;
  },
};
