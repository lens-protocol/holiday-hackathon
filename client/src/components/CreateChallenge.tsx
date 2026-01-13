import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useChallengeStore } from '../store/useChallengeStore';
import toast from 'react-hot-toast';

export const CreateChallenge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    stakingAmount: '',
    durationInDays: 30,
    gracePeriodHours: 24,
  });

  const { createChallenge } = useChallengeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createChallenge(formData);
      toast.success('Challenge created successfully!');
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create challenge');
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-500 transition-colors"
      >
        <Plus className="w-6 h-6" />
        Create Challenge
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-purple-600">Create New Challenge</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 text-black p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 p-2 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Productivity">Productivity</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Staking Amount (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.stakingAmount}
                  onChange={(e) => setFormData({ ...formData, stakingAmount: e.target.value })}
                  className="mt-1 p-2 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (Days)</label>
                <input
                  type="number"
                  value={formData.durationInDays}
                  onChange={(e) => setFormData({ ...formData, durationInDays: parseInt(e.target.value) })}
                  className="mt-1 p-2 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Grace Period (Hours)</label>
                <input
                  type="number"
                  value={formData.gracePeriodHours}
                  onChange={(e) => setFormData({ ...formData, gracePeriodHours: parseInt(e.target.value) })}
                  className="mt-1 p-2 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 cursor-pointer bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 cursor-pointer bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};