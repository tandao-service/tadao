import Cookies from "js-cookie";

export const setfcmTokenInCookie = (fcmToken: string, days: number = 7) => {
  Cookies.set("fcmToken", fcmToken, { expires: days });
};
export const getfcmTokenFromCookie = (): string | undefined => {
  return Cookies.get("fcmToken");
};

export const removefcmTokenFromCookie = () => {
  Cookies.remove("fcmToken");
};
