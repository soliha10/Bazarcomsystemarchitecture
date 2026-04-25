import { useState, useEffect } from 'react';
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
import { InfrastructureComponents } from './components/InfrastructureComponents';
import { ERDiagram } from './components/ERDiagram';

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

const INITIAL_PHASES: Phase[] = [
    {
      phase: 1,
      title: 'Data Ingestion',
      week: 'Week 1',
      status: 'completed' as const,
      color: '#3B82F6',
      steps: [
        'Select target marketplace (Amazon, eBay, etc.)',
        'Trigger Docker containerized scraper',
        'Send HTTP request to marketplace API',
        'Receive HTML or JSON response',
        'Parse product data (title, price, rating, reviews, image_url)',
        'Store raw data in PostgreSQL / Data Lake'
      ],
      decisions: [
        {
          question: 'Is data valid?',
          yes: 'Continue to preprocessing',
          no: 'Discard and log error'
        }
      ],
      technologies: ['Docker', 'Scrapy', 'BeautifulSoup', 'PostgreSQL', 'Amazon S3'],
      deliverables: ['Dockerized scraper service', 'Raw data storage schema', 'Data validation module']
    },
    {
      phase: 2,
      title: 'Workflow Orchestration',
      week: 'Week 1-2',
      status: 'completed' as const,
      color: '#8B5CF6',
      steps: [
        'Define DAG / pipeline in Airflow or Dagster',
        'Schedule scraping jobs (hourly/daily)',
        'Trigger preprocessing tasks automatically',
        'Set up failure alerts and retries',
        'Monitor execution logs and task status'
      ],
      decisions: [],
      technologies: ['Apache Airflow', 'Dagster', 'Docker Compose', 'Prometheus'],
      deliverables: ['Orchestration DAGs', 'Scheduling config', 'Monitoring dashboard']
    },
    {
      phase: 3,
      title: 'Data Preprocessing',
      week: 'Week 2',
      status: 'completed' as const,
      color: '#F59E0B',
      steps: [
        'Load raw data from database',
        'Clean and standardize text data',
        'Normalize price formats and currency',
        'Clean rating and review count fields',
        'Extract features (brand, model, RAM, storage)',
        'Store clean data in processed tables'
      ],
      decisions: [
        {
          question: 'Is title parsable?',
          yes: 'Extract features successfully',
          no: 'Mark as low quality data'
        }
      ],
      technologies: ['Pandas', 'NumPy', 'Regex', 'NLTK', 'PySpark'],
      deliverables: ['Data cleaning pipeline', 'Feature extraction module', 'Quality scoring system']
    },
    {
      phase: 4,
      title: 'Product Matching',
      week: 'Week 3 - Critical Phase',
      status: 'in-progress' as const,
      color: '#EF4444',
      steps: [
        'Generate match key (brand + model + RAM + storage)',
        'Normalize model names across marketplaces',
        'Group similar products using fuzzy matching',
        'Detect duplicates and variants',
        'Store in Products Table + Offers Table (PostgreSQL)'
      ],
      decisions: [
        {
          question: 'Match found?',
          yes: 'Add offer to existing product',
          no: 'Create new product entry'
        }
      ],
      technologies: ['FuzzyWuzzy', 'Levenshtein', 'PostgreSQL', 'Redis Cache'],
      deliverables: ['Matching algorithm (95%+ accuracy)', 'Duplicate detection system', 'Product merge logic']
    },
    {
      phase: 5,
      title: 'Aggregation Engine',
      week: 'Week 4',
      status: 'pending' as const,
      color: '#DC2626',
      steps: [
        'Calculate minimum price across stores',
        'Calculate maximum price for reference',
        'Compute average rating from all sources',
        'Count total reviews across platforms',
        'Rank offers by price (cheapest first)',
        'Generate comprehensive product summary'
      ],
      technologies: ['PostgreSQL Views', 'Redis Cache', 'Apache Spark'],
      deliverables: ['Aggregation queries', 'Caching strategy', 'Price ranking algorithm']
    },
    {
      phase: 6,
      title: 'Backend API Development',
      week: 'Week 4',
      status: 'pending' as const,
      color: '#059669',
      steps: [
        'Develop API using FastAPI or Django',
        'Create /products endpoint (list all)',
        'Create /products/{id} endpoint (details)',
        'Create /search endpoint (keyword search)',
        'Create /compare endpoint (price comparison)',
        'Implement caching, rate limiting, and security'
      ],
      technologies: ['FastAPI', 'Pydantic', 'JWT', 'Redis', 'Nginx'],
      deliverables: ['REST API endpoints', 'OpenAPI documentation', 'Authentication system']
    },
    {
      phase: 7,
      title: 'Dockerization & Deployment',
      week: 'Week 4-5',
      status: 'pending' as const,
      color: '#64748B',
      steps: [
        'Containerize scraper service with Docker',
        'Containerize backend API',
        'Containerize database (PostgreSQL)',
        'Containerize Airflow/Dagster',
        'Create Docker Compose orchestration file',
        'Set up CI/CD pipeline'
      ],
      technologies: ['Docker', 'Docker Compose', 'Kubernetes', 'GitHub Actions'],
      deliverables: ['Dockerfiles for all services', 'docker-compose.yml', 'K8s manifests']
    },
    {
      phase: 8,
      title: 'Frontend User Flow',
      week: 'Week 5',
      status: 'pending' as const,
      color: '#0891B2',
      steps: [
        'User enters search query',
        'Send search request to API',
        'API returns product list',
        'Display products with prices',
        'User clicks product for details',
        'Show price comparison view with chart'
      ],
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Axios'],
      deliverables: ['Product search UI', 'Comparison dashboard', 'Price alert system']
    },
    {
      phase: 9,
      title: 'AI/ML Pipeline',
      week: 'Week 6',
      status: 'pending' as const,
      color: '#7C3AED',
      steps: [
        'Collect review data from all sources',
        'Train NLP model for sentiment analysis',
        'Perform sentiment analysis on reviews',
        'Extract pros and cons automatically',
        'Use MLflow to track experiments and log models',
        'Version models and register best model'
      ],
      technologies: ['MLflow', 'TensorFlow', 'HuggingFace', 'NLTK', 'Python'],
      deliverables: ['Sentiment analysis model', 'MLflow tracking server', 'Model registry']
    },
    {
      phase: 10,
      title: 'Model Deployment',
      week: 'Week 6',
      status: 'pending' as const,
      color: '#A855F7',
      steps: [
        'Deploy model as API endpoint',
        'Integrate ML API with backend',
        'Set up model monitoring and logging',
        'Implement A/B testing for models',
        'Create fallback mechanism',
        'Monitor prediction latency and accuracy'
      ],
      technologies: ['FastAPI', 'MLflow', 'Docker', 'Prometheus', 'Grafana'],
      deliverables: ['ML API endpoint', 'Model monitoring dashboard', 'Deployment pipeline']
    }
];

const INITIAL_ARCH_LAYERS: ArchLayer[] = [
    {
      name: 'Data Ingestion Layer',
      icon: 'database' as const,
      color: '#3B82F6',
      description: 'Raw data collection from marketplaces',
      components: [
        'Dockerized Scrapy spiders',
        'BeautifulSoup HTML parsers',
        'PostgreSQL raw data tables',
        'Amazon S3 / Data Lake storage'
      ],
      metrics: [
        { label: 'Throughput', value: '10K/min' },
        { label: 'Uptime', value: '99.9%' }
      ]
    },
    {
      name: 'Data Processing Layer',
      icon: 'cpu' as const,
      color: '#F59E0B',
      description: 'Data cleaning, transformation, and matching',
      components: [
        'Pandas / PySpark data cleaning',
        'Feature extraction pipelines',
        'Fuzzy matching algorithm (FuzzyWuzzy)',
        'Product deduplication engine'
      ],
      metrics: [
        { label: 'Processing', value: '50K/hr' },
        { label: 'Accuracy', value: '96.8%' }
      ]
    },
    {
      name: 'Data Infrastructure Layer',
      icon: 'server' as const,
      color: '#8B5CF6',
      description: 'Orchestration, containerization, and CI/CD',
      components: [
        'Apache Airflow / Dagster (orchestration)',
        'Docker + Docker Compose',
        'Kubernetes cluster (production)',
        'GitHub Actions CI/CD pipeline'
      ],
      metrics: [
        { label: 'Pipelines', value: '15+' },
        { label: 'Success', value: '98.5%' }
      ]
    },
    {
      name: 'Backend & API Layer',
      icon: 'server' as const,
      color: '#059669',
      description: 'REST API endpoints and business logic',
      components: [
        'FastAPI REST API server',
        'PostgreSQL aggregated views',
        'Redis caching layer',
        'JWT authentication + rate limiting'
      ],
      metrics: [
        { label: 'Latency', value: '145ms' },
        { label: 'RPS', value: '5K+' }
      ]
    },
    {
      name: 'AI/ML Layer + User Layer',
      icon: 'users' as const,
      color: '#7C3AED',
      description: 'Machine learning models and user interface',
      components: [
        'MLflow (experiment tracking & model registry)',
        'Sentiment analysis NLP model',
        'Price prediction model (optional)',
        'React + TypeScript frontend UI'
      ],
      metrics: [
        { label: 'Model Acc', value: '94%' },
        { label: 'Users', value: '50K+' }
      ]
    }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'architecture' | 'database'>('overview');
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const [editingArchLayer, setEditingArchLayer] = useState<ArchLayer | null>(null);

  // Load phases from localStorage or use initial data
  const [phases, setPhases] = useState<Phase[]>(() => {
    const saved = localStorage.getItem('bazarcom_phases');
    return saved ? JSON.parse(saved) : INITIAL_PHASES;
  });

  // Load architecture layers from localStorage or use initial data
  const [architectureLayers, setArchitectureLayers] = useState<ArchLayer[]>(() => {
    const saved = localStorage.getItem('bazarcom_arch_layers');
    return saved ? JSON.parse(saved) : INITIAL_ARCH_LAYERS;
  });

  // Save phases to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bazarcom_phases', JSON.stringify(phases));
  }, [phases]);

  // Save architecture layers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bazarcom_arch_layers', JSON.stringify(architectureLayers));
  }, [architectureLayers]);

  const handlePhaseUpdate = (updatedPhase: Phase) => {
    setPhases(phases.map(p => p.phase === updatedPhase.phase ? updatedPhase : p));
  };

  const handleArchLayerUpdate = (updatedLayer: ArchLayer) => {
    setArchitectureLayers(architectureLayers.map(l => l.name === updatedLayer.name ? updatedLayer : l));
  };

  const timeline = [
    { week: 1, title: 'Data Ingestion', description: 'Scraping + Docker', color: '#3B82F6' },
    { week: 2, title: 'Preprocessing', description: 'Airflow DAG Setup', color: '#F59E0B' },
    { week: 3, title: 'Product Matching', description: 'Core Logic', color: '#EF4444' },
    { week: 4, title: 'Backend + Agg', description: 'API + Aggregation', color: '#059669' },
    { week: 5, title: 'Dockerization', description: 'Frontend + Deploy', color: '#64748B' },
    { week: 6, title: 'AI/ML', description: 'MLflow + Models', color: '#7C3AED' }
  ];

  const kpis = [
    { icon: Target, label: 'Matching Accuracy', value: '96.8%', target: '> 95%', color: '#059669' },
    { icon: ShoppingCart, label: 'Avg Offers per Product', value: '5.2', target: '> 5 stores', color: '#3B82F6' },
    { icon: TrendingUp, label: 'Pipeline Success Rate', value: '98.5%', target: '> 95%', color: '#F59E0B' },
    { icon: Zap, label: 'API Response Time', value: '145ms', target: '< 200ms', color: '#EF4444' }
  ];

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
              { id: 'architecture', label: 'Architecture', icon: Database },
              { id: 'database', label: 'Database Schema', icon: Database }
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

            {/* Infrastructure Components */}
            <section>
              <InfrastructureComponents />
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
                    Product matching accuracy (Week 3 - Critical)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                    Workflow orchestration with Airflow
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                    MLOps pipeline with MLflow
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
                    Variant normalization across marketplaces
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" />
                    Anti-scraping mechanisms and rate limits
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" />
                    Containerization and deployment complexity
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
                    10,000+ products with 5+ offers each
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                    Fully Dockerized microservices
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                    MLflow-managed ML models in production
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
              <h3 className="text-xl font-bold text-gray-900 mb-6">Production Technology Stack</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Data Ingestion</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• Docker + Docker Compose</p>
                    <p>• Scrapy / BeautifulSoup</p>
                    <p>• PostgreSQL</p>
                    <p>• Amazon S3</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Orchestration</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• Apache Airflow</p>
                    <p>• Dagster (alternative)</p>
                    <p>• Kubernetes (prod)</p>
                    <p>• GitHub Actions</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Backend & API</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• FastAPI (Python)</p>
                    <p>• PostgreSQL + Redis</p>
                    <p>• Nginx (reverse proxy)</p>
                    <p>• JWT Authentication</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">MLOps & AI</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• MLflow (tracking)</p>
                    <p>• TensorFlow / PyTorch</p>
                    <p>• HuggingFace Transformers</p>
                    <p>• Prometheus + Grafana</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-8">
            <ERDiagram />

            {/* Database Details */}
            <section className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Database Design Principles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Normalization
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Third Normal Form (3NF) compliance</li>
                    <li>• Eliminates data redundancy</li>
                    <li>• Maintains data integrity</li>
                    <li>• Optimized for ACID transactions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Indexing Strategy
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Primary keys on all ID fields</li>
                    <li>• Foreign key indexes for joins</li>
                    <li>• B-tree index on match_key (products)</li>
                    <li>• Composite index on (product_id, scraped_at)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Performance Optimization
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Partitioning on price_history by date</li>
                    <li>• Materialized views for product_metrics</li>
                    <li>• Connection pooling (PgBouncer)</li>
                    <li>• Query result caching in Redis</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    Data Pipeline
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• raw_products → preprocessing → products</li>
                    <li>• Automated ETL with Airflow</li>
                    <li>• Daily aggregation jobs</li>
                    <li>• ML model predictions stored in reviews</li>
                  </ul>
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