const Bosses = require('../../models/bossSchema'); // Import the Bosses model

module.exports = {
  insertBosses: async (bossName) => {
    try {
      // Find the existing document or create a new one if it doesn't exist
      let bossList = await Bosses.findOne();

      bossName.map((boss) => {
        bossList.bosses.push(boss);
      });
      //   if (!bossList) {
      //     // Create a new document if none exists
      //     bossList = new Bosses({
      //       bosses: [bossName], // Initialize the array with the first boss
      //     });
      //   } else {
      //     // Add the new boss name to the array if the document exists
      //     bossList.bosses.push(bossName);
      //   }

      // Save the updated document to the database
      await bossList.save();
      console.log('New boss added successfully:', bossName);
    } catch (error) {
      console.error('Error adding boss:', error);
    }
  },
};
