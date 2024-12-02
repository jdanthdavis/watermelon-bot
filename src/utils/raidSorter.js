module.exports = {
  raidSorter: (raidTimes, raidName) => {
    // Define the category and suffix groups
    const categoryOrder = ['Theatre of Blood', 'CoX', 'TOA'];
    const suffixOrder = [': HM', ': CM', ': Expert'];
    const groupSizeOrder = [
      'Solo',
      'Duo',
      'Trio',
      '4 Man',
      '5 Man',
      '6 Man',
      '7 Man',
      '8 Man',
    ];

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
        !suffixOrder.some((suffix) => raid.bossName.includes(suffix))
      );
    });

    // Custom comparator function for sorting
    return filteredRaidTimes.sort((a, b) => {
      // Compare category order (Theatre of Blood, CoX, TOA)
      const categoryA = categoryOrder.findIndex((cat) =>
        a.bossName.includes(cat)
      );
      const categoryB = categoryOrder.findIndex((cat) =>
        b.bossName.includes(cat)
      );

      if (categoryA !== categoryB) {
        return categoryA - categoryB;
      }

      // Compare suffixes (ensure : HM, : CM, : Expert are handled)
      const suffixA = suffixOrder.findIndex((suffix) =>
        a.bossName.includes(suffix)
      );
      const suffixB = suffixOrder.findIndex((suffix) =>
        b.bossName.includes(suffix)
      );

      if (suffixA !== suffixB) {
        return suffixA - suffixB;
      }

      // Compare group size order (Solo, Duo, Trio, etc.)
      const sizeA = groupSizeOrder.findIndex((size) =>
        a.bossName.includes(size)
      );
      const sizeB = groupSizeOrder.findIndex((size) =>
        b.bossName.includes(size)
      );

      return sizeA - sizeB;
    });
  },
};
