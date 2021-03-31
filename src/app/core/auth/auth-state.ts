import { BasicProfile } from './basic-profile'

export interface AuthState {
  idxConnected: boolean;
  did: string;
  basicProfile: BasicProfile;
}