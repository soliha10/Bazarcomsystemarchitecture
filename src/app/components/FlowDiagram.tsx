import { motion } from 'motion/react';
import { ArrowRight, Diamond } from 'lucide-react';

interface FlowStep {
  label: string;
  type: 'process' | 'decision';
  color: string;
}

interface FlowDiagramProps {
  title: string;
  steps: FlowStep[];
  layer: string;
}

export function FlowDiagram({ title, steps, layer }: FlowDiagramProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-1 w-12 rounded" style={{ backgroundColor: steps[0]?.color || '#3B82F6' }} />
        <h3 className="font-bold text-gray-900">{title}</h3>
        <span className="ml-auto text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {layer}
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="relative"
            >
              {step.type === 'decision' ? (
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <Diamond className="w-24 h-24" style={{ color: step.color, fill: `${step.color}30` }} />
                  <span className="absolute text-xs font-semibold text-center px-2" style={{ color: step.color }}>
                    {step.label}
                  </span>
                </div>
              ) : (
                <div
                  className="px-4 py-3 rounded-lg shadow-sm border-2 min-w-[120px] text-center"
                  style={{ borderColor: step.color, backgroundColor: `${step.color}15` }}
                >
                  <span className="text-xs font-semibold text-gray-900">{step.label}</span>
                </div>
              )}
            </motion.div>

            {idx < steps.length - 1 && (
              <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
