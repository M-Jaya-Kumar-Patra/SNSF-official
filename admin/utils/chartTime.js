export const ADMIN_TIME_ZONE = "Asia/Kolkata";

const hasTimezone = (value) =>
  typeof value === "string" && /([zZ]|[+-]\d{2}:?\d{2})$/.test(value.trim());

const normalizeDateInput = (value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();

  if (!trimmed || hasTimezone(trimmed)) return trimmed;
  if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) return `${trimmed}Z`;
  return trimmed;
};

const toDate = (value) => {
  const date = new Date(normalizeDateInput(value));
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatChartTime = (value, range = "1day") => {
  const date = toDate(value);
  if (!date) return String(value || "");

  const isShortRange = ["1hour", "12hour", "1day"].includes(range);

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: ADMIN_TIME_ZONE,
    day: isShortRange ? undefined : "2-digit",
    month: isShortRange ? undefined : "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatTooltipTime = (value) => {
  const date = toDate(value);
  if (!date) return String(value || "");

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: ADMIN_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const toApiDateTime = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) {
    return `${value.length === 16 ? `${value}:00` : value}+05:30`;
  }

  return value;
};
