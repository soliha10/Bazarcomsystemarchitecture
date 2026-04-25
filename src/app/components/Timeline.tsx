import { motion } from 'motion/react';

interface TimelineProps {
  weeks: {
    week: number;
    title: string;
    description: string;
    color: string;
  }[];
}

export function Timeline({ weeks }: TimelineProps) {
  return (
    <div className="relative">
      <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200" />

      <div className="grid grid-cols-6 gap-4 relative">
        {weeks.map((week, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center font-bold text-white mb-3 z-10"
              style={{ backgroundColor: week.color }}
            >
              {week.week}
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-sm text-gray-900 mb-1">{week.title}</h4>
              <p className="text-xs text-gray-600">{week.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
