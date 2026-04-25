import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { useState } from 'react';

interface Phase {
  phase: number;
  title: string;
  week: string;
  status: 'completed' | 'in-progress' | 'pending';
  color: string;
  steps: string[];
  decisions?: { question: string; yes: string; no: string }[];
  technologies?: string[];
  deliverables?: string[];
}

interface EditPhaseModalProps {
  phase: Phase;
  isOpen: boolean;
  onClose: () => void;
  onSave: (phase: Phase) => void;
}

export function EditPhaseModal({ phase, isOpen, onClose, onSave }: EditPhaseModalProps) {
  const [editedPhase, setEditedPhase] = useState<Phase>(phase);

  const addStep = () => {
    setEditedPhase({
      ...editedPhase,
      steps: [...editedPhase.steps, 'New step']
    });
  };

  const removeStep = (index: number) => {
    setEditedPhase({
      ...editedPhase,
      steps: editedPhase.steps.filter((_, i) => i !== index)
    });
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...editedPhase.steps];
    newSteps[index] = value;
    setEditedPhase({ ...editedPhase, steps: newSteps });
  };

  const addTechnology = () => {
    setEditedPhase({
      ...editedPhase,
      technologies: [...(editedPhase.technologies || []), 'New Tech']
    });
  };

  const removeTechnology = (index: number) => {
    setEditedPhase({
      ...editedPhase,
      technologies: editedPhase.technologies?.filter((_, i) => i !== index)
    });
  };

  const updateTechnology = (index: number, value: string) => {
    const newTech = [...(editedPhase.technologies || [])];
    newTech[index] = value;
    setEditedPhase({ ...editedPhase, technologies: newTech });
  };

  const addDeliverable = () => {
    setEditedPhase({
      ...editedPhase,
      deliverables: [...(editedPhase.deliverables || []), 'New deliverable']
    });
  };

  const removeDeliverable = (index: number) => {
    setEditedPhase({
      ...editedPhase,
      deliverables: editedPhase.deliverables?.filter((_, i) => i !== index)
    });
  };

  const updateDeliverable = (index: number, value: string) => {
    const newDel = [...(editedPhase.deliverables || [])];
    newDel[index] = value;
    setEditedPhase({ ...editedPhase, deliverables: newDel });
  };

  const handleSave = () => {
    onSave(editedPhase);
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
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Phase {phase.phase}</h2>
                  <p className="text-sm text-gray-600 mt-1">Customize phase details</p>
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={editedPhase.title}
                      onChange={(e) => setEditedPhase({ ...editedPhase, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Week</label>
                    <input
                      type="text"
                      value={editedPhase.week}
                      onChange={(e) => setEditedPhase({ ...editedPhase, week: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      value={editedPhase.status}
                      onChange={(e) => setEditedPhase({ ...editedPhase, status: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                    <input
                      type="color"
                      value={editedPhase.color}
                      onChange={(e) => setEditedPhase({ ...editedPhase, color: e.target.value })}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">Steps</label>
                    <button
                      onClick={addStep}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Step
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editedPhase.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => updateStep(idx, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Step ${idx + 1}`}
                        />
                        <button
                          onClick={() => removeStep(idx)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">Technologies</label>
                    <button
                      onClick={addTechnology}
                      className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Technology
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editedPhase.technologies?.map((tech, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => updateTechnology(idx, e.target.value)}
                          className="bg-transparent border-none focus:outline-none w-24"
                        />
                        <button
                          onClick={() => removeTechnology(idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">Deliverables</label>
                    <button
                      onClick={addDeliverable}
                      className="flex items-center gap-2 px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Deliverable
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editedPhase.deliverables?.map((del, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={del}
                          onChange={(e) => updateDeliverable(idx, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Deliverable ${idx + 1}`}
                        />
                        <button
                          onClick={() => removeDeliverable(idx)}
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
