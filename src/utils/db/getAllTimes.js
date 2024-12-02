const Time = require('../../models/leaderBoard');

module.exports = {
  getAllTimes: async (type) => {
    try {
      let records;
      // Query all records from the 'times' collection
      // const records = await Time.find();
      if (type === 'raids') {
        records = await Time.find({
          bossName: {
            $in: [
              'Theatre of Blood',
              'Theatre of Blood: HM',
              'CoX',
              'Cox: CM',
              'TOA',
              'TOA: Expert',
            ],
          },
        });
      } else {
        records = await Time.find();
      }

      // If no records are found, log an appropriate message
      if (records.length === 0) {
        console.log('No records found.');
      }

      return records;
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  },
};
