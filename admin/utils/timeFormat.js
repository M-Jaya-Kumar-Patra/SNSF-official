const formatDurationUptoHour = (seconds) => {
  if (!seconds || seconds < 1) return "0s";

  const minute = 60;
  const hour = 60 * minute;

  // seconds
  if (seconds < minute) {
    return `${seconds}s`;
  }

  // minutes + seconds
  if (seconds < hour) {
    const m = Math.floor(seconds / minute);
    const s = seconds % minute;
    return s ? `${m}m ${s}s` : `${m}m`;
  }

  // hours + minutes (cap here)
  const h = Math.floor(seconds / hour);
  const m = Math.floor((seconds % hour) / minute);
  return m ? `${h}h ${m}m` : `${h}h`;
};


export default formatDurationUptoHour