'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Brain,
  GraduationCap,
  Flame,
  Trophy,
  MapPin,
  Calendar,
  Star,
  Zap,
  Edit2,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CompleteProfile } from '@/backend/profiles';

interface UserProfileProps {
  profile: CompleteProfile;
  isOwner?: boolean;
}

export function UserProfile({ profile, isOwner = false }: UserProfileProps) {
  const stats = {
    learningLevel: 3,
    activePills: 5,
    streak: 12,
    completedPills: 25,
  };

  return (
    <div className='relative rounded-xl bg-gray-900/30 p-6 backdrop-blur-sm'>
      <div className='flex gap-6'>
        {/* Profile Stats Circle */}
        <div className='relative flex w-32 flex-col justify-between'>
          {/* Outer Circle */}
          <div className='relative aspect-square'>
            {/* Main circle with avatar */}
            <div className='relative h-32 w-32 rounded-full border border-gray-700/50'>
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={128}
                height={128}
                className='rounded-full object-cover'
                priority
              />
            </div>

            {/* Tech Score at Top */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='absolute -right-2 -top-2 flex h-12 w-12 cursor-help items-center justify-center rounded-full border-4 border-gray-900 bg-purple-500'>
                    <span className='text-xl font-bold text-white'>
                      {profile.stats.techScore}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className='font-semibold'>
                    Tech Score: {profile.stats.techScore}
                  </p>
                  <p className='text-sm text-gray-400'>
                    Overall learning achievement
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Stats at Bottom */}
          <div className='flex flex-col items-center justify-center gap-2'>
            {/* Top Row */}
            <div className='flex gap-2'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='relative cursor-help rounded-full bg-blue-500 p-2'>
                      <GraduationCap className='h-5 w-5 text-white' />
                      <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-blue-500'>
                        {stats.learningLevel}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='font-semibold'>
                      Learning Level {stats.learningLevel}
                    </p>
                    <p className='text-sm text-gray-400'>
                      Keep learning to level up!
                    </p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='relative cursor-help rounded-full bg-purple-500 p-2'>
                      <Brain className='h-5 w-5 text-white' />
                      <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-purple-500'>
                        {stats.activePills}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='font-semibold'>
                      {stats.activePills} Active Pills
                    </p>
                    <p className='text-sm text-gray-400'>Currently learning</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Bottom Row */}
            <div className='flex gap-2'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='relative cursor-help rounded-full bg-amber-500 p-2'>
                      <Flame className='h-5 w-5 text-white' />
                      <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-amber-500'>
                        {stats.streak}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='font-semibold'>{stats.streak} Day Streak!</p>
                    <p className='text-sm text-gray-400'>
                      Keep the momentum going
                    </p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='relative cursor-help rounded-full bg-amber-500 p-2'>
                      <Trophy className='h-5 w-5 text-white' />
                      <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-amber-500'>
                        {stats.completedPills}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='font-semibold'>
                      {stats.completedPills} Completed Pills
                    </p>
                    <p className='text-sm text-gray-400'>Knowledge gained</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className='flex-1 pt-2'>
          <div className='flex items-start justify-between'>
            <div>
              <h1 className='flex items-center gap-2 text-2xl font-bold text-white'>
                {profile.name}
                <Star className='h-5 w-5 text-amber-400' />
              </h1>
              <p className='text-gray-400'>@{profile.handle}</p>
            </div>

            {isOwner ? (
              <Button
                variant='outline'
                size='sm'
                className='rounded-full border-purple-500/50 hover:border-purple-500 hover:bg-purple-500/10'
              >
                <Edit2 className='mr-1 h-4 w-4' />
                Edit Profile
              </Button>
            ) : (
              <Button
                size='sm'
                className='rounded-full bg-purple-500 text-white hover:bg-purple-600'
              >
                <Zap className='mr-1 h-4 w-4' />
                Start Learning
              </Button>
            )}
          </div>

          <p className='mt-2 text-gray-200'>{profile.role}</p>
          <p className='mt-2 line-clamp-2 text-gray-300'>{profile.bio}</p>

          <div className='mt-4 flex items-center gap-4 text-sm text-gray-400'>
            <div className='flex items-center gap-1'>
              <MapPin className='h-4 w-4' />
              {profile.location}
            </div>
            <div className='flex items-center gap-1'>
              <Calendar className='h-4 w-4' />
              Joined {profile.joinedDate}
            </div>
          </div>

          <div className='mt-4 flex items-center gap-6'>
            <div>
              <span className='font-bold text-white'>
                {profile.stats.following}
              </span>
              <span className='ml-1 text-gray-400'>Following</span>
            </div>
            <div>
              <span className='font-bold text-white'>
                {profile.stats.followers}
              </span>
              <span className='ml-1 text-gray-400'>Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
