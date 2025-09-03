"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const createGame = () => {
    setIsCreating(true);
    // Generate a unique game ID
    const gameId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    router.push(`/game/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <span className="text-3xl font-bold text-white">♠</span>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Poker Settler
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Calculate poker game settlements with ease. Track buy-ins, chips, and automatically determine who pays whom after the game.
          </p>
        </div>

        {/* Main Actions */}
        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          <button
            onClick={createGame}
            disabled={isCreating}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Game...
              </div>
            ) : (
              <>
                <span className="mr-2">🎯</span>
                Start New Game
              </>
            )}
          </button>

          <button
            onClick={() => router.push('/history')}
            className="group px-8 py-4 bg-slate-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-slate-600 hover:border-slate-500"
          >
            <span className="mr-2">📊</span>
            Game History
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-200">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Track Buy-ins</h3>
            <p className="text-slate-400">Easily record each player&apos;s initial buy-in and additional chips throughout the game.</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-200">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🧮</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Auto Calculate</h3>
            <p className="text-slate-400">Automatically calculate settlements and minimize the number of transactions between players.</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-200">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Share & Collaborate</h3>
            <p className="text-slate-400">Share game links with players so they can add their own information and track the game together.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-slate-400">
          <p className="text-sm">
            Built with Next.js • Tailwind CSS • TypeScript
          </p>
        </div>
      </div>
    </div>
  );
}
