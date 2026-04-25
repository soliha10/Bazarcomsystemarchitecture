import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, AlertCircle, ChevronDown, Play, Database, Code, Edit2 } from 'lucide-react';
import { useState } from 'react';

interface PhaseCardProps {
  phase: number;
  title: string;
  week: string;
  status: 'completed' | 'in-progress' | 'pending';
  color: string;
  steps: string[];
  decisions?: { question: string; yes: string; no: string }[];
  technologies?: string[];
  deliverables?: string[];
  delay?: number;
  isActive?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
}

export function PhaseCard({
  phase,
  title,
  week,
  status,
  color,
  steps,
  decisions,
  technologies,
  deliverables,
  delay = 0,
  isActive = false,
  onClick,
  onEdit
}: PhaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusIcons = {
    completed: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    'in-progress': <Circle className="w-5 h-5 text-blue-500 animate-pulse" />,
    pending: <Circle className="w-5 h-5 text-gray-300" />
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    pending: 'bg-gray-100 text-gray-500'
  };

  const statusText = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    pending: 'Pending'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border-2 cursor-pointer ${
        isActive ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-100'
      }`}
      onClick={() => {
        setIsExpanded(!isExpanded);
        onClick?.();
      }}
    >
      <div className="relative overflow-hidden" style={{ borderTop: `4px solid ${color}` }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 100%)` }} />

        <div className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
                  style={{ backgroundColor: color }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {phase}
                </motion.div>
                {statusIcons[status]}
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[status]}`}>
                  {statusText[status]}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{week}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <Edit2 className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </button>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-6 h-6 text-gray-400" />
              </motion.div>
            </div>
          </div>

          {/* Compact Steps Preview */}
          <div className="space-y-2 mb-3">
            {steps.slice(0, isExpanded ? steps.length : 3).map((step, idx) => (
              <motion.div
                key={idx}
                className="flex items-start gap-3 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + idx * 0.05 }}
              >
                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-gray-700">{step}</span>
              </motion.div>
            ))}
          </div>

          {!isExpanded && steps.length > 3 && (
            <p className="text-xs text-gray-500 italic">+{steps.length - 3} more steps...</p>
          )}

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Decisions */}
                {decisions && decisions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Decision Points
                    </h4>
                    {decisions.map((decision, idx) => (
                      <motion.div
                        key={idx}
                        className="bg-amber-50 rounded-lg p-3 mb-2 border border-amber-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <div className="flex items-start gap-2">
                          <div className="text-xs">
                            <p className="font-semibold text-amber-900 mb-2">{decision.question}</p>
                            <div className="space-y-1">
                              <p className="flex items-center gap-1 text-green-700">
                                <span className="font-bold">✓ Yes</span> → {decision.yes}
                              </p>
                              <p className="flex items-center gap-1 text-red-700">
                                <span className="font-bold">✗ No</span> → {decision.no}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Technologies */}
                {technologies && technologies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4" style={{ color }} />
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech, idx) => (
                        <motion.span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                          style={{ backgroundColor: color }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 * idx }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deliverables */}
                {deliverables && deliverables.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Database className="w-4 h-4" style={{ color }} />
                      Deliverables
                    </h4>
                    <ul className="space-y-2">
                      {deliverables.map((item, idx) => (
                        <motion.li
                          key={idx}
                          className="text-xs text-gray-700 flex items-center gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * idx }}
                        >
                          <Play className="w-3 h-3 flex-shrink-0" style={{ color }} />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Progress Bar */}
        {status === 'in-progress' && (
          <div className="h-1 bg-gray-200">
            <motion.div
              className="h-full"
              style={{ backgroundColor: color }}
              initial={{ width: '0%' }}
              animate={{ width: '60%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
