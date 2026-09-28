import { motion } from 'framer-motion';

// Animated SVG depicting Delhi's skyline with smog layers, moving wind particles,
// a sun filtering through haze, and masked citizen figures.
export function HeroSmogVisualization() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          {/* Sky gradient — bright but hazy */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="40%" stopColor="#e0e7ff" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>

          {/* Sun glow */}
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>

          {/* Smog gradient */}
          <linearGradient id="smogGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0" />
            <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="smogGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0" />
            <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.35" />
          </linearGradient>

          {/* Building gradient */}
          <linearGradient id="bldgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="bldgGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="1200" height="600" fill="url(#skyGrad)" />

        {/* Sun */}
        <motion.g
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="900" cy="140" r="120" fill="url(#sunGrad)" />
          <circle cx="900" cy="140" r="35" fill="#fde68a" opacity="0.6" />
        </motion.g>

        {/* Distant building silhouettes (background layer) */}
        <g opacity="0.25">
          <rect x="50" y="280" width="40" height="180" fill="url(#bldgGrad2)" rx="2" />
          <rect x="100" y="250" width="55" height="210" fill="url(#bldgGrad2)" rx="2" />
          <rect x="165" y="300" width="35" height="160" fill="url(#bldgGrad2)" rx="2" />
          <rect x="210" y="230" width="60" height="230" fill="url(#bldgGrad2)" rx="2" />
          <rect x="280" y="270" width="45" height="190" fill="url(#bldgGrad2)" rx="2" />
          <rect x="335" y="200" width="50" height="260" fill="url(#bldgGrad2)" rx="2" />
          <rect x="395" y="260" width="40" height="200" fill="url(#bldgGrad2)" rx="2" />
          <rect x="780" y="290" width="42" height="170" fill="url(#bldgGrad2)" rx="2" />
          <rect x="830" y="240" width="55" height="220" fill="url(#bldgGrad2)" rx="2" />
          <rect x="895" y="270" width="38" height="190" fill="url(#bldgGrad2)" rx="2" />
          <rect x="945" y="210" width="48" height="250" fill="url(#bldgGrad2)" rx="2" />
          <rect x="1005" y="260" width="42" height="200" fill="url(#bldgGrad2)" rx="2" />
          <rect x="1060" y="280" width="50" height="180" fill="url(#bldgGrad2)" rx="2" />
          <rect x="1120" y="250" width="45" height="210" fill="url(#bldgGrad2)" rx="2" />
        </g>

        {/* Smog layer 1 — back, slow drift */}
        <motion.ellipse
          cx="600"
          cy="380"
          rx="700"
          ry="120"
          fill="url(#smogGrad2)"
          initial={{ x: 0 }}
          animate={{ x: [-50, 50, -50] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Foreground buildings — India Gate silhouette */}
        <g opacity="0.7">
          {/* Left buildings */}
          <rect x="120" y="320" width="50" height="180" fill="url(#bldgGrad)" rx="2" />
          <rect x="180" y="280" width="65" height="220" fill="url(#bldgGrad)" rx="3" />
          {/* India Gate-inspired arch structure */}
          <g transform="translate(450, 240)">
            <rect x="0" y="60" width="120" height="200" fill="url(#bldgGrad)" rx="2" />
            <path d="M 10 260 L 10 140 Q 60 80 110 140 L 110 260 Z" fill="#1e293b" opacity="0.9" />
            <rect x="50" y="20" width="20" height="50" fill="url(#bldgGrad)" rx="1" />
            <rect x="45" y="15" width="30" height="8" fill="#1e293b" rx="1" />
          </g>
          {/* Right buildings */}
          <rect x="620" y="300" width="55" height="200" fill="url(#bldgGrad)" rx="2" />
          <rect x="685" y="260" width="70" height="240" fill="url(#bldgGrad)" rx="3" />
          <rect x="770" y="310" width="48" height="190" fill="url(#bldgGrad)" rx="2" />
        </g>

        {/* Building windows (tiny lit dots) */}
        <g opacity="0.4">
          {[200, 210, 220, 230, 300, 310, 320, 640, 650, 700, 710, 720].map((x, i) => (
            <motion.rect
              key={i}
              x={x}
              y={300 + (i % 3) * 30}
              width="4"
              height="4"
              fill="#fde68a"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </g>

        {/* Smog layer 2 — foreground, faster drift */}
        <motion.ellipse
          cx="600"
          cy="430"
          rx="800"
          ry="100"
          fill="url(#smogGrad)"
          initial={{ x: 0 }}
          animate={{ x: [80, -80, 80] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Ground */}
        <rect x="0" y="480" width="1200" height="120" fill="#94a3b8" opacity="0.2" />
        <rect x="0" y="495" width="1200" height="4" fill="#64748b" opacity="0.3" />

        {/* Animated wind particles — moving from left to right (NW wind) */}
        {Array.from({ length: 15 }).map((_, i) => {
          const y = 80 + (i * 28) % 300;
          const duration = 6 + (i % 4) * 2;
          const delay = (i * 0.7) % 5;
          return (
            <motion.g
              key={`wind-${i}`}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 1300, opacity: [0, 0.4, 0.4, 0] }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <line
                x1="0"
                y1={y}
                x2="40"
                y2={y - 3}
                stroke="#93c5fd"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
              <line
                x1="10"
                y1={y + 2}
                x2="30"
                y2={y}
                stroke="#93c5fd"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.4"
              />
            </motion.g>
          );
        })}

        {/* Floating PM2.5 particles */}
        {Array.from({ length: 20 }).map((_, i) => {
          const cx = (i * 67) % 1200;
          const cy = 200 + (i * 43) % 250;
          return (
            <motion.circle
              key={`pm-${i}`}
              cx={cx}
              cy={cy}
              r={1.5 + (i % 3)}
              fill="#94a3b8"
              opacity="0.3"
              initial={{ y: 0, opacity: 0.2 }}
              animate={{ y: [-15, 15, -15], opacity: [0.15, 0.4, 0.15] }}
              transition={{
                duration: 4 + (i % 5),
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}

        {/* Citizen silhouettes — masked figures */}
        <g transform="translate(0, 0)">
          {/* Person 1 */}
          <motion.g
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: [0, 250], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <circle cx="100" cy="485" r="8" fill="#334155" />
            {/* Mask */}
            <rect x="96" y="486" width="8" height="4" fill="#ef4444" rx="1" />
            <rect x="90" y="493" width="18" height="35" rx="6" fill="#334155" />
            <rect x="85" y="500" width="6" height="20" rx="3" fill="#334155" />
            <rect x="107" y="500" width="6" height="20" rx="3" fill="#334155" />
          </motion.g>

          {/* Person 2 */}
          <motion.g
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: [0, 400], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear', delay: 5 }}
          >
            <circle cx="200" cy="488" r="7" fill="#475569" />
            <rect x="197" y="489" width="6" height="3" fill="#3b82f6" rx="1" />
            <rect x="192" y="495" width="16" height="32" rx="5" fill="#475569" />
            <rect x="188" y="501" width="5" height="18" rx="2.5" fill="#475569" />
            <rect x="207" y="501" width="5" height="18" rx="2.5" fill="#475569" />
          </motion.g>

          {/* Person 3 — cyclist */}
          <motion.g
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: [0, 600], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear', delay: 10 }}
          >
            <circle cx="950" cy="490" r="6" fill="#334155" />
            <rect x="947" y="491" width="6" height="3" fill="#f59e0b" rx="1" />
            <rect x="943" y="496" width="14" height="24" rx="4" fill="#334155" />
            <circle cx="940" cy="525" r="10" fill="none" stroke="#334155" strokeWidth="2" />
            <circle cx="960" cy="525" r="10" fill="none" stroke="#334155" strokeWidth="2" />
          </motion.g>
        </g>

        {/* Top smog haze overlay */}
        <rect width="1200" height="600" fill="url(#smogGrad2)" opacity="0.3" />
      </svg>
    </div>
  );
}
