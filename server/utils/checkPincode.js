const serviceablePins = new Set(
  [
    process.env.SERVICEABLE_PINS_1,
    process.env.SERVICEABLE_PINS_2,
    process.env.SERVICEABLE_PINS_3,
  ]
    .filter(Boolean)        // remove undefined envs
    .join(",")
    .split(",")
    .map(p => p.trim())
    .filter(Boolean)        // remove empty strings
);

export const isPincodeServiceable = (pin) => {
  if (!pin) return false;
  return serviceablePins.has(String(pin));
};
