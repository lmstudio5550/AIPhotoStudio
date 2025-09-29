import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        AI Photo Studio
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Powered by Gemini. Edit photos with a simple prompt.
      </p>
    </header>
  );
};

export default Header;