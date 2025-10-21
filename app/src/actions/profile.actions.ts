'use server';

import { CompleteProfile, findByHandle } from '@/backend/profiles';
import { revalidatePath } from 'next/cache';

export type ProfileActionError = {
  message: string;
  code: 'NOT_FOUND' | 'SERVER_ERROR';
};

export type GetProfileResult = {
  success: boolean;
  data?: CompleteProfile;
  error?: ProfileActionError;
};

export async function getProfileByHandle(
  handle: string,
): Promise<GetProfileResult> {
  try {
    const profile = await findByHandle(handle);

    if (!profile) {
      return {
        success: false,
        error: {
          message: `Profile with handle "${handle}" not found`,
          code: 'NOT_FOUND',
        },
      };
    }

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      success: false,
      error: {
        message: 'Failed to fetch profile',
        code: 'SERVER_ERROR',
      },
    };
  }
}
