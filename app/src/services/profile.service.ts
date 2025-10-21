import { ICreateProfileDto } from '@/backend/profiles/profile.type';
import {
  IProfileQueryDto,
  MinimalProfile,
} from '@/backend/profiles/profile.type';
import { CompleteProfile, IUpdateProfileDto } from '@/backend/profiles';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/profiles';

export const findByHandle = async (
  handle: string
): Promise<CompleteProfile> => {
  const endpoint = `${BASE_URL}/${handle}`;
  const response = await axios.get<CompleteProfile>(endpoint);
  return response.data;
};

export const update = async (
  handle: string,
  data: IUpdateProfileDto
): Promise<CompleteProfile> => {
  const response = await axios.patch<CompleteProfile>(
    `${BASE_URL}/${handle}`,
    data
  );
  return response.data;
};

export const search = async (
  query: IProfileQueryDto
): Promise<MinimalProfile[]> => {
  const response = await axios.get<MinimalProfile[]>(BASE_URL, {
    params: query,
  });
  return response.data;
};

export const create = async (
  data: ICreateProfileDto
): Promise<CompleteProfile> => {
  const response = await axios.post<CompleteProfile>(BASE_URL, data);
  return response.data;
};
