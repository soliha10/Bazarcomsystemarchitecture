import { motion } from 'motion/react';
import { Database, Container, Workflow, Beaker, Server, GitBranch } from 'lucide-react';

interface InfraComponent {
  name: string;
  description: string;
  icon: any;
  color: string;
  category: 'Database' | 'Orchestration' | 'ML' | 'Container' | 'CI/CD';
}

export function InfrastructureComponents() {
  const components: InfraComponent[] = [
    {
      name: 'PostgreSQL',
      description: 'Main relational database for products, offers, and user data',
      icon: Database,
      color: '#336791',
      category: 'Database'
    },
    {
      name: 'Redis',
      description: 'In-memory cache for API responses and session management',
      icon: Server,
      color: '#DC382D',
      category: 'Database'
    },
    {
      name: 'Docker',
      description: 'Container platform for all microservices',
      icon: Container,
      color: '#2496ED',
      category: 'Container'
    },
    {
      name: 'Docker Compose',
      description: 'Multi-container orchestration for local development',
      icon: Container,
      color: '#2496ED',
      category: 'Container'
    },
    {
      name: 'Apache Airflow',
      description: 'Workflow orchestration for ETL pipelines and scheduled tasks',
      icon: Workflow,
      color: '#017CEE',
      category: 'Orchestration'
    },
    {
      name: 'Dagster',
      description: 'Alternative data orchestrator with better observability',
      icon: Workflow,
      color: '#6B46C1',
      category: 'Orchestration'
    },
    {
      name: 'MLflow',
      description: 'ML lifecycle management: experiment tracking, model registry, deployment',
      icon: Beaker,
      color: '#0194E2',
      category: 'ML'
    },
    {
      name: 'GitHub Actions',
      description: 'CI/CD pipeline for automated testing and deployment',
      icon: GitBranch,
      color: '#2088FF',
      category: 'CI/CD'
    }
  ];

  const categories = ['Database', 'Container', 'Orchestration', 'ML', 'CI/CD'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Infrastructure Components</h2>
        <p className="text-gray-600 text-sm">Modern data engineering and MLOps stack</p>
      </div>

      <div className="space-y-6">
        {categories.map((category, catIdx) => {
          const categoryComponents = components.filter(c => c.category === category);
          if (categoryComponents.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryComponents.map((component, idx) => {
                  const Icon = component.icon;
                  return (
                    <motion.div
                      key={component.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: (catIdx * 0.1) + (idx * 0.05) }}
                      whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border-2 border-gray-100 hover:border-gray-300 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${component.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: component.color }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{component.name}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {component.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Architecture Diagram Preview */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-700 mb-4">SYSTEM ARCHITECTURE</h3>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between text-xs">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Database className="w-8 h-8 text-white" />
              </div>
              <p className="font-semibold text-gray-700">Data Layer</p>
              <p className="text-gray-500">PostgreSQL + Redis</p>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="w-12 h-0.5 bg-gray-300 self-center" />
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Workflow className="w-8 h-8 text-white" />
              </div>
              <p className="font-semibold text-gray-700">Orchestration</p>
              <p className="text-gray-500">Airflow</p>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="w-12 h-0.5 bg-gray-300 self-center" />
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Server className="w-8 h-8 text-white" />
              </div>
              <p className="font-semibold text-gray-700">Backend API</p>
              <p className="text-gray-500">FastAPI</p>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="w-12 h-0.5 bg-gray-300 self-center" />
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <Beaker className="w-8 h-8 text-white" />
              </div>
              <p className="font-semibold text-gray-700">ML Layer</p>
              <p className="text-gray-500">MLflow</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
