import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { useState } from 'react';

interface ArchitectureLayer {
  name: string;
  icon: 'database' | 'cpu' | 'server' | 'users';
  color: string;
  description?: string;
  components: string[];
  metrics?: { label: string; value: string }[];
}

interface EditArchitectureModalProps {
  layer: ArchitectureLayer;
  isOpen: boolean;
  onClose: () => void;
  onSave: (layer: ArchitectureLayer) => void;
}

export function EditArchitectureModal({ layer, isOpen, onClose, onSave }: EditArchitectureModalProps) {
  const [editedLayer, setEditedLayer] = useState<ArchitectureLayer>(layer);

  const addComponent = () => {
    setEditedLayer({
      ...editedLayer,
      components: [...editedLayer.components, 'New Component']
    });
  };

  const removeComponent = (index: number) => {
    setEditedLayer({
      ...editedLayer,
      components: editedLayer.components.filter((_, i) => i !== index)
    });
  };

  const updateComponent = (index: number, value: string) => {
    const newComponents = [...editedLayer.components];
    newComponents[index] = value;
    setEditedLayer({ ...editedLayer, components: newComponents });
  };

  const addMetric = () => {
    setEditedLayer({
      ...editedLayer,
      metrics: [...(editedLayer.metrics || []), { label: 'New Metric', value: '0' }]
    });
  };

  const removeMetric = (index: number) => {
    setEditedLayer({
      ...editedLayer,
      metrics: editedLayer.metrics?.filter((_, i) => i !== index)
    });
  };

  const updateMetric = (index: number, field: 'label' | 'value', value: string) => {
    const newMetrics = [...(editedLayer.metrics || [])];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setEditedLayer({ ...editedLayer, metrics: newMetrics });
  };

  const handleSave = () => {
    onSave(editedLayer);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit {layer.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">Customize architecture layer</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Layer Name</label>
                    <input
                      type="text"
                      value={editedLayer.name}
                      onChange={(e) => setEditedLayer({ ...editedLayer, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Icon</label>
                    <select
                      value={editedLayer.icon}
                      onChange={(e) => setEditedLayer({ ...editedLayer, icon: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="database">Database</option>
                      <option value="cpu">CPU/Processing</option>
                      <option value="server">Server</option>
                      <option value="users">Users</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                    <input
                      type="color"
                      value={editedLayer.color}
                      onChange={(e) => setEditedLayer({ ...editedLayer, color: e.target.value })}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editedLayer.description || ''}
                    onChange={(e) => setEditedLayer({ ...editedLayer, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Brief description of this layer..."
                  />
                </div>

                {/* Components */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">Components / Technologies</label>
                    <button
                      onClick={addComponent}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Component
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editedLayer.components.map((component, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={component}
                          onChange={(e) => updateComponent(idx, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Component ${idx + 1}`}
                        />
                        <button
                          onClick={() => removeComponent(idx)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">Performance Metrics</label>
                    <button
                      onClick={addMetric}
                      className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Metric
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editedLayer.metrics?.map((metric, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) => updateMetric(idx, 'label', e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Metric name"
                        />
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(e) => updateMetric(idx, 'value', e.target.value)}
                          className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Value"
                        />
                        <button
                          onClick={() => removeMetric(idx)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
