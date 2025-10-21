import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  ICreateProfileDto,
  IUpdateProfileDto,
  CompleteProfile,
  MinimalProfile,
  IProfileQueryDto,
} from '@/backend/profiles';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const useProfile = (handle: string) => {
  return useQuery<CompleteProfile>({
    queryKey: ['profile', handle],
    queryFn: async () => {
      const { data } = await api.get(`/profiles/${handle}`);
      return data;
    },
    enabled: !!handle,
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<CompleteProfile, Error, ICreateProfileDto>({
    mutationFn: async (newProfile) => {
      const { data } = await api.post('/profiles', newProfile);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
};

export const useUpdateProfile = (handle: string) => {
  const queryClient = useQueryClient();

  return useMutation<CompleteProfile, Error, IUpdateProfileDto>({
    mutationFn: async (updateData) => {
      const { data } = await api.patch(`/profiles/${handle}`, updateData);
      return data;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile', handle], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
};

export const useSearchProfiles = (params: Partial<IProfileQueryDto>) => {
  return useQuery<MinimalProfile[]>({
    queryKey: ['profiles', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });

      const { data } = await api.get(`/profiles?${searchParams}`);
      return data;
    },
    enabled: Object.values(params).some((value) => !!value),
  });
};
