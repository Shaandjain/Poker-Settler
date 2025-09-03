import React, { useState } from 'react';

export default function PokerSettler() {
  const [players, setPlayers] = useState([
    { id: 1, name: 'Alice', buyIn: '', cashOut: '' },
    { id: 2, name: 'Bob', buyIn: '', cashOut: '' },
  ]);

  const [transactions, setTransactions] = useState([]);

  const addPlayer = () => {
    setPlayers((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: `Player ${prev.length + 1}`,
        buyIn: '',
        cashOut: ''
      },
    ]);
  };

  const removePlayer = (id) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleChange = (id, field, value) => {
    setPlayers((prev) =>
      prev.map((player) => {
        if (player.id === id) {
          return { ...player, [field]: value };
        }
        return player;
      })
    );
  };

  const calculateSettlements = () => {
    // Calculate net for each person: net = cashOut - buyIn
    // Positive net means they should receive money
    // Negative net means they should pay money
    const computedPlayers = players.map((p) => {
      const buyIn = parseFloat(p.buyIn) || 0;
      const cashOut = parseFloat(p.cashOut) || 0;
      const net = cashOut - buyIn;
      return {
        name: p.name,
        net,
      };
    });

    // Separate those who owe (negative) and who are owed (positive)
    const payers = computedPlayers
      .filter((p) => p.net < 0)
      .map((p) => ({ name: p.name, amount: Math.abs(p.net) }));
    const receivers = computedPlayers
      .filter((p) => p.net > 0)
      .map((p) => ({ name: p.name, amount: p.net }));

    const newTransactions = [];

    let i = 0;
    let j = 0;

    while (i < payers.length && j < receivers.length) {
      const amount = Math.min(payers[i].amount, receivers[j].amount);
      newTransactions.push({
        from: payers[i].name,
        to: receivers[j].name,
        amount: amount.toFixed(2),
      });

      payers[i].amount -= amount;
      receivers[j].amount -= amount;

      if (payers[i].amount === 0) {
        i++;
      }
      if (receivers[j].amount === 0) {
        j++;
      }
    }

    setTransactions(newTransactions);
  };

  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center justify-center py-8 px-2">
      <h1 className="text-4xl font-extrabold mb-8 text-white drop-shadow-lg text-center">Poker Settlement Calculator</h1>
      <div className="w-full max-w-xl flex flex-col gap-6">
        {/* Players List */}
        <div className="bg-white/90 shadow-2xl rounded-3xl p-6 flex flex-col gap-4 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Players</h2>
          {players.map((player) => (
            <div
              key={player.id}
              className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center"
            >
              <input
                type="text"
                className="border rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={player.name}
                onChange={(e) => handleChange(player.id, 'name', e.target.value)}
              />
              <input
                type="number"
                placeholder="Buy In"
                className="border rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                value={player.buyIn}
                onChange={(e) => handleChange(player.id, 'buyIn', e.target.value)}
              />
              <input
                type="number"
                placeholder="Cash Out"
                className="border rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                value={player.cashOut}
                onChange={(e) => handleChange(player.id, 'cashOut', e.target.value)}
              />
              <button
                onClick={() => removePlayer(player.id)}
                className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-2xl transition font-bold shadow"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addPlayer}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-2xl font-bold shadow transition"
          >
            + Add Player
          </button>
        </div>

        {/* Calculate Button */}
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl shadow-lg font-bold text-lg transition"
          onClick={calculateSettlements}
        >
          Calculate Settlements
        </button>

        {/* Transactions */}
        {transactions.length > 0 && (
          <div className="bg-white/90 shadow-xl rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Settlements</h2>
            <ul className="space-y-2">
              {transactions.map((t, index) => (
                <li key={index} className="flex items-center gap-2 text-lg">
                  <span className="font-semibold text-red-600">{t.from}</span>
                  <span>pays</span>
                  <span className="font-semibold text-green-700">{t.to}</span>
                  <span className="ml-2 bg-gray-200 rounded px-2 py-1 text-gray-800">${t.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
