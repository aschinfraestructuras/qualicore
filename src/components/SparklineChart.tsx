import React from 'react';
import { motion } from 'framer-motion';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  alertThreshold?: number;
  showAlert?: boolean;
  animate?: boolean;
  className?: string;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  width = 80,
  height = 30,
  color = '#3B82F6',
  alertThreshold = 0.8,
  showAlert = false,
  animate = true,
  className = ''
}) => {
  if (!data || data.length < 2) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-xs text-gray-400">Sem dados</div>
      </div>
    );
  }

  // Normalizar dados para o gráfico
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const normalizedData = data.map(value => 
    ((value - min) / range) * (height - 4) + 2
  );

  // Criar path SVG
  const points = normalizedData.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - 4) + 2;
    const y = height - value;
    return `${x},${y}`;
  }).join(' ');

  // Determinar cor baseada em alertas e tendência
  const getChartColor = () => {
    if (showAlert) return '#EF4444'; // Vermelho para alertas
    if (data.length >= 2) {
      const trend = data[data.length - 1] - data[0];
      if (trend < 0) return '#F59E0B'; // Amarelo para tendência negativa
    }
    return color;
  };

  const chartColor = getChartColor();

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width, height }}
      initial={animate ? { opacity: 0, scale: 0.8 } : {}}
      animate={animate ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Alerta Indicator */}
      {showAlert && (
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* SVG Chart */}
      <svg
        width={width}
        height={height}
        className="overflow-visible"
      >
        {/* Background area */}
        <defs>
          <linearGradient id={`gradient-${Math.random()}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={chartColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={chartColor} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d={`M ${points.split(' ').map((point, index) => {
            const [x, y] = point.split(',').map(Number);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')} L ${width - 2} ${height - 2} L 2 ${height - 2} Z`}
          fill={`url(#gradient-${Math.random()})`}
          opacity="0.3"
        />

        {/* Line */}
        <motion.path
          d={`M ${points.split(' ').map((point, index) => {
            const [x, y] = point.split(',').map(Number);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}`}
          stroke={chartColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animate ? { pathLength: 0 } : {}}
          animate={animate ? { pathLength: 1 } : {}}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            delay: 0.2
          }}
        />

        {/* Data points */}
        {points.split(' ').map((point, index) => {
          const [x, y] = point.split(',').map(Number);
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={chartColor}
              initial={animate ? { scale: 0, opacity: 0 } : {}}
              animate={animate ? { scale: 1, opacity: 1 } : {}}
              transition={{ 
                duration: 0.3, 
                delay: 0.5 + index * 0.1,
                ease: "easeOut"
              }}
            />
          );
        })}
      </svg>

      {/* Trend indicator */}
      {data.length >= 2 && (
        <motion.div
          className="absolute -bottom-1 -right-1 w-3 h-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {data[data.length - 1] > data[0] ? (
            <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-green-500" />
          ) : (
            <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-red-500" />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
