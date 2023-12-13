export const getRelativeTime = (timestamp: Date) => {
  const currentDate = Date.now();
  const commentDate = new Date(timestamp).getTime();
  const seconds = Math.floor((currentDate - commentDate) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  if (seconds < 60) return 'just now';

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) return `${interval}${key.charAt(0)}`;
  }

  return `${Math.floor(seconds / intervals.year)}y`;
};
