import { getAQICategory, getAQIColor, getAQIBg } from '@/types';
import { motion } from 'framer-motion';

interface AQIBadgeProps {
  aqi: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'h-7 min-w-[3.5rem] px-2 text-xs font-bold',
  md: 'h-10 min-w-[4.5rem] px-3 text-sm font-bold',
  lg: 'h-14 min-w-[5.5rem] px-4 text-lg font-bold',
  xl: 'h-20 min-w-[6.5rem] px-5 text-2xl font-bold',
};

export function AQIBadge({ aqi, size = 'md', showLabel = true, animated = true }: AQIBadgeProps) {
  const category = getAQICategory(aqi);
  const color = getAQIColor(aqi);
  const bg = getAQIBg(aqi);

  const content = (
    <div
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl ${sizeClasses[size]} transition-all`}
      style={{ backgroundColor: bg, color: color }}
    >
      <span>{aqi}</span>
      {showLabel && <span className="font-semibold opacity-90 hidden sm:inline">· {category}</span>}
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05 }}
    >
      {content}
    </motion.div>
  );
}
