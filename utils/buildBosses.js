const { boardBuilder } = require('./boardBuilder');
const { getAllTimes } = require('./db/getAllTimes');
const { modifiedMasterRaidsList } = require('../raidConstants');
require('dotenv').config();

async function buildMessage(times, header, channel) {
  const colors = [0x00ff00, 0xffc0cb];
  await channel.send(header);
  await Promise.all(
    times.map(async (bosses, index) => {
      const color = colors[index % colors.length];
      const embed = await boardBuilder(bosses, color);
      await channel.send({ embeds: [embed] });
    })
  );
}

/**
 * Builds the leaderboards
 * @param {*} channel
 */
async function buildBoard(channel) {
  console.log('Building boss board...');
  const getTimes = await getAllTimes();
  const bossTimes = getTimes // should be 19 total bosses
    .filter((boss) => !modifiedMasterRaidsList.includes(boss.bossName))
    .sort((a, b) => {
      // Remove "The " from the beginning of the bossName if it exists
      const aName = a.bossName.startsWith('The ')
        ? a.bossName.slice(4)
        : a.bossName;
      const bName = b.bossName.startsWith('The ')
        ? b.bossName.slice(4)
        : b.bossName;

      return aName.localeCompare(bName);
    });
  await buildMessage(bossTimes, '## Bosses', channel);
}

module.exports = {
  buildBosses: async (channel) => {
    await buildBoard(channel);
    console.log('Refreshed boss board!');
  },
};
