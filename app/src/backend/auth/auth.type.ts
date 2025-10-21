import { MinimalProfile } from '../profiles';

export interface Web3Credentials {
  message: string;
  signature: string;
}

export interface AuthSession {
  profile: MinimalProfile;
}
