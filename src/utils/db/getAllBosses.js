const Bosses = require('../../models/bossSchema');
let arr;

module.exports = {
  getAllBosses: async () => {
    try {
      console.log('Connected to DB!');

      // Query all records from the 'times' collection
      const records = await Bosses.find();

      // If no records are found, log an appropriate message
      if (records.length === 0) {
        console.log('No records found.');
      } else {
        // arr.push(records);
        arr = records;
        // console.log('Fetched records:', records); // Log the fetched records
      }
      //   console.log(`Arr: ${arr[0].bossName}`);
      return records;
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  },
};
