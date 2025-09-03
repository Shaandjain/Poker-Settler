"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface GameHistoryItem {
  id: string;
  shareId: string;
  createdAt: string;
  playerCount: number;
  totalPot: number;
  status: 'completed' | 'in-progress';
}

export default function HistoryPage() {
  const router = useRouter();
  
  // Mock data for demonstration - in a real app this would come from localStorage or a database
  const [games] = useState<GameHistoryItem[]>([
    {
      id: '1',
      shareId: 'demo-game-1',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      playerCount: 6,
      totalPot: 300,
      status: 'completed'
    },
    {
      id: '2',
      shareId: 'demo-game-2',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      playerCount: 4,
      totalPot: 200,
      status: 'completed'
    },
    {
      id: '3',
      shareId: 'demo-game-3',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      playerCount: 8,
      totalPot: 500,
      status: 'completed'
    }
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'text-green-400' : 'text-yellow-400';
  };

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? '✅' : '🔄';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Game History</h1>
            <p className="text-slate-300">View your previous poker games and their outcomes</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors mt-4 sm:mt-0"
          >
            🏠 Back to Home
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Total Games</h3>
            <p className="text-3xl font-bold text-blue-400">{games.length}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-400">
              {games.filter(g => g.status === 'completed').length}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Total Players</h3>
            <p className="text-3xl font-bold text-purple-400">
              {games.reduce((sum, g) => sum + g.playerCount, 0)}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Total Pot</h3>
            <p className="text-3xl font-bold text-yellow-400">
              ${games.reduce((sum, g) => sum + g.totalPot, 0).toFixed(0)}
            </p>
          </div>
        </div>

        {/* Games List */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Recent Games</h2>
          </div>
          
          {games.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">No games yet</h3>
              <p className="text-slate-400 mb-6">Start your first poker game to see it here!</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start New Game
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {games.map((game) => (
                <div key={game.id} className="p-6 hover:bg-slate-700/30 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">Game {game.shareId}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
                          <span>{getStatusIcon(game.status)}</span>
                          {game.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <span>📅 {formatDate(game.createdAt)}</span>
                        <span>👥 {game.playerCount} players</span>
                        <span>💰 ${game.totalPot.toFixed(2)} pot</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => router.push(`/game/${game.shareId}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Game
                      </button>
                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            navigator.clipboard.writeText(`${window.location.origin}/game/${game.shareId}`);
                          }
                        }}
                        className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            🎯 Start New Game
          </button>
        </div>
      </div>
    </div>
  );
}
