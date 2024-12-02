module.exports = {
  raidPartyFinder: (raid, raidSize) => {
    const raidsList = [
      'CoX',
      'CoX: CM',
      'Theatre of Blood',
      'Theatre of Blood: HM',
      'TOA',
      'TOA: Expert',
    ];

    if (!raidsList.includes(raid)) return raid;

    let raidKey;
    switch (raidSize) {
      case '8':
        raidKey = '8 Man';
        return raidKey + ' ' + raid;
      case '7':
        raidKey = '7 Man';
        return raidKey + ' ' + raid;
      case '6':
        raidKey = '6 Man';
        return raidKey + ' ' + raid;
      case '5':
        raidKey = '5 Man';
        return raidKey + ' ' + raid;
      case '4':
        raidKey = '4 Man';
        return raidKey + ' ' + raid;
      case '3':
        raidKey = 'Trio';
        return raidKey + ' ' + raid;
      case '2':
        raidKey = 'Duo';
        return raidKey + ' ' + raid;
      case '1':
        raidKey = 'Solo';
        return raidKey + ' ' + raid;
      default:
        console.log('defaulted');
        return;
    }
  },
};
