require('dotenv').config();

module.exports = {
  wipeBoard: async (channel) => {
    console.log('Deleting...');
    let messages = await channel.messages.fetch({ limit: 100 });
    try {
      await channel.bulkDelete(messages);
    } catch (error) {
      console.error(`Could not delete messages.`, error);
    }
    console.log('Delete completed!');
  },
};
