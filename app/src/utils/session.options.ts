import { SessionOptions } from 'iron-session';

export interface SessionData {
  address: string;
  chainId: number;
}

export const defaultSession: SessionData = {
  address: '',
  chainId: 0,
};

export const sessionOptions: SessionOptions = {
  password: 'complex_password_at_least_32_characters_long',
  cookieName: 'session-cookie',
  cookieOptions: {
    secure: true,
  },
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
