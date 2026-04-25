import { motion, AnimatePresence } from 'motion/react';
import { Database, Cpu, Server, Users, ChevronRight, Zap, Shield, Gauge, Edit2 } from 'lucide-react';
import { useState } from 'react';

interface ArchitectureLayerProps {
  name: string;
  icon: 'database' | 'cpu' | 'server' | 'users';
  color: string;
  components: string[];
  description?: string;
  metrics?: { label: string; value: string }[];
  delay?: number;
  onEdit?: () => void;
}

const icons = {
  database: Database,
  cpu: Cpu,
  server: Server,
  users: Users
};

export function ArchitectureLayer({
  name,
  icon,
  color,
  components,
  description,
  metrics,
  delay = 0,
  onEdit
}: ArchitectureLayerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null);
  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-gray-100 cursor-pointer"
    >
      <motion.div
        className="p-4 relative overflow-hidden"
        style={{ backgroundColor: `${color}20`, borderLeft: `6px solid ${color}` }}
        animate={{ backgroundColor: isHovered ? `${color}30` : `${color}20` }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{ background: `radial-gradient(circle at 50% 50%, ${color}, transparent)` }}
          animate={{ scale: isHovered ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        />

        <div className="flex items-center gap-3 relative z-10">
          <motion.div
            className="p-2 rounded-lg bg-white shadow-sm"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </motion.div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{name}</h3>
            {description && (
              <p className="text-xs text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="p-1.5 hover:bg-white rounded-lg transition-colors group"
            >
              <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
            </button>
            <motion.div
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>
        </div>

        {/* Metrics */}
        {metrics && (
          <motion.div
            className="mt-3 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {metrics.map((metric, idx) => (
              <div key={idx} className="bg-white rounded px-2 py-1 text-xs">
                <span className="text-gray-600">{metric.label}:</span>
                <span className="font-bold ml-1" style={{ color }}>{metric.value}</span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <div className="p-4 space-y-2">
        {components.map((component, idx) => {
          const isSelected = selectedComponent === idx;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.1 * idx }}
              whileHover={{ x: 5, scale: 1.02 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedComponent(isSelected ? null : idx);
              }}
              className={`flex items-center gap-2 text-sm text-gray-700 rounded-lg p-3 transition-all cursor-pointer ${
                isSelected ? 'bg-blue-50 border-2 border-blue-300 shadow-md' : 'bg-gray-50 border-2 border-transparent'
              }`}
            >
              <motion.div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
                animate={{ scale: isSelected ? 1.5 : 1 }}
              />
              <span className="flex-1">{component}</span>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="flex gap-1"
                  >
                    <Zap className="w-3 h-3 text-yellow-600" />
                    <Shield className="w-3 h-3 text-green-600" />
                    <Gauge className="w-3 h-3 text-blue-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Active indicator */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            className="h-1"
            style={{ backgroundColor: color, transformOrigin: 'left' }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
