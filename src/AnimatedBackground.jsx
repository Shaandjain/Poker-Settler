import React from "react";

export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 animate-gradient-x bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-[length:200%_200%] opacity-80"
      style={{
        backgroundSize: "200% 200%",
        backgroundPosition: "0% 50%",
        transition: "background-position 1s",
      }}
    />
  );
} 