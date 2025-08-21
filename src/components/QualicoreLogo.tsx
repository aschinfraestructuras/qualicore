import React from 'react';
import { motion } from 'framer-motion';

interface QualicoreLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  animated?: boolean;
  className?: string;
}

export default function QualicoreLogo({ 
  size = 'md', 
  variant = 'full', 
  animated = true,
  className = ''
}: QualicoreLogoProps) {
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl', 
    xl: 'text-3xl'
  };

  const LogoIcon = () => (
    <motion.div
      className={`${sizeClasses[size]} relative flex items-center justify-center ${className}`}
      whileHover={animated ? { scale: 1.05 } : {}}
      whileTap={animated ? { scale: 0.95 } : {}}
    >
      {/* Hexágono de fundo */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#3730a3" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Hexágono principal */}
        <polygon
          points="50,5 85,27.5 85,72.5 50,95 15,72.5 15,27.5"
          fill="url(#logoGradient)"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          filter="url(#glow)"
          className="transition-all duration-300"
        />
        
        {/* Elemento interno - Q estilizado */}
        <path
          d="M30 35 Q30 25 40 25 L60 25 Q70 25 70 35 L70 45 Q70 55 60 55 L50 55 L45 65 L35 55 L40 55 Q30 55 30 45 Z"
          fill="white"
          opacity="0.9"
        />
        
        {/* Ponto do Q */}
        <circle
          cx="65"
          cy="50"
          r="3"
          fill="white"
          opacity="0.9"
        />
      </svg>
    </motion.div>
  );

  const LogoText = () => (
    <motion.span
      className={`font-bold tracking-wider ${textSizes[size]} bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent ${className}`}
      whileHover={animated ? { scale: 1.02 } : {}}
    >
      Qualicore
    </motion.span>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text') {
    return <LogoText />;
  }

  // Variant 'full' - ícone + texto
  return (
    <motion.div 
      className={`flex items-center space-x-3 ${className}`}
      whileHover={animated ? { scale: 1.02 } : {}}
    >
      <LogoIcon />
      <LogoText />
    </motion.div>
  );
}

// Componente para o favicon/ícone pequeno
export function QualicoreFavicon() {
  return (
    <div className="h-6 w-6">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="faviconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#3730a3" />
          </linearGradient>
        </defs>
        <polygon
          points="50,5 85,27.5 85,72.5 50,95 15,72.5 15,27.5"
          fill="url(#faviconGradient)"
        />
        <path
          d="M30 35 Q30 25 40 25 L60 25 Q70 25 70 35 L70 45 Q70 55 60 55 L50 55 L45 65 L35 55 L40 55 Q30 55 30 45 Z"
          fill="white"
          opacity="0.9"
        />
        <circle cx="65" cy="50" r="3" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
}
