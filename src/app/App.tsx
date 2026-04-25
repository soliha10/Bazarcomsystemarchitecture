import { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, Target, Zap, Database, ShoppingCart,
  Brain, BarChart3, Calendar, Layers, AlertTriangle,
  CheckCircle2, Circle
} from 'lucide-react';
import { PhaseCard } from './components/PhaseCard';
import { Timeline } from './components/Timeline';
import { KPICard } from './components/KPICard';
import { FlowDiagram } from './components/FlowDiagram';
import { ArchitectureLayer } from './components/ArchitectureLayer';
import { InteractiveFlowChart } from './components/InteractiveFlowChart';
import { EditPhaseModal } from './components/EditPhaseModal';
import { EditArchitectureModal } from './components/EditArchitectureModal';

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

interface ArchLayer {
  name: string;
  icon: 'database' | 'cpu' | 'server' | 'users';
  color: string;
  description?: string;
  components: string[];
  metrics?: { label: string; value: string }[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'architecture'>('overview');
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const [editingArchLayer, setEditingArchLayer] = useState<ArchLayer | null>(null);

  const [phases, setPhases] = useState<Phase[]>([
    {
      phase: 1,
      title: 'Data Ingestion',
      week: 'Week 1',
      status: 'completed' as const,
      color: '#3B82F6',
      steps: [
        'Select target marketplace (Amazon, eBay, etc.)',
        'Send HTTP request / API call',
        'Receive HTML or JSON response',
        'Parse product data (title, price, rating, reviews)',
        'Store raw data in database'
      ],
      decisions: [
        {
          question: 'Is data valid?',
          yes: 'Continue to preprocessing',
          no: 'Discard and log error'
        }
      ],
      technologies: ['Python', 'Scrapy', 'BeautifulSoup', 'Requests'],
      deliverables: ['Scraper modules for 5+ marketplaces', 'Raw data storage schema', 'Error logging system']
    },
    {
      phase: 2,
      title: 'Data Preprocessing',
      week: 'Week 2',
      status: 'completed' as const,
      color: '#F59E0B',
      steps: [
        'Clean and standardize text data',
        'Normalize price formats and currency',
        'Clean rating and review count fields',
        'Extract key features (brand, model, specs)',
        'Generate clean dataset for matching'
      ],
      decisions: [
        {
          question: 'Is title parsable?',
          yes: 'Extract features successfully',
          no: 'Mark as low quality data'
        }
      ],
      technologies: ['Pandas', 'NumPy', 'Regex', 'NLTK'],
      deliverables: ['Data cleaning pipeline', 'Feature extraction module', 'Quality scoring system']
    },
    {
      phase: 3,
      title: 'Product Matching',
      week: 'Week 3 - Critical Phase',
      status: 'in-progress' as const,
      color: '#EF4444',
      steps: [
        'Generate match key (brand + model + RAM + storage)',
        'Normalize model names across marketplaces',
        'Group similar products using fuzzy matching',
        'Detect duplicates and variants',
        'Update product database with matched offers'
      ],
      decisions: [
        {
          question: 'Match found?',
          yes: 'Add offer to existing product',
          no: 'Create new product entry'
        }
      ],
      technologies: ['FuzzyWuzzy', 'Levenshtein', 'PostgreSQL', 'Redis'],
      deliverables: ['Matching algorithm (95%+ accuracy)', 'Duplicate detection system', 'Product merge logic']
    },
    {
      phase: 4,
      title: 'Aggregation Engine',
      week: 'Week 4',
      status: 'pending' as const,
      color: '#DC2626',
      steps: [
        'Calculate minimum price across stores',
        'Calculate maximum price for reference',
        'Compute average rating from all sources',
        'Count total reviews',
        'Rank offers by price (cheapest first)',
        'Generate comprehensive product summary'
      ],
      technologies: ['PostgreSQL Views', 'Redis Cache', 'Pandas'],
      deliverables: ['Aggregation queries', 'Caching strategy', 'Price ranking algorithm']
    },
    {
      phase: 5,
      title: 'Backend API Development',
      week: 'Week 4',
      status: 'pending' as const,
      color: '#059669',
      steps: [
        'Build Products API (list all products)',
        'Build Product Details API (single product)',
        'Build Search API (keyword search)',
        'Build Compare API (price comparison)',
        'Implement caching layer',
        'Add rate limiting and security'
      ],
      technologies: ['FastAPI', 'Pydantic', 'JWT', 'Elasticsearch'],
      deliverables: ['REST API endpoints', 'API documentation (OpenAPI)', 'Authentication system']
    },
    {
      phase: 6,
      title: 'Frontend User Flow',
      week: 'Week 5',
      status: 'pending' as const,
      color: '#0891B2',
      steps: [
        'User enters search query',
        'Display product list with prices',
        'Click product to view details',
        'Show price comparison table',
        'Display historical price trends',
        'Add to wishlist / price alerts'
      ],
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts'],
      deliverables: ['Product search UI', 'Comparison dashboard', 'Price alert system']
    },
    {
      phase: 7,
      title: 'AI Layer Integration',
      week: 'Week 6',
      status: 'pending' as const,
      color: '#7C3AED',
      steps: [
        'Collect reviews from all sources',
        'Perform sentiment analysis on reviews',
        'Extract pros and cons automatically',
        'Predict future price trends using ML',
        'Generate AI-powered recommendations',
        'Deploy and monitor AI models'
      ],
      technologies: ['TensorFlow', 'Scikit-learn', 'NLTK', 'Transformers'],
      deliverables: ['Sentiment analysis model', 'Price prediction ML model', 'Recommendation engine']
    }
  ]);

  const handlePhaseUpdate = (updatedPhase: Phase) => {
    setPhases(phases.map(p => p.phase === updatedPhase.phase ? updatedPhase : p));
  };

  const timeline = [
    { week: 1, title: 'Data Collection', description: 'Web Scraping & APIs', color: '#3B82F6' },
    { week: 2, title: 'Preprocessing', description: 'Data Cleaning', color: '#F59E0B' },
    { week: 3, title: 'Product Matching', description: 'Core Algorithm', color: '#EF4444' },
    { week: 4, title: 'Backend API', description: 'REST Endpoints', color: '#059669' },
    { week: 5, title: 'Frontend UI', description: 'User Interface', color: '#0891B2' },
    { week: 6, title: 'AI Features', description: 'ML Integration', color: '#7C3AED' }
  ];

  const kpis = [
    { icon: ShoppingCart, label: 'Avg Offers per Product', value: '5.2', target: '> 5 stores', color: '#3B82F6' },
    { icon: Target, label: 'Matching Accuracy', value: '96.8%', target: '> 95%', color: '#059669' },
    { icon: Database, label: 'Data Completeness', value: '92.5%', target: '> 90%', color: '#F59E0B' },
    { icon: Zap, label: 'API Response Time', value: '145ms', target: '< 200ms', color: '#EF4444' }
  ];

  const [architectureLayers, setArchitectureLayers] = useState<ArchLayer[]>([
    {
      name: 'Data Layer',
      icon: 'database' as const,
      color: '#3B82F6',
      description: 'Data storage and persistence',
      components: [
        'PostgreSQL - Product catalog',
        'Redis - Cache layer',
        'S3 - Image storage',
        'Elasticsearch - Search index'
      ],
      metrics: [
        { label: 'Capacity', value: '10TB' },
        { label: 'Uptime', value: '99.9%' }
      ]
    },
    {
      name: 'Processing Layer',
      icon: 'cpu' as const,
      color: '#F59E0B',
      description: 'Data extraction and transformation',
      components: [
        'Scrapy - Web scraping framework',
        'Pandas - Data preprocessing',
        'Fuzzy matching algorithm',
        'ETL Pipeline (Airflow)'
      ],
      metrics: [
        { label: 'Throughput', value: '10K/min' },
        { label: 'Accuracy', value: '96%' }
      ]
    },
    {
      name: 'Backend Layer',
      icon: 'server' as const,
      color: '#059669',
      description: 'API and business logic',
      components: [
        'FastAPI - REST API',
        'GraphQL - Flexible queries',
        'JWT Authentication',
        'Rate limiting middleware'
      ],
      metrics: [
        { label: 'Latency', value: '145ms' },
        { label: 'RPS', value: '5K' }
      ]
    },
    {
      name: 'User & AI Layer',
      icon: 'users' as const,
      color: '#7C3AED',
      description: 'User interface and AI features',
      components: [
        'React + TypeScript frontend',
        'TensorFlow - Price prediction',
        'NLTK - Sentiment analysis',
        'Recommendation engine'
      ],
      metrics: [
        { label: 'Users', value: '50K+' },
        { label: 'Score', value: '4.8/5' }
      ]
    }
  ]);

  const handleArchLayerUpdate = (updatedLayer: ArchLayer) => {
    setArchitectureLayers(architectureLayers.map(l => l.name === updatedLayer.name ? updatedLayer : l));
  };

  const interactiveFlows = [
    {
      title: 'Data Ingestion Flow',
      layer: 'Data Layer',
      nodes: [
        { id: 'start', label: 'Start', type: 'start' as const, color: '#3B82F6', description: 'Initialize scraping process' },
        { id: 'select', label: 'Select Marketplace', type: 'process' as const, color: '#3B82F6', description: 'Choose target marketplace (Amazon, eBay, etc.)' },
        { id: 'request', label: 'Send Request', type: 'process' as const, color: '#3B82F6', description: 'HTTP GET/POST request to marketplace API' },
        { id: 'validate', label: 'Valid?', type: 'decision' as const, color: '#F59E0B', description: 'Check if response contains valid product data' },
        { id: 'parse', label: 'Parse & Store', type: 'process' as const, color: '#059669', description: 'Extract fields and save to database' },
        { id: 'end', label: 'End', type: 'end' as const, color: '#059669', description: 'Ingestion complete' }
      ],
      connections: [
        { from: 'start', to: 'select' },
        { from: 'select', to: 'request' },
        { from: 'request', to: 'validate' },
        { from: 'validate', to: 'parse', label: 'Yes' },
        { from: 'parse', to: 'end' }
      ]
    },
    {
      title: 'Product Matching Flow',
      layer: 'Processing Layer',
      nodes: [
        { id: 'clean', label: 'Clean Data', type: 'process' as const, color: '#F59E0B', description: 'Remove noise and standardize format' },
        { id: 'key', label: 'Match Key', type: 'process' as const, color: '#F59E0B', description: 'Generate unique product identifier' },
        { id: 'match', label: 'Match?', type: 'decision' as const, color: '#EF4444', description: 'Check if product exists in database' },
        { id: 'update', label: 'Update DB', type: 'process' as const, color: '#059669', description: 'Add new offer or create product' },
        { id: 'done', label: 'Done', type: 'end' as const, color: '#059669', description: 'Matching complete' }
      ],
      connections: [
        { from: 'clean', to: 'key' },
        { from: 'key', to: 'match' },
        { from: 'match', to: 'update', label: 'Yes/No' },
        { from: 'update', to: 'done' }
      ]
    },
    {
      title: 'User Search Flow',
      layer: 'User Layer',
      nodes: [
        { id: 'input', label: 'Search', type: 'process' as const, color: '#0891B2', description: 'User enters search query' },
        { id: 'api', label: 'Query API', type: 'process' as const, color: '#059669', description: 'Send request to backend' },
        { id: 'results', label: 'Results', type: 'process' as const, color: '#0891B2', description: 'Display product list' },
        { id: 'details', label: 'Details', type: 'process' as const, color: '#0891B2', description: 'Show price comparison' }
      ],
      connections: [
        { from: 'input', to: 'api' },
        { from: 'api', to: 'results' },
        { from: 'results', to: 'details' }
      ]
    }
  ];

  const flowDiagrams = [
    {
      title: 'Data Ingestion Flow',
      layer: 'Data Layer',
      steps: [
        { label: 'Start', type: 'process' as const, color: '#3B82F6' },
        { label: 'Select Marketplace', type: 'process' as const, color: '#3B82F6' },
        { label: 'Send Request', type: 'process' as const, color: '#3B82F6' },
        { label: 'Valid Data?', type: 'decision' as const, color: '#F59E0B' },
        { label: 'Parse & Store', type: 'process' as const, color: '#059669' }
      ]
    },
    {
      title: 'Product Matching Flow',
      layer: 'Processing Layer',
      steps: [
        { label: 'Clean Dataset', type: 'process' as const, color: '#F59E0B' },
        { label: 'Generate Match Key', type: 'process' as const, color: '#F59E0B' },
        { label: 'Match Found?', type: 'decision' as const, color: '#F59E0B' },
        { label: 'Update Database', type: 'process' as const, color: '#059669' }
      ]
    },
    {
      title: 'User Search Flow',
      layer: 'User Layer',
      steps: [
        { label: 'Search Input', type: 'process' as const, color: '#0891B2' },
        { label: 'Query API', type: 'process' as const, color: '#059669' },
        { label: 'Display Results', type: 'process' as const, color: '#0891B2' },
        { label: 'Show Details', type: 'process' as const, color: '#0891B2' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-md border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Bazarcom
              </h1>
              <p className="text-gray-600 mt-1">AI-Powered Price Comparison Platform</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm">
                <Calendar className="w-4 h-4 inline mr-1" />
                6 Weeks Timeline
              </div>
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold text-sm">
                <Target className="w-4 h-4 inline mr-1" />
                7 Phases
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'phases', label: 'Development Phases', icon: Layers },
              { id: 'architecture', label: 'Architecture', icon: Database }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPIs */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Performance Indicators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                  <KPICard key={idx} {...kpi} delay={idx * 0.1} />
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Timeline</h2>
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <Timeline weeks={timeline} />
              </div>
            </section>

            {/* Interactive Flow Diagrams */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Process Flows</h2>
              <div className="grid grid-cols-1 gap-6">
                {interactiveFlows.map((flow, idx) => (
                  <InteractiveFlowChart key={idx} {...flow} />
                ))}
              </div>
            </section>

            {/* Success Factors */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Critical Success Factors</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                    Product matching accuracy (Week 3)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                    Real-time price tracking system
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                    Scalable data pipeline architecture
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  <h3 className="font-bold text-gray-900">Key Challenges</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" />
                    Variant normalization (RAM, storage)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" />
                    Anti-scraping countermeasures
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" />
                    Duplicate product detection
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-gray-900">Expected Outcomes</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                    10,000+ products indexed
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                    5+ marketplace integrations
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                    AI-powered recommendations
                  </li>
                </ul>
              </motion.div>
            </section>
          </div>
        )}

        {activeTab === 'phases' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">7 Development Phases</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-gray-300" />
                  <span className="text-gray-600">Pending</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {phases.map((phase, idx) => (
                <PhaseCard
                  key={idx}
                  {...phase}
                  delay={idx * 0.1}
                  isActive={activePhase === phase.phase}
                  onClick={() => setActivePhase(activePhase === phase.phase ? null : phase.phase)}
                  onEdit={() => setEditingPhase(phase)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Architecture Layers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {architectureLayers.map((layer, idx) => (
                <ArchitectureLayer
                  key={idx}
                  {...layer}
                  delay={idx * 0.15}
                  onEdit={() => setEditingArchLayer(layer)}
                />
              ))}
            </div>

            {/* Tech Stack */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Technology Stack</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Frontend</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• React + TypeScript</p>
                    <p>• Tailwind CSS</p>
                    <p>• Recharts (visualizations)</p>
                    <p>• React Query</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Backend</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• FastAPI (Python)</p>
                    <p>• PostgreSQL</p>
                    <p>• Redis Cache</p>
                    <p>• Celery (task queue)</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">AI/ML</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• TensorFlow</p>
                    <p>• Scikit-learn</p>
                    <p>• NLTK (NLP)</p>
                    <p>• Pandas (preprocessing)</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Modals */}
      {editingPhase && (
        <EditPhaseModal
          phase={editingPhase}
          isOpen={!!editingPhase}
          onClose={() => setEditingPhase(null)}
          onSave={handlePhaseUpdate}
        />
      )}

      {editingArchLayer && (
        <EditArchitectureModal
          layer={editingArchLayer}
          isOpen={!!editingArchLayer}
          onClose={() => setEditingArchLayer(null)}
          onSave={handleArchLayerUpdate}
        />
      )}
    </div>
  );
}