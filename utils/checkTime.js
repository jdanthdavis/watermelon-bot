const { convertTime } = require('./convertTime');

module.exports = {
  checkTime: (timeData, newTime) => {
    // Convert newTime to seconds
    const newEntryTimeInSeconds = convertTime(newTime);

    let slowestTime = null;

    timeData.forEach((player) => {
      const playerTimeInSeconds = convertTime(player.killTime);

      if (playerTimeInSeconds === 0) {
        slowestTime = 'invalidTime';
      }

      if (playerTimeInSeconds === newEntryTimeInSeconds) {
        slowestTime = 'Exact';
      }

      if (playerTimeInSeconds > newEntryTimeInSeconds) {
        // If the current player's time is slower than the newEntry and slower than any found so far
        if (
          !slowestTime ||
          playerTimeInSeconds > convertTime(slowestTime.killTime)
        ) {
          slowestTime = player;
        }
      }
    });

    return slowestTime;
  },
};
