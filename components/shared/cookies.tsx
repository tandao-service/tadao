import Cookies from "js-cookie";

export const setsourceCookie = (source: string, days: number = 7) => {
  Cookies.set("source", source, { expires: days });
};
export const getsourceCookie = (): string | undefined => {
  return Cookies.get("source");
};

export const removesourceCookie = () => {
  Cookies.remove("source");
};
