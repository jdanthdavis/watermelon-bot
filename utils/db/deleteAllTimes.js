const BossTimes = require('../../models/leaderBoard');

module.exports = {
  deleteAllTimes: async () => {
    try {
      // Find all bosses with a non-empty 'times' array
      const bossesWithTimes = await BossTimes.find({
        'times.0': { $exists: true },
      });

      // If bosses with times are found, proceed to update them
      if (bossesWithTimes.length > 0) {
        // Loop through each boss and clear their times array
        for (const boss of bossesWithTimes) {
          await BossTimes.updateOne(
            { _id: boss._id }, // Match the specific boss by its _id
            { $set: { times: [] } } // Set the 'times' array to an empty array
          );
          console.log(`Times cleared for boss: ${boss.bossName}`);
        }
      } else {
        console.log('No bosses with times found.');
      }
    } catch (error) {
      console.error('Error clearing times for bosses:', error);
    }
  },
};
