import { motion, AnimatePresence } from 'motion/react';
import { Key, Database, Link, Edit2, Plus, Trash2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { EditTableModal } from './EditTableModal';

interface TableField {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

interface Table {
  name: string;
  color: string;
  category: string;
  fields: TableField[];
  position: { x: number; y: number };
}

interface Relationship {
  from: string;
  to: string;
  type: '1:1' | '1:N';
  fromField: string;
  toField: string;
}

export function ERDiagram() {
  const [zoom, setZoom] = useState(1);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [tables, setTables] = useState<Table[]>([
    {
      name: 'products',
      color: '#10B981',
      category: 'Core',
      position: { x: 600, y: 150 },
      fields: [
        { name: 'id', type: 'SERIAL', isPrimaryKey: true },
        { name: 'name', type: 'VARCHAR(500)' },
        { name: 'brand', type: 'VARCHAR(100)' },
        { name: 'model', type: 'VARCHAR(100)' },
        { name: 'category', type: 'VARCHAR(100)' },
        { name: 'match_key', type: 'VARCHAR(200)' },
        { name: 'created_at', type: 'TIMESTAMP' },
        { name: 'updated_at', type: 'TIMESTAMP' }
      ]
    },
    {
      name: 'offers',
      color: '#F59E0B',
      category: 'Offers',
      position: { x: 600, y: 500 },
      fields: [
        { name: 'id', type: 'SERIAL', isPrimaryKey: true },
        { name: 'product_id', type: 'INTEGER', isForeignKey: true },
        { name: 'store_id', type: 'INTEGER', isForeignKey: true },
        { name: 'price', type: 'DECIMAL(10,2)' },
        { name: 'currency', type: 'VARCHAR(3)' },
        { name: 'url', type: 'TEXT' },
        { name: 'in_stock', type: 'BOOLEAN' },
        { name: 'scraped_at', type: 'TIMESTAMP' }
      ]
    },
    {
      name: 'stores',
      color: '#3B82F6',
      category: 'Ingestion',
      position: { x: 150, y: 150 },
      fields: [
        { name: 'id', type: 'SERIAL', isPrimaryKey: true },
        { name: 'name', type: 'VARCHAR(100)' },
        { name: 'domain', type: 'VARCHAR(200)' },
        { name: 'country', type: 'VARCHAR(50)' },
        { name: 'logo_url', type: 'TEXT' },
        { name: 'is_active', type: 'BOOLEAN' }
      ]
    },
    {
      name: 'raw_products',
      color: '#3B82F6',
      category: 'Ingestion',
      position: { x: 150, y: 500 },
      fields: [
        { name: 'id', type: 'SERIAL', isPrimaryKey: true },
        { name: 'store_id', type: 'INTEGER', isForeignKey: true },
        { name: 'raw_title', type: 'TEXT' },
        { name: 'raw_price', type: 'TEXT' },
        { name: 'raw_html', type: 'TEXT' },
        { name: 'scraped_at', type: 'TIMESTAMP' },
        { name: 'processed', type: 'BOOLEAN' }
      ]
    },
    {
      name: 'product_metrics',
      color: '#EF4444',
      category: 'Analytics',
      position: { x: 1050, y: 150 },
      fields: [
        { name: 'id', type: 'SERIAL', isPrimaryKey: true },
        { name: 'product_id', type: 'INTEGER', isForeignKey: true },
        { name: 'min_price', type: 'DECIMAL(10,2)' },
        { name: 'max_price', type: 'DECIMAL(10,2)' },
        { name: 'avg_price', type: 'DECIMAL(10,2)' },
        { name: 'avg_rating', type: 'DECIMAL(3,2)' },
        { name: 'total_reviews', type: 'INTEGER' },
        { name: 'offer_count', type: 'INTEGER' }
      ]
    },
    {
      name: 'price_history',
      color: '#EF4444',
      category: 'Analytics',
      position: { x: 1050, y: 500 },
      fields: [
        { name: 'id', type: 'SERIAL', isPrimaryKey: true },
        { name: 'offer_id', type: 'INTEGER', isForeignKey: true },
        { name: 'price', type: 'DECIMAL(10,2)' },
        { name: 'recorded_at', type: 'TIMESTAMP' }
      ]
    },
    {
      name: 'reviews',
      color: '#7C3AED',
      category: 'AI Layer',
      position: { x: 1500, y: 150 },
      fields: [
        { name: 'id', type: 'SERIAL', isPrimaryKey: true },
        { name: 'product_id', type: 'INTEGER', isForeignKey: true },
        { name: 'rating', type: 'INTEGER' },
        { name: 'review_text', type: 'TEXT' },
        { name: 'sentiment', type: 'VARCHAR(20)' },
        { name: 'source', type: 'VARCHAR(100)' },
        { name: 'created_at', type: 'TIMESTAMP' }
      ]
    },
    {
      name: 'ml_models',
      color: '#7C3AED',
      category: 'AI Layer',
      position: { x: 1500, y: 500 },
      fields: [
        { name: 'id', type: 'SERIAL', isPrimaryKey: true },
        { name: 'model_name', type: 'VARCHAR(100)' },
        { name: 'version', type: 'VARCHAR(50)' },
        { name: 'accuracy', type: 'DECIMAL(5,4)' },
        { name: 'mlflow_run_id', type: 'VARCHAR(100)' },
        { name: 'deployed', type: 'BOOLEAN' },
        { name: 'created_at', type: 'TIMESTAMP' }
      ]
    }
  ]);

  const handleTableUpdate = (updatedTable: Table) => {
    setTables(tables.map(t => t.name === editingTable?.name ? updatedTable : t));
  };

  const handleTableCreate = (newTable: Table) => {
    setTables([...tables, newTable]);
  };

  const handleTableDelete = (tableName: string) => {
    if (confirm(`Are you sure you want to delete table "${tableName}"?`)) {
      setTables(tables.filter(t => t.name !== tableName));
    }
  };

  const handleTableDrag = (tableName: string, newX: number, newY: number) => {
    setTables(tables.map(t =>
      t.name === tableName
        ? { ...t, position: { x: newX, y: newY } }
        : t
    ));
  };

  const relationships: Relationship[] = [
    { from: 'products', to: 'offers', type: '1:N', fromField: 'id', toField: 'product_id' },
    { from: 'stores', to: 'offers', type: '1:N', fromField: 'id', toField: 'store_id' },
    { from: 'stores', to: 'raw_products', type: '1:N', fromField: 'id', toField: 'store_id' },
    { from: 'products', to: 'product_metrics', type: '1:1', fromField: 'id', toField: 'product_id' },
    { from: 'offers', to: 'price_history', type: '1:N', fromField: 'id', toField: 'offer_id' },
    { from: 'products', to: 'reviews', type: '1:N', fromField: 'id', toField: 'product_id' }
  ];

  const drawRelationship = (rel: Relationship) => {
    const fromTable = tables.find(t => t.name === rel.from);
    const toTable = tables.find(t => t.name === rel.to);
    if (!fromTable || !toTable) return null;

    const fromX = fromTable.position.x + 320;
    const fromY = fromTable.position.y + 60;
    const toX = toTable.position.x;
    const toY = toTable.position.y + 60;

    const midX = (fromX + toX) / 2;

    const path = `M ${fromX} ${fromY} C ${fromX + 50} ${fromY}, ${toX - 50} ${toY}, ${toX} ${toY}`;

    return (
      <g key={`${rel.from}-${rel.to}`}>
        <defs>
          <marker
            id={`arrow-${rel.from}-${rel.to}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#64748B" />
          </marker>
        </defs>
        <path
          d={path}
          stroke="#64748B"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray={rel.type === '1:1' ? '8,4' : '0'}
          markerEnd={`url(#arrow-${rel.from}-${rel.to})`}
          opacity="0.7"
        />
        <rect
          x={midX - 25}
          y={fromY - 20}
          width="50"
          height="20"
          fill="white"
          stroke="#64748B"
          strokeWidth="1.5"
          rx="4"
        />
        <text
          x={midX}
          y={fromY - 6}
          fontSize="12"
          fill="#1E293B"
          fontWeight="700"
          textAnchor="middle"
        >
          {rel.type}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-2xl p-8 border border-gray-200">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Database Schema</h2>
          </div>
          <p className="text-gray-600">
            Entity-Relationship Diagram • PostgreSQL Architecture
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreatingTable(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5" />
            Add Table
          </button>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-xl p-1.5 shadow-md border border-gray-200">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4 text-gray-700" />
            </button>
            <span className="text-sm font-bold text-gray-800 min-w-[65px] text-center px-2">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4 text-gray-700" />
            </button>
          </div>
          <button
            onClick={() => setZoom(1)}
            className="p-2.5 bg-white/80 backdrop-blur hover:bg-white rounded-xl transition-colors shadow-md border border-gray-200"
            title="Reset Zoom"
          >
            <Maximize2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { category: 'Core Tables', color: '#10B981', icon: '🎯' },
          { category: 'Offers', color: '#F59E0B', icon: '💰' },
          { category: 'Data Ingestion', color: '#3B82F6', icon: '📥' },
          { category: 'Analytics', color: '#EF4444', icon: '📊' },
          { category: 'AI/ML Layer', color: '#7C3AED', icon: '🤖' }
        ].map((item) => (
          <div
            key={item.category}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-200"
          >
            <span className="text-lg">{item.icon}</span>
            <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: item.color }} />
            <span className="text-sm font-semibold text-gray-800">{item.category}</span>
          </div>
        ))}
      </div>

      {/* ER Diagram */}
      <div className="relative bg-white rounded-xl border-2 border-gray-200 overflow-auto shadow-inner" style={{ height: '800px' }}>
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            transition: 'transform 0.2s ease-out',
            minWidth: '2000px',
            minHeight: '900px',
            background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(124, 58, 237, 0.03) 0%, transparent 50%)'
          }}
        >
          <svg width="2000" height="900" className="w-full h-full">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
            </filter>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Relationships */}
          {relationships.map(drawRelationship)}

          {/* Grid Pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="2400" height="1500" fill="url(#grid)" opacity="0.5" />

          {/* Tables */}
          {tables.map((table, idx) => {
            const isHovered = hoveredTable === table.name;
            const isDragging = draggingTable === table.name;
            return (
              <motion.g
                key={table.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: isHovered && !isDragging ? 1.02 : 1,
                  x: table.position.x,
                  y: table.position.y
                }}
                drag
                dragMomentum={false}
                dragElastic={0}
                whileDrag={{ cursor: 'grabbing', scale: 1.05, opacity: 0.9 }}
                onDragStart={() => setDraggingTable(table.name)}
                onDragEnd={(event, info) => {
                  const newX = table.position.x + info.offset.x / zoom;
                  const newY = table.position.y + info.offset.y / zoom;
                  handleTableDrag(table.name, Math.max(0, newX), Math.max(0, newY));
                  setDraggingTable(null);
                }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => !isDragging && setHoveredTable(table.name)}
                onMouseLeave={() => setHoveredTable(null)}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                {/* Table Shadow/Background */}
                <rect
                  x="-4"
                  y="-4"
                  width="328"
                  height={60 + table.fields.length * 32 + 8}
                  fill={table.color}
                  opacity="0.08"
                  rx="16"
                />

                {/* Table Container */}
                <rect
                  x="0"
                  y="0"
                  width="320"
                  height={60 + table.fields.length * 32}
                  fill="white"
                  stroke={table.color}
                  strokeWidth="2"
                  rx="12"
                  filter="url(#tableShadow)"
                />

                {/* Table Header with Gradient */}
                <defs>
                  <linearGradient id={`grad-${table.name}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: table.color, stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: table.color, stopOpacity: 0.85 }} />
                  </linearGradient>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="320"
                  height="60"
                  fill={`url(#grad-${table.name})`}
                  rx="12"
                />

                {/* Icon */}
                <circle
                  cx="28"
                  cy="30"
                  r="16"
                  fill="rgba(255,255,255,0.25)"
                />
                <Database
                  x="20"
                  y="22"
                  width="16"
                  height="16"
                  stroke="white"
                  fill="none"
                  strokeWidth="2.5"
                />

                {/* Table Name */}
                <text
                  x="52"
                  y="28"
                  fontSize="18"
                  fontWeight="700"
                  fill="white"
                  letterSpacing="0.5"
                >
                  {table.name}
                </text>

                {/* Category Badge */}
                <rect
                  x="52"
                  y="38"
                  width={table.category.length * 7 + 12}
                  height="16"
                  fill="rgba(255,255,255,0.25)"
                  rx="8"
                />
                <text
                  x="58"
                  y="48"
                  fontSize="10"
                  fontWeight="600"
                  fill="white"
                >
                  {table.category}
                </text>

                {/* Action Buttons */}
                <g className="edit-button" opacity={isHovered ? 1 : 0.7}>
                  <rect
                    x="244"
                    y="18"
                    width="28"
                    height="28"
                    fill="rgba(255,255,255,0.25)"
                    rx="8"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTable(table);
                    }}
                  />
                  <Edit2
                    x="250"
                    y="24"
                    width="16"
                    height="16"
                    stroke="white"
                    fill="none"
                    strokeWidth="2.5"
                    style={{ cursor: 'pointer', pointerEvents: 'none' }}
                  />
                </g>

                <g className="delete-button" opacity={isHovered ? 1 : 0.7}>
                  <rect
                    x="280"
                    y="18"
                    width="28"
                    height="28"
                    fill="rgba(255,255,255,0.25)"
                    rx="8"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTableDelete(table.name);
                    }}
                  />
                  <Trash2
                    x="286"
                    y="24"
                    width="16"
                    height="16"
                    stroke="white"
                    fill="none"
                    strokeWidth="2.5"
                    style={{ cursor: 'pointer', pointerEvents: 'none' }}
                  />
                </g>

                {/* Fields */}
                {table.fields.map((field, fieldIdx) => (
                  <g key={field.name}>
                    <rect
                      x="0"
                      y={60 + fieldIdx * 32}
                      width="320"
                      height="32"
                      fill={fieldIdx % 2 === 0 ? '#FAFAFA' : 'white'}
                    />

                    {/* Field Icons */}
                    {field.isPrimaryKey && (
                      <>
                        <circle
                          cx="18"
                          cy={76 + fieldIdx * 32}
                          r="10"
                          fill="#FEF3C7"
                        />
                        <Key
                          x="13"
                          y={71 + fieldIdx * 32}
                          width="10"
                          height="10"
                          stroke="#F59E0B"
                          fill="#F59E0B"
                        />
                      </>
                    )}

                    {field.isForeignKey && (
                      <>
                        <circle
                          cx="18"
                          cy={76 + fieldIdx * 32}
                          r="10"
                          fill="#DBEAFE"
                        />
                        <Link
                          x="13"
                          y={71 + fieldIdx * 32}
                          width="10"
                          height="10"
                          stroke="#3B82F6"
                          fill="none"
                          strokeWidth="2"
                        />
                      </>
                    )}

                    {/* Field Name */}
                    <text
                      x={field.isPrimaryKey || field.isForeignKey ? 34 : 16}
                      y={80 + fieldIdx * 32}
                      fontSize="13"
                      fill="#1E293B"
                      fontWeight={field.isPrimaryKey || field.isForeignKey ? '700' : '500'}
                      fontFamily="monospace"
                    >
                      {field.name}
                    </text>

                    {/* Field Type */}
                    <text
                      x="304"
                      y={80 + fieldIdx * 32}
                      fontSize="11"
                      fill="#64748B"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {field.type}
                    </text>
                  </g>
                ))}
              </motion.g>
            );
          })}
          </svg>
        </div>
      </div>

      {/* Legend for Keys */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-2 bg-amber-50 rounded-lg">
            <Key className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Primary Key</p>
            <p className="text-sm text-gray-900 font-bold">Unique ID</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Link className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Foreign Key</p>
            <p className="text-sm text-gray-900 font-bold">Reference</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-2 bg-green-50 rounded-lg">
            <span className="text-lg font-bold text-green-600">1:N</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Relationship</p>
            <p className="text-sm text-gray-900 font-bold">One-to-Many</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-2 bg-purple-50 rounded-lg">
            <span className="text-lg font-bold text-purple-600">1:1</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Relationship</p>
            <p className="text-sm text-gray-900 font-bold">One-to-One</p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTable && (
        <EditTableModal
          table={editingTable}
          isOpen={!!editingTable}
          onClose={() => setEditingTable(null)}
          onSave={handleTableUpdate}
        />
      )}

      {/* Create Modal */}
      {isCreatingTable && (
        <EditTableModal
          table={null}
          isOpen={isCreatingTable}
          onClose={() => setIsCreatingTable(false)}
          onSave={(newTable) => {
            handleTableCreate(newTable);
            setIsCreatingTable(false);
          }}
        />
      )}
    </div>
  );
}
