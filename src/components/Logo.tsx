import React from 'react';
import { Zap } from 'lucide-react';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur-lg opacity-75 animate-pulse"></div>
        
        {/* Logo container */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-2 rounded-lg border border-cyan-500/50">
          <Zap className="h-6 w-6 text-cyan-400" fill="currentColor" />
        </div>
      </div>
      
      {/* Brand name */}
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
          DecorMitra
        </span>
        <span className="text-[10px] sm:text-xs text-gray-400 tracking-widest -mt-1">ILLUMINATE YOUR WORLD</span>
      </div>
    </div>
  );
};

export const LogoIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Outer glow ring */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur-lg opacity-75 animate-pulse"></div>
      
      {/* Logo container */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-2 rounded-lg border border-cyan-500/50">
        <Zap className="h-6 w-6 text-cyan-400" fill="currentColor" />
      </div>
    </div>
  );
};
