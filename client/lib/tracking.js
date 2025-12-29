import Cookies from "js-cookie";

// --- 1️⃣ Get or Create Visitor ID (90 days)
export function getOrCreateVisitorId() {
  let visitorId = Cookies.get("visitorId");

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    Cookies.set("visitorId", visitorId, { expires: 90 });
  }

  return visitorId;
}

// --- 2️⃣ Get or Create Session ID (New per visit)
export function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("sessionId", sessionId);
  }

  return sessionId;
}

// --- 3️⃣ Auto Detect Device Info
function getDeviceDetails() {
  const ua = navigator.userAgent;

  return {
    deviceType: /mobile/i.test(ua) ? "mobile" : "desktop",
    browser: ua,
    os: navigator.platform,
  };
}

// --- 4️⃣ Track User Visit
export async function trackVisitor(
  pageName,
  scrollDepth = 0,
  timeSpent = 0,
  userId = null
) {
  if (typeof window === "undefined") return;

  const visitorId = getOrCreateVisitorId();
  const sessionId = getOrCreateSessionId();

  const { deviceType, browser, os } = getDeviceDetails();

  // Prepare minimal data — server will fill location
  const body = {
    visitorId,
    sessionId,
    userId,
    pageName,
    scrollDepth,
    timeSpent,
    deviceType,
    browser,
    os,
    referrer: document.referrer || "direct",
  };


  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitor/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}


// --- 5️⃣ Track Product Event
export async function trackProductEvent(productId, eventType = "view", timeSpent = 0, userId = null) {


  
  if (typeof window === "undefined") return;

  const visitorId = getOrCreateVisitorId();
  const sessionId = getOrCreateSessionId();

  const body = {
    sessionId,
    visitorId,
    userId,
    productId,
    eventType,   // "view", "add_to_cart", etc.
    timeSpent,
  };


  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/productEvent/trackEvent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
