import React from 'react';
import PokerSettler from './PokerSettler';
import AnimatedBackground from './AnimatedBackground';

function App() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <AnimatedBackground />
      <PokerSettler />
    </div>
  );
}

export default App;

