'use client';

import { ConnectKitButton } from 'connectkit';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navbar';

export default function ManagePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Game Stats Panel */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Game Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Players:</span>
                <span>0</span>
              </div>
              <div className="flex justify-between">
                <span>Active Combats:</span>
                <span>0</span>
              </div>
              <div className="flex justify-between">
                <span>Total NPCs:</span>
                <span>0</span>
              </div>
            </div>
          </div>

          {/* Admin Controls */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
            <div className="space-y-4">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md">
                Pause All Combats
              </button>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md">
                Reset Game State
              </button>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md">
                Generate New NPCs
              </button>
            </div>
          </div>

          {/* System Logs */}
          <div className="bg-gray-800 p-6 rounded-lg md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">System Logs</h2>
            <div className="bg-gray-900 p-4 rounded-md h-48 overflow-y-auto font-mono text-sm">
              <p className="text-gray-400">No logs available...</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
