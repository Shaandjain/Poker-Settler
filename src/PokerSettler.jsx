import React, { useState } from 'react';
import './styles.css';

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
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Poker Settlement Calculator</h1>
      <div className="w-full max-w-xl flex flex-col gap-4">
        {/* Players List */}
        <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Players</h2>
          {players.map((player) => (
            <div
              key={player.id}
              className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center"
            >
              <input
                type="text"
                className="border rounded px-2 py-1"
                value={player.name}
                onChange={(e) => handleChange(player.id, 'name', e.target.value)}
              />
              <input
                type="number"
                placeholder="Buy In"
                className="border rounded px-2 py-1"
                value={player.buyIn}
                onChange={(e) => handleChange(player.id, 'buyIn', e.target.value)}
              />
              <input
                type="number"
                placeholder="Cash Out"
                className="border rounded px-2 py-1"
                value={player.cashOut}
                onChange={(e) => handleChange(player.id, 'cashOut', e.target.value)}
              />
              <button
                onClick={() => removePlayer(player.id)}
                className="text-white bg-red-500 px-3 py-1 rounded-2xl"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addPlayer}
            className="bg-blue-600 text-white px-3 py-2 rounded-2xl"
          >
            + Add Player
          </button>
        </div>

        {/* Calculate Button */}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-2xl shadow"
          onClick={calculateSettlements}
        >
          Calculate Settlements
        </button>

        {/* Transactions */}
        {transactions.length > 0 && (
          <div className="bg-white shadow-md rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-2">Settlements</h2>
            <ul className="space-y-1">
              {transactions.map((t, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="font-semibold">{t.from}</span>
                  <span>pays</span>
                  <span className="font-semibold">{t.to}</span>
                  <span>${t.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
