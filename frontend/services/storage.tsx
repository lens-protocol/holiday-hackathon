import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { IStorageProvider } from "@lens-protocol/client";

export const storage = {
  getItem(key: string) {
    return getCookie(key);
  },

  async setItem(key: string, value: string) {
    await setCookie(key, value);
  },

  async removeItem(key: string) {
    await deleteCookie(key);
  },
};