export function shouldSendRecommendationEmail(lastSentAt) {
  if (!lastSentAt) return true;

  const HOURS_24 = 24 * 60 * 60 * 1000;
  return Date.now() - new Date(lastSentAt).getTime() > HOURS_24;
}
