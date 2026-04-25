import { motion } from 'motion/react';
import { Key, Database, Link, Edit2, Plus, Trash2, Move, ZoomIn, ZoomOut } from 'lucide-react';
import { useState, useRef } from 'react';
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
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tables, setTables] = useState<Table[]>([
    {
      name: 'products',
      color: '#10B981',
      category: 'Core',
      position: { x: 500, y: 200 },
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
      position: { x: 500, y: 480 },
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
      position: { x: 120, y: 200 },
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
      position: { x: 120, y: 480 },
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
      position: { x: 880, y: 200 },
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
      position: { x: 880, y: 480 },
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
      position: { x: 1200, y: 200 },
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
      position: { x: 1200, y: 480 },
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

  const handleMouseDown = (e: React.MouseEvent, tableName: string) => {
    if ((e.target as HTMLElement).closest('.edit-button, .delete-button')) return;

    const table = tables.find(t => t.name === tableName);
    if (!table) return;

    const svg = svgRef.current;
    if (!svg) return;

    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

    setDraggedTable(tableName);
    setDragOffset({
      x: svgPoint.x - table.position.x,
      y: svgPoint.y - table.position.y
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedTable) return;

    const svg = svgRef.current;
    if (!svg) return;

    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

    setTables(tables.map(t =>
      t.name === draggedTable
        ? { ...t, position: { x: svgPoint.x - dragOffset.x, y: svgPoint.y - dragOffset.y } }
        : t
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedTable(null);
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

    const fromX = fromTable.position.x + 150;
    const fromY = fromTable.position.y + 120;
    const toX = toTable.position.x;
    const toY = toTable.position.y + 120;

    const midX = (fromX + toX) / 2;
    const isHorizontal = Math.abs(toX - fromX) > Math.abs(toY - fromY);

    let path;
    if (isHorizontal) {
      path = `M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`;
    } else {
      path = `M ${fromX} ${fromY} L ${fromX} ${(fromY + toY) / 2} L ${toX} ${(fromY + toY) / 2} L ${toX} ${toY}`;
    }

    return (
      <g key={`${rel.from}-${rel.to}`}>
        <path
          d={path}
          stroke="#94A3B8"
          strokeWidth="2"
          fill="none"
          strokeDasharray={rel.type === '1:1' ? '5,5' : '0'}
        />
        <circle cx={toX} cy={toY} r="4" fill="#94A3B8" />
        <text
          x={midX}
          y={isHorizontal ? fromY - 10 : (fromY + toY) / 2 - 10}
          fontSize="11"
          fill="#475569"
          fontWeight="600"
          textAnchor="middle"
          className="bg-white"
        >
          {rel.type}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Database Schema (ER Diagram)</h2>
          <p className="text-gray-600 text-sm">Entity-Relationship diagram for Bazarcom platform</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreatingTable(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Table
          </button>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="p-2 hover:bg-white rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-gray-700" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="p-2 hover:bg-white rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-4">
        {[
          { category: 'Core', color: '#10B981' },
          { category: 'Offers', color: '#F59E0B' },
          { category: 'Ingestion', color: '#3B82F6' },
          { category: 'Analytics', color: '#EF4444' },
          { category: 'AI Layer', color: '#7C3AED' }
        ].map((item) => (
          <div key={item.category} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
            <span className="text-sm font-medium text-gray-700">{item.category}</span>
          </div>
        ))}
      </div>

      {/* ER Diagram */}
      <div className="overflow-x-auto bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg border-2 border-gray-200">
        <svg
          ref={svgRef}
          width="1400"
          height="750"
          className="mx-auto cursor-move"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
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

          {/* Tables */}
          {tables.map((table, idx) => (
            <g
              key={table.name}
              onMouseDown={(e) => handleMouseDown(e, table.name)}
              style={{ cursor: isDragging && draggedTable === table.name ? 'grabbing' : 'grab' }}
            >
              {/* Table Container */}
              <rect
                x={table.position.x}
                y={table.position.y}
                width="300"
                height={40 + table.fields.length * 24 + 40}
                fill="white"
                stroke={table.color}
                strokeWidth="3"
                rx="12"
                filter={draggedTable === table.name ? 'url(#glow)' : 'url(#shadow)'}
                style={{ transition: 'filter 0.2s' }}
              />

              {/* Table Header */}
              <rect
                x={table.position.x}
                y={table.position.y}
                width="300"
                height="40"
                fill={table.color}
                rx="12"
              />
              <rect
                x={table.position.x}
                y={table.position.y + 32}
                width="300"
                height="8"
                fill={table.color}
              />

              <Database
                x={table.position.x + 12}
                y={table.position.y + 10}
                width="20"
                height="20"
                stroke="white"
                fill="white"
              />

              <text
                x={table.position.x + 42}
                y={table.position.y + 25}
                fontSize="16"
                fontWeight="bold"
                fill="white"
              >
                {table.name}
              </text>

              {/* Action Buttons */}
              <g className="edit-button">
                <rect
                  x={table.position.x + 220}
                  y={table.position.y + 8}
                  width="32"
                  height="24"
                  fill="rgba(255,255,255,0.2)"
                  rx="4"
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTable(table);
                  }}
                />
                <Edit2
                  x={table.position.x + 228}
                  y={table.position.y + 12}
                  width="16"
                  height="16"
                  stroke="white"
                  fill="none"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', pointerEvents: 'none' }}
                />
              </g>

              <g className="delete-button">
                <rect
                  x={table.position.x + 258}
                  y={table.position.y + 8}
                  width="32"
                  height="24"
                  fill="rgba(255,255,255,0.2)"
                  rx="4"
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTableDelete(table.name);
                  }}
                />
                <Trash2
                  x={table.position.x + 266}
                  y={table.position.y + 12}
                  width="16"
                  height="16"
                  stroke="white"
                  fill="none"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', pointerEvents: 'none' }}
                />
              </g>

              {/* Fields */}
              {table.fields.map((field, fieldIdx) => (
                <g key={field.name}>
                  <rect
                    x={table.position.x}
                    y={table.position.y + 40 + fieldIdx * 24}
                    width="300"
                    height="24"
                    fill={fieldIdx % 2 === 0 ? '#F9FAFB' : 'white'}
                  />

                  {field.isPrimaryKey && (
                    <Key
                      x={table.position.x + 8}
                      y={table.position.y + 44 + fieldIdx * 24}
                      width="14"
                      height="14"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                    />
                  )}

                  {field.isForeignKey && (
                    <Link
                      x={table.position.x + 8}
                      y={table.position.y + 44 + fieldIdx * 24}
                      width="14"
                      height="14"
                      stroke="#3B82F6"
                      fill="none"
                      strokeWidth="2"
                    />
                  )}

                  <text
                    x={table.position.x + (field.isPrimaryKey || field.isForeignKey ? 28 : 12)}
                    y={table.position.y + 56 + fieldIdx * 24}
                    fontSize="12"
                    fill="#374151"
                    fontWeight={field.isPrimaryKey || field.isForeignKey ? '600' : '400'}
                  >
                    {field.name}
                  </text>

                  <text
                    x={table.position.x + 285}
                    y={table.position.y + 56 + fieldIdx * 24}
                    fontSize="10"
                    fill="#9CA3AF"
                    textAnchor="end"
                  >
                    {field.type}
                  </text>
                </g>
              ))}

              {/* Footer with drag hint */}
              <rect
                x={table.position.x}
                y={table.position.y + 40 + table.fields.length * 24}
                width="300"
                height="40"
                fill="#F9FAFB"
                rx="0"
              />
              <Move
                x={table.position.x + 135}
                y={table.position.y + 50 + table.fields.length * 24}
                width="16"
                height="16"
                stroke="#9CA3AF"
                fill="none"
                strokeWidth="2"
              />
              <text
                x={table.position.x + 150}
                y={table.position.y + 63 + table.fields.length * 24}
                fontSize="10"
                fill="#9CA3AF"
                textAnchor="middle"
              >
                Drag to move
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend for Keys */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex gap-8">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-gray-600">Primary Key</span>
        </div>
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600">Foreign Key</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">1:N</span>
          <span className="text-sm text-gray-600">One-to-Many</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">1:1</span>
          <span className="text-sm text-gray-600">One-to-One (dashed)</span>
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
