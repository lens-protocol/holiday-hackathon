import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { useChallengeStore } from '../store/useChallengeStore';
import { useWalletStore } from '../store/useWalletStore';
import { formatEther } from 'ethers';
import { Trophy, Calendar, Users, Clock, Upload, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';

export const ChallengeList: React.FC = () => {
  const { challenges, loading, fetchChallenges, joinChallenge, uploadDailyPost } = useChallengeStore();
  const { address } = useWalletStore();

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges, address]);

  const handleJoinChallenge = async (challengeId: number, stakingAmount: bigint) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await joinChallenge(challengeId, stakingAmount);
    } catch (error) {
      // Error is handled in the store
      console.error(error);
    }
  };

  const formatRemainingTime = (seconds: number) => {
    if (seconds <= 0) return 'Enrollment ended';
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    return `${days}d ${hours}h remaining`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="bg-indigo-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                {challenge.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                challenge.isActive
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {challenge.isActive ? 'Active' : 'Completed'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-indigo-200 mt-1">
              <span>Created by:</span>
              <span className="font-mono">{challenge.creator.slice(0, 6)}...{challenge.creator.slice(-4)}</span>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Challenge Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Category
                  </span>
                  <span className="font-medium">{challenge.category}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Participants
                  </span>
                  <span className="font-medium">{challenge.participantCount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Duration
                  </span>
                  <span className="font-medium">
                    {format(challenge.startTime * 1000, 'MMM d')} - {format(challenge.endTime * 1000, 'MMM d, yyyy')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Grace Period
                  </span>
                  <span className="font-medium">{challenge.gracePeriodHours}h</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-indigo-900">Staking Amount</span>
                <span className="font-bold text-indigo-600">{formatEther(challenge.stakingAmount)} ETH</span>
              </div>
            </div>

            {/* {challenge.isUserEnrolled && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium">You're enrolled!</span>
                </div>
              </div>
            )} */}

            {challenge.remainingEnrollmentTime !== undefined && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">
                    {formatRemainingTime(challenge.remainingEnrollmentTime)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-gray-50 border-t space-y-3">
            <button
              onClick={() => handleJoinChallenge(challenge.id, challenge.stakingAmount)}
              disabled={
                !challenge.isActive || 
                !address || 
                challenge.isUserEnrolled || 
                (challenge.remainingEnrollmentTime !== undefined && challenge.remainingEnrollmentTime <= 0)
              }
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {challenge.isUserEnrolled 
                ? 'Already Enrolled' 
                : challenge.remainingEnrollmentTime !== undefined && challenge.remainingEnrollmentTime <= 0
                ? 'Enrollment Ended'
                : 'Join Challenge'
              }
            </button>

            {challenge.isActive && challenge.isUserEnrolled && (
              <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => uploadDailyPost(challenge.id, 'Qm ...')}
              >
                <Upload className="w-4 h-4" />
                Post Daily Update
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};