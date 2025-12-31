
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-md border border-gray-700/60 rounded-xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;
