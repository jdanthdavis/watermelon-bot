module.exports = {
  convertTime: (time) => {
    // Handle "minutes:seconds.milliseconds" format (e.g., "1:11.4", "0:20", "0:20.05")
    let match = time.match(/^(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?$/);
    if (match) {
      let minutes = parseInt(match[1], 10);
      let seconds = parseInt(match[2], 10);
      let milliseconds = parseInt(match[3] || '0', 10); // Default to 0 if no milliseconds
      return minutes * 60 + seconds + milliseconds / 1000;
    }

    // Handle "hours:minutes:seconds.milliseconds" format (e.g., "24:13.8")
    match = time.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?$/);
    if (match) {
      let hours = parseInt(match[1], 10);
      let minutes = parseInt(match[2], 10);
      let seconds = parseInt(match[3], 10);
      let milliseconds = parseInt(match[4] || '0', 10);
      return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    }

    // Handle "minutes.seconds" format (e.g., "1.25", "1.09")
    match = time.match(/^(\d{1,2})\.(\d{1,3})$/);
    if (match) {
      let minutes = parseInt(match[1], 10);
      let seconds = parseFloat(match[2]);
      return minutes * 60 + seconds;
    }

    return 0; // Return 0 if the format is invalid
  },
};
