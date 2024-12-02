const { raidCategories, raidSuffix, groupSIze } = require('../raidConstants');

module.exports = {
  raidSorter: (raidTimes, raidName) => {
    // Filter raidTimes by raidName
    const filteredRaidTimes = raidTimes.filter((raid) => {
      if (raidName === 'CM') {
        // If searching for "CM", return only raids with ": CM"
        return raid.bossName.includes(': CM');
      }

      if (raidName === 'HM') {
        // If searching for "HM", return only raids with ": HM"
        return raid.bossName.includes(': HM');
      }

      if (raidName === 'Expert') {
        // If searching for "Expert", return only raids with ": Expert"
        return raid.bossName.includes(': Expert');
      }

      // Otherwise, if searching for a base raid name (like "CoX")
      // return raids with the base raid name, excluding the suffixes
      return (
        raid.bossName.includes(raidName) &&
        !raidSuffix.some((suffix) => raid.bossName.includes(suffix))
      );
    });

    // Custom comparator function for sorting
    return filteredRaidTimes.sort((a, b) => {
      // Compare category order (Theatre of Blood, CoX, TOA)
      const categoryA = raidCategories.findIndex((cat) =>
        a.bossName.includes(cat)
      );
      const categoryB = raidCategories.findIndex((cat) =>
        b.bossName.includes(cat)
      );

      if (categoryA !== categoryB) {
        return categoryA - categoryB;
      }

      // Compare suffixes (ensure : HM, : CM, : Expert are handled)
      const suffixA = raidSuffix.findIndex((suffix) =>
        a.bossName.includes(suffix)
      );
      const suffixB = raidSuffix.findIndex((suffix) =>
        b.bossName.includes(suffix)
      );

      if (suffixA !== suffixB) {
        return suffixA - suffixB;
      }

      // Compare group size order (Solo, Duo, Trio, etc.)
      const sizeA = groupSIze.findIndex((size) => a.bossName.includes(size));
      const sizeB = groupSIze.findIndex((size) => b.bossName.includes(size));

      return sizeA - sizeB;
    });
  },
};
