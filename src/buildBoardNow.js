const { boardBuilder } = require('./utils/boardBuilder');
const { getAllTimes } = require('./utils/db/getAllTimes');
const { raidSorter } = require('./utils/raidSorter');
const raidsList = require('./raidList');

module.exports = {
  buildBoardNow: async (message) => {
    const getTimes = await getAllTimes();
    const bossTimes = getTimes // should be 19 total bosses
      .filter((boss) => !raidsList.includes(boss.bossName))
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
      raidsList.includes(boss.bossName)
    );
    const sortedToBTimes = raidSorter(raidTimes, 'Theatre of Blood');
    const sortedHMTimes = raidSorter(raidTimes, 'HM');
    const sortedCoXTimes = raidSorter(raidTimes, 'CoX');
    const sortedCMTimes = raidSorter(raidTimes, 'CM');
    const sortedToATimes = raidSorter(raidTimes, 'TOA');
    const sortedToAExpTimes = raidSorter(raidTimes, 'Expert');

    await Promise.all(
      bossTimes.map(async (tobTimes) => {
        const embed = await boardBuilder(tobTimes, message);
        await message.channel.send({ embeds: [embed] });
      })
    );

    return;

    await message.channel.send('Theate of Blood');

    await Promise.all(
      sortedToBTimes.map(async (tobTimes) => {
        const embed = await boardBuilder(tobTimes, message);
        await message.channel.send({ embeds: [embed] });
      })
    );

    await message.channel.send(
      '# <:sanguine_dust:1312954336946683925> Theatre of Blood: HM <:sanguine_dust:1312954336946683925> '
    );

    await Promise.all(
      sortedHMTimes.map(async (tobTimes) => {
        const embed = await boardBuilder(tobTimes, message);
        await message.channel.send({ embeds: [embed] });
      })
    );

    await message.channel.send(
      '# <:twisted_bow:1312954340214050918> Chambers of Xeric <:twisted_bow:1312954340214050918> '
    );

    await Promise.all(
      sortedCoXTimes.map(async (tobTimes) => {
        const embed = await boardBuilder(tobTimes, message);
        await message.channel.send({ embeds: [embed] });
      })
    );

    await message.channel.send(
      '# <:metamorphic_dust:1312954335570821143>  Chambers of Xeric: CM <:metamorphic_dust:1312954335570821143> '
    );

    await Promise.all(
      sortedCMTimes.map(async (tobTimes) => {
        const embed = await boardBuilder(tobTimes, message);
        await message.channel.send({ embeds: [embed] });
      })
    );

    await message.channel.send(
      '# <:shadow:1312954339328921620> Tombs of Amascut <:shadow:1312954339328921620>'
    );

    await Promise.all(
      sortedToATimes.map(async (tobTimes) => {
        const embed = await boardBuilder(tobTimes, message);
        await message.channel.send({ embeds: [embed] });
      })
    );

    await message.channel.send(
      '# <:fang_or:1312954335092543498> Tombs of Amascut: Expert <:fang_or:1312954335092543498>'
    );

    await Promise.all(
      sortedToAExpTimes.map(async (tobTimes) => {
        const embed = await boardBuilder(tobTimes, message);
        await message.channel.send({ embeds: [embed] });
      })
    );
  },
};
