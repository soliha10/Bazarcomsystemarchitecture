import { motion } from 'motion/react';
import { useState } from 'react';
import { ArrowRight, Circle, Diamond, ChevronRight, Info } from 'lucide-react';

interface FlowNode {
  id: string;
  label: string;
  type: 'start' | 'process' | 'decision' | 'end';
  description?: string;
  color: string;
}

interface FlowConnection {
  from: string;
  to: string;
  label?: string;
}

interface InteractiveFlowChartProps {
  title: string;
  nodes: FlowNode[];
  connections: FlowConnection[];
  layer: string;
}

export function InteractiveFlowChart({ title, nodes, connections, layer }: InteractiveFlowChartProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getNodeComponent = (node: FlowNode) => {
    const isSelected = selectedNode === node.id;
    const isHovered = hoveredNode === node.id;

    const nodeProps = {
      onMouseEnter: () => setHoveredNode(node.id),
      onMouseLeave: () => setHoveredNode(null),
      onClick: () => setSelectedNode(isSelected ? null : node.id),
      className: 'cursor-pointer'
    };

    if (node.type === 'start' || node.type === 'end') {
      return (
        <motion.div
          {...nodeProps}
          className="relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-20 h-12 rounded-full flex items-center justify-center shadow-lg border-2"
            style={{
              backgroundColor: isSelected ? node.color : `${node.color}30`,
              borderColor: node.color
            }}
            animate={{
              boxShadow: isHovered ? `0 0 20px ${node.color}` : '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <span className="text-xs font-bold text-gray-900">{node.label}</span>
          </motion.div>
          {isSelected && node.description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-2 bg-white rounded-lg shadow-xl p-3 text-xs z-20 w-48 border-2"
              style={{ borderColor: node.color }}
            >
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: node.color }} />
                <p className="text-gray-700">{node.description}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      );
    }

    if (node.type === 'decision') {
      return (
        <motion.div
          {...nodeProps}
          className="relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-20 h-20 flex items-center justify-center"
            animate={{
              filter: isHovered ? `drop-shadow(0 0 10px ${node.color})` : 'none'
            }}
          >
            <Diamond
              className="w-20 h-20"
              style={{
                color: node.color,
                fill: isSelected ? node.color : `${node.color}30`,
                strokeWidth: 2
              }}
            />
            <span className="absolute text-[10px] font-bold text-center px-1">{node.label}</span>
          </motion.div>
          {isSelected && node.description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-2 bg-white rounded-lg shadow-xl p-3 text-xs z-20 w-48 border-2"
              style={{ borderColor: node.color }}
            >
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: node.color }} />
                <p className="text-gray-700">{node.description}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      );
    }

    return (
      <motion.div
        {...nodeProps}
        className="relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="px-4 py-3 rounded-lg shadow-lg border-2 min-w-[100px] text-center"
          style={{
            borderColor: node.color,
            backgroundColor: isSelected ? `${node.color}50` : `${node.color}20`
          }}
          animate={{
            boxShadow: isHovered ? `0 0 20px ${node.color}` : '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          <span className="text-xs font-semibold text-gray-900">{node.label}</span>
        </motion.div>
        {isSelected && node.description && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-2 bg-white rounded-lg shadow-xl p-3 text-xs z-20 w-56 border-2"
            style={{ borderColor: node.color }}
          >
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: node.color }} />
              <p className="text-gray-700">{node.description}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Circle className="w-2 h-2 text-blue-500 fill-current animate-pulse" />
          <h3 className="font-bold text-gray-900">{title}</h3>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {layer}
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4">
        {nodes.map((node, idx) => (
          <div key={node.id} className="flex items-center gap-3 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.15 }}
            >
              {getNodeComponent(node)}
            </motion.div>

            {idx < nodes.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.15 + 0.1 }}
                className="flex items-center gap-1"
              >
                <ArrowRight className="w-5 h-5 text-gray-400" />
                {connections[idx]?.label && (
                  <span className="text-xs text-gray-500 font-medium">{connections[idx].label}</span>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <ChevronRight className="w-3 h-3" />
          Click on any node to see detailed information
        </p>
      </div>
    </div>
  );
}
