module.exports = {
  // Example helper function to fetch a channel by ID
  fetchChannel: async (client, channelId) => {
    try {
      return await client.channels.fetch(channelId);
    } catch (error) {
      console.error('Error fetching channel:', error);
      return null;
    }
  },
};
