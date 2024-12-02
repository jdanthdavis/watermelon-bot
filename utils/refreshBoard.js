const { boardBuilder } = require('./boardBuilder');
const { getAllTimes } = require('./db/getAllTimes');
const { raidSorter } = require('./raidSorter');
const { wipeBoard } = require('./wipeBoard');
const { masterRaidsList } = require('../raidConstants');
require('dotenv').config();

/**
 * Wipes the leaderboards
 * @param {*} channel
 */
async function deleteBoard(channel) {
  console.log('Deleting...');
  let messages = await channel.messages.fetch({ limit: 100 });
  try {
    await channel.bulkDelete(messages);
  } catch (error) {
    console.error(`Could not delete messages.`, error);
  }
}

async function sortTimes(times, header, channel) {
  await channel.send(header);
  await Promise.all(
    times.map(async (bosses) => {
      const embed = await boardBuilder(bosses);
      await channel.send({ embeds: [embed] });
    })
  );
}

/**
 * Builds the leaderboards
 * @param {*} channel
 */
async function buildBoard(channel) {
  console.log('Building board...');
  const getTimes = await getAllTimes();
  const bossTimes = getTimes // should be 19 total bosses
    .filter((boss) => !masterRaidsList.includes(boss.bossName))
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
  const raidTimes = getTimes.filter((boss) =>
    masterRaidsList.includes(boss.bossName)
  );
  const sortedToBTimes = raidSorter(raidTimes, 'Theatre of Blood');
  const sortedHMTimes = raidSorter(raidTimes, 'HM');
  const sortedCoXTimes = raidSorter(raidTimes, 'CoX');
  const sortedCMTimes = raidSorter(raidTimes, 'CM');
  const sortedToATimes = raidSorter(raidTimes, 'TOA');
  const sortedToAExpTimes = raidSorter(raidTimes, 'Expert');

  await sortTimes(sortedToBTimes, '## Theatre of Blood', channel);
  await sortTimes(sortedHMTimes, '## Theatre of Blood: HM', channel);
  await sortTimes(sortedCoXTimes, '## Chambers of Xeric', channel);
  await sortTimes(sortedCMTimes, '## Chambers of Xeric: CM', channel);
  await sortTimes(sortedToATimes, '## Tombs of Amascut', channel);
  await sortTimes(sortedToAExpTimes, '## Tombs of Amascut: Expert', channel);
  await sortTimes(bossTimes, '## Bosses', channel);
}

module.exports = {
  refreshBoard: async (channel) => {
    await wipeBoard(channel);
    await buildBoard(channel);
    console.log('Refresh completed!');
  },
};
