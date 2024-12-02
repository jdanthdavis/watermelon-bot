module.exports = {
  convertTime: (time) => {
    // Handle "hours:minutes:milliseconds" format (e.g., "1:05:123", "12:59:999")
    let match = time.match(/^(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?$/);
    if (match) {
      let hours = 0; // Default to 0 hours if not provided
      let minutes = parseInt(match[1], 10);
      let seconds = parseInt(match[2], 10);
      let milliseconds = parseInt(match[3] || '0', 10); // Default to 0 if no milliseconds
      return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
    }

    // Handle "minutes:seconds.milliseconds" format (e.g., "1:11.4", "2:03.789")
    match = time.match(/^(\d{1,2}):(\d{1,2})\.(\d{1,3})$/);
    if (match) {
      let minutes = parseInt(match[1], 10);
      let seconds = parseInt(match[2], 10);
      let milliseconds = parseInt(match[3], 10);
      return minutes * 60 + seconds + milliseconds / 1000;
    }

    // Handle "seconds.milliseconds" format (e.g., "30.123", "45.67")
    match = time.match(/^(\d{1,2})\.(\d{1,3})$/);
    if (match) {
      let seconds = parseInt(match[1], 10);
      let milliseconds = parseInt(match[2], 10);
      return seconds + milliseconds / 1000;
    }

    return 0; // Return 0 if the format is invalid
  },
};
