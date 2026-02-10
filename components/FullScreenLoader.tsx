import React, { useState, useEffect } from 'react';

const genericMessages = [
    "Connecting visionaries...",
    "Assembling the future...",
    "Igniting innovation...",
    "Building tomorrow's startups...",
    "Fostering collaboration...",
];

interface FullScreenLoaderProps {
    messages?: string[];
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ messages = genericMessages }) => {
  const [message, setMessage] = useState(messages[0] || "Loading...");

  useEffect(() => {
    if (messages.length <= 1) {
        setMessage(messages[0] || "Loading...");
        return;
    }
    
    // Set the first message immediately
    setMessage(messages[0]);

    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]" aria-label="Loading" role="status">
      <div className="relative flex flex-col items-center">
        <img 
            src="https://i.postimg.cc/pLTtqf3Q/Picsart-25-09-19-20-29-01-019.png" 
            alt="Startives Logo" 
            className="w-20 h-20 animate-pulse"
        />
        <p className="text-white text-base font-semibold mt-5 transition-opacity duration-500">{message}</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;