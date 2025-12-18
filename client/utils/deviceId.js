import Cookies from "js-cookie";
export const getDeviceId = () => {
  let deviceId = Cookies.get("device_id");

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    Cookies.set("device_id", deviceId, {
      expires: 365,
      sameSite: "Lax",
    });
  }

  return deviceId;
};
