import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Save, Key, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

interface TableField {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

interface TableData {
  name: string;
  color: string;
  category: string;
  fields: TableField[];
  position: { x: number; y: number };
}

interface EditTableModalProps {
  table: TableData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (table: TableData) => void;
}

export function EditTableModal({ table, isOpen, onClose, onSave }: EditTableModalProps) {
  const [editedTable, setEditedTable] = useState<TableData>(
    table || {
      name: 'new_table',
      color: '#3B82F6',
      category: 'Core',
      fields: [],
      position: { x: 500, y: 200 }
    }
  );

  const addField = () => {
    setEditedTable({
      ...editedTable,
      fields: [
        ...editedTable.fields,
        { name: 'new_field', type: 'VARCHAR(255)', isPrimaryKey: false, isForeignKey: false }
      ]
    });
  };

  const removeField = (index: number) => {
    setEditedTable({
      ...editedTable,
      fields: editedTable.fields.filter((_, i) => i !== index)
    });
  };

  const updateField = (index: number, field: Partial<TableField>) => {
    const newFields = [...editedTable.fields];
    newFields[index] = { ...newFields[index], ...field };
    setEditedTable({ ...editedTable, fields: newFields });
  };

  const handleSave = () => {
    onSave(editedTable);
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
                  <h2 className="text-2xl font-bold text-gray-900">
                    {table ? `Edit ${table.name}` : 'Create New Table'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Configure table schema and properties</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Table Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Table Name</label>
                    <input
                      type="text"
                      value={editedTable.name}
                      onChange={(e) => setEditedTable({ ...editedTable, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      placeholder="table_name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      value={editedTable.category}
                      onChange={(e) => setEditedTable({ ...editedTable, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Core">Core</option>
                      <option value="Offers">Offers</option>
                      <option value="Ingestion">Ingestion</option>
                      <option value="Analytics">Analytics</option>
                      <option value="AI Layer">AI Layer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                  <div className="flex gap-3">
                    {[
                      { name: 'Green', value: '#10B981' },
                      { name: 'Yellow', value: '#F59E0B' },
                      { name: 'Blue', value: '#3B82F6' },
                      { name: 'Red', value: '#EF4444' },
                      { name: 'Purple', value: '#7C3AED' }
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setEditedTable({ ...editedTable, color: color.value })}
                        className={`w-12 h-12 rounded-lg transition-all ${
                          editedTable.color === color.value ? 'ring-4 ring-offset-2 ring-blue-500' : ''
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                    <input
                      type="color"
                      value={editedTable.color}
                      onChange={(e) => setEditedTable({ ...editedTable, color: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                    />
                  </div>
                </div>

                {/* Fields */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-gray-700">Fields / Columns</label>
                    <button
                      onClick={addField}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Field
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {editedTable.fields.map((field, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-4">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Field Name</label>
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) => updateField(idx, { name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="field_name"
                            />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Data Type</label>
                            <select
                              value={field.type}
                              onChange={(e) => updateField(idx, { type: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="SERIAL">SERIAL</option>
                              <option value="INTEGER">INTEGER</option>
                              <option value="BIGINT">BIGINT</option>
                              <option value="VARCHAR(50)">VARCHAR(50)</option>
                              <option value="VARCHAR(100)">VARCHAR(100)</option>
                              <option value="VARCHAR(255)">VARCHAR(255)</option>
                              <option value="TEXT">TEXT</option>
                              <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
                              <option value="BOOLEAN">BOOLEAN</option>
                              <option value="TIMESTAMP">TIMESTAMP</option>
                              <option value="DATE">DATE</option>
                              <option value="JSON">JSON</option>
                            </select>
                          </div>
                          <div className="col-span-4 flex items-end gap-2">
                            <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-amber-50 transition-colors">
                              <input
                                type="checkbox"
                                checked={field.isPrimaryKey}
                                onChange={(e) => updateField(idx, { isPrimaryKey: e.target.checked })}
                                className="rounded text-amber-500 focus:ring-2 focus:ring-amber-500"
                              />
                              <Key className="w-4 h-4 text-amber-500" />
                              <span className="text-xs font-medium">PK</span>
                            </label>
                            <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                              <input
                                type="checkbox"
                                checked={field.isForeignKey}
                                onChange={(e) => updateField(idx, { isForeignKey: e.target.checked })}
                                className="rounded text-blue-500 focus:ring-2 focus:ring-blue-500"
                              />
                              <LinkIcon className="w-4 h-4 text-blue-500" />
                              <span className="text-xs font-medium">FK</span>
                            </label>
                          </div>
                          <div className="col-span-1 flex items-end">
                            <button
                              onClick={() => removeField(idx)}
                              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Save className="w-5 h-5" />
                  Save Table
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
