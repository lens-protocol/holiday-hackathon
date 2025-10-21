export interface IBaseProfileDto {
  _id: string;
  handle: string;
  address: string;
  name: string;
  avatar: string;
  bio: string;
  location?: string;
  website?: string;
  organization?: string;
}

export interface ICreateProfileDto extends IBaseProfileDto {
  role?: string;
}

export type IUpdateProfileDto = Partial<IBaseProfileDto>;

export interface IProfileQueryDto {
  search?: string;
  address?: string;
  handle?: string;
  role?: string;
  organization?: string;
  limit?: number;
  offset?: number;
}

export interface MinimalProfile {
  _id: string;
  handle: string;
  name: string;
  avatar: string;
  address: string;
  techScore: number;
}

export interface CompleteProfile extends IBaseProfileDto {
  joinedDate: string;
  stats: {
    following: number;
    followers: number;
    techScore: number;
  };
  role?: string;
}
