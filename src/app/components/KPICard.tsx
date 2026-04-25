import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  target: string;
  color: string;
  delay?: number;
}

export function KPICard({ icon: Icon, label, value, target, color, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <h4 className="font-semibold text-gray-900 text-sm">{label}</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-xs text-gray-500">Target: {target}</p>
        </div>
      </div>
    </motion.div>
  );
}
