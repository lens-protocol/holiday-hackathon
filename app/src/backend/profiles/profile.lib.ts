import { IProfileDB } from './profile.model';
import { CompleteProfile, MinimalProfile } from './profile.type';

export const toProfileResponse = (profile: IProfileDB): CompleteProfile => ({
  _id: profile._id.toString(),
  handle: profile.handle,
  address: profile.address,
  name: profile.name,
  avatar: profile.avatar,
  bio: profile.bio,
  location: profile.location,
  website: profile.website,
  organization: profile.organization,
  joinedDate: profile.joinedDate,
  stats: {
    following: profile.following,
    followers: profile.followers,
    techScore: profile.techScore,
  },
  role: profile.role,
});

export const toMinimalProfile = (profile: IProfileDB): MinimalProfile => ({
  _id: profile._id.toString(),
  handle: profile.handle,
  name: profile.name,
  avatar: profile.avatar,
  address: profile.address,
  techScore: profile.techScore,
});
