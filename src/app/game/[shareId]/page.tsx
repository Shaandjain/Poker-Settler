"use client";
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Player, Settlement } from '@/types';

export default function GamePage() {
  const { shareId } = useParams();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState({ name: '', buyIn: '' });
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [chipAmount, setChipAmount] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Calculate totals
  const totalPot = players.reduce((sum, p) => sum + p.buyIn, 0);
  const totalOutcome = players.reduce((sum, p) => sum + p.outcome, 0);
  const potDifference = totalOutcome - totalPot;

  // Add player
  const addPlayer = () => {
    if (!newPlayer.name.trim() || !newPlayer.buyIn || isNaN(parseFloat(newPlayer.buyIn))) {
      return;
    }
    
    const player: Player = {
      id: Date.now().toString(),
      name: newPlayer.name.trim(),
      buyIn: parseFloat(newPlayer.buyIn),
      outcome: 0,
      chips: parseFloat(newPlayer.buyIn)
    };
    
    setPlayers([...players, player]);
    setNewPlayer({ name: '', buyIn: '' });
  };

  // Remove player
  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
    setSettlements([]);
  };

  // Add chips to player
  const addChips = () => {
    if (!selectedPlayer || !chipAmount || isNaN(parseFloat(chipAmount))) {
      return;
    }
    
    const amount = parseFloat(chipAmount);
    setPlayers(players.map(p => 
      p.id === selectedPlayer 
        ? { ...p, chips: p.chips + amount, buyIn: p.buyIn + amount }
        : p
    ));
    setChipAmount('');
    setSelectedPlayer(null);
  };

  // Remove chips from player
  const removeChips = () => {
    if (!selectedPlayer || !chipAmount || isNaN(parseFloat(chipAmount))) {
      return;
    }
    
    const amount = parseFloat(chipAmount);
    const player = players.find(p => p.id === selectedPlayer);
    if (!player || player.chips < amount) return;
    
    setPlayers(players.map(p => 
      p.id === selectedPlayer 
        ? { ...p, chips: p.chips - amount, buyIn: p.buyIn - amount }
        : p
    ));
    setChipAmount('');
    setSelectedPlayer(null);
  };

  // Update player outcome
  const updateOutcome = (playerId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setPlayers(players.map(p =>
      p.id === playerId ? { ...p, outcome: numValue } : p
    ));
    setSettlements([]);
  };

  // Calculate settlements
  const calculateSettlements = () => {
    setIsCalculating(true);
    
    // Validate that all players have outcomes
    if (players.some(p => p.outcome === 0)) {
      alert('Please enter final amounts for all players before calculating settlements.');
      setIsCalculating(false);
      return;
    }

    const balances = players.map(p => ({
      id: p.id,
      name: p.name,
      balance: p.outcome - p.buyIn
    }));

    // Sort by balance (negative first)
    balances.sort((a, b) => a.balance - b.balance);

    const newSettlements: Settlement[] = [];
    let i = 0;
    let j = balances.length - 1;

    while (i < j) {
      const debtor = balances[i];
      const creditor = balances[j];

      if (Math.abs(debtor.balance) < 0.01) {
        i++;
        continue;
      }
      if (Math.abs(creditor.balance) < 0.01) {
        j--;
        continue;
      }

      const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
      newSettlements.push({
        fromPlayerId: debtor.id,
        toPlayerId: creditor.id,
        amount: Math.round(amount * 100) / 100
      });

      debtor.balance += amount;
      creditor.balance -= amount;

      if (Math.abs(debtor.balance) < 0.01) i++;
      if (Math.abs(creditor.balance) < 0.01) j--;
    }

    setSettlements(newSettlements);
    setIsCalculating(false);
  };

  // Copy game link
  const copyGameLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShowShareModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Poker Game</h1>
            <p className="text-slate-300">Game ID: {shareId}</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📤 Share Game
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              🏠 Home
            </button>
          </div>
        </div>

        {/* Game Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Total Pot</h3>
            <p className="text-3xl font-bold text-green-400">${totalPot.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Total Outcome</h3>
            <p className="text-3xl font-bold text-blue-400">${totalOutcome.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Difference</h3>
            <p className={`text-3xl font-bold ${potDifference === 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${potDifference.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Chip Management */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">💰 Chip Management</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Player</label>
              <select 
                value={selectedPlayer || ''} 
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a player...</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ${p.chips.toFixed(2)} chips
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
              <input
                type="number"
                value={chipAmount}
                onChange={(e) => setChipAmount(e.target.value)}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={addChips}
              disabled={!selectedPlayer || !chipAmount}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ➕ Add Chips
            </button>
            <button
              onClick={removeChips}
              disabled={!selectedPlayer || !chipAmount}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ➖ Remove Chips
            </button>
          </div>
        </div>

        {/* Players */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">👥 Players ({players.length})</h3>
          
          {/* Add Player Form */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-slate-700/50 rounded-lg">
            <input
              type="text"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
              className="flex-1 p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Player name"
            />
            <input
              type="number"
              value={newPlayer.buyIn}
              onChange={(e) => setNewPlayer({ ...newPlayer, buyIn: e.target.value })}
              className="w-32 p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Buy-in"
              step="0.01"
              min="0"
            />
            <button
              onClick={addPlayer}
              disabled={!newPlayer.name.trim() || !newPlayer.buyIn}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ➕ Add Player
            </button>
          </div>

          {/* Players List */}
          {players.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-lg">No players added yet.</p>
              <p className="text-sm">Add players above to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {players.map((player) => (
                <div key={player.id} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => {
                        setPlayers(players.map(p => 
                          p.id === player.id ? { ...p, name: e.target.value } : p
                        ));
                        setSettlements([]);
                      }}
                      className="w-full p-2 bg-slate-600 border border-slate-500 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span>Chips: <span className="font-semibold text-green-400">${player.chips.toFixed(2)}</span></span>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      value={player.outcome}
                      onChange={(e) => updateOutcome(player.id, e.target.value)}
                      className="w-full p-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Final amount"
                      step="0.01"
                    />
                  </div>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calculate Settlements */}
        <div className="text-center mb-8">
          <button
            onClick={calculateSettlements}
            disabled={players.length === 0 || isCalculating}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-lg rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            {isCalculating ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Calculating...
              </div>
            ) : (
              '🧮 Calculate Settlements'
            )}
          </button>
        </div>

        {/* Settlements */}
        {settlements.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">💸 Settlements</h3>
            <div className="space-y-3">
              {settlements.map((settlement, index) => {
                const fromPlayer = players.find(p => p.id === settlement.fromPlayerId);
                const toPlayer = players.find(p => p.id === settlement.toPlayerId);
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-red-400 font-semibold">{fromPlayer?.name}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-green-400 font-semibold">{toPlayer?.name}</span>
                    </div>
                    <span className="text-xl font-bold text-white">${settlement.amount.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Share Game</h3>
            <p className="text-slate-300 mb-4">Share this link with other players so they can join the game:</p>
            <div className="bg-slate-700 p-3 rounded border border-slate-600 mb-4">
              <code className="text-blue-400 break-all">
                {typeof window !== 'undefined' ? window.location.href : ''}
              </code>
            </div>
            <div className="flex gap-3">
              <button
                onClick={copyGameLink}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📋 Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 