export const PROMOTIONAL_TEST_EMAIL = "jayapatra2004@gmail.com";
export const PRODUCTION_ADMIN_ORIGIN = "https://admin.snsteelfabrication.com";

// An Origin is supplied by the admin browser. A local build can point at the
// production API, so the API's NODE_ENV alone must never enable a real send.
export function canSendPromotionalEmailToUsers(origin, nodeEnv = process.env.NODE_ENV) {
  return nodeEnv === "production" && origin === PRODUCTION_ADMIN_ORIGIN;
}

export function outboundEmailRecipients(to, nodeEnv = process.env.NODE_ENV) {
  return nodeEnv === "production" ? to : PROMOTIONAL_TEST_EMAIL;
}

export function validCampaignEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function uniqueCampaignUsers(users) {
  const seen = new Set();
  return users.filter((user) => {
    if (!validCampaignEmail(user.email)) return false;
    const email = user.email.trim().toLowerCase();
    if (seen.has(email)) return false;
    seen.add(email);
    return true;
  });
}
