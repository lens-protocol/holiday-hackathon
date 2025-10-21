import { Address } from "viem";

export interface IBasePostDto {
  _id?: string;
  title: string;
  content: string;
  profileId: string;
  imageUrl?: string;
  tags?: string[];
}

export type ICreatePostDto = IBasePostDto;

export type IUpdatePostDto = Partial<IBasePostDto>;

export interface IPostQueryDto {
  title?: string;
  profileId?: string;
  tags?: string[];
  fromDate?: string;
  toDate?: string;
  limit?: number;
  offset?: number;
}

export interface IPost extends IBasePostDto {
  createdAt: string;
  engagement: {
    likes: number;
    redrops: number;
    replies: number;
  };
}

export interface IPopulatedPost extends Omit<IPost, 'profileId'> {
  profile: {
    _id: string;
    handle: string;
    name: string;
    avatar: string;
    address: Address;
    techScore: number;
  };
}
