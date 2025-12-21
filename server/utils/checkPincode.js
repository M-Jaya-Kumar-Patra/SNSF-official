export const isPincodeServiceable = (pin) => {
  const pins = process.env.SERVICEABLE_PINCODES
    ?.split(",")
    .map(p => p.trim());

  return pins?.includes(String(pin));
};
