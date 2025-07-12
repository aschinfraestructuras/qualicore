import { useState, useEffect } from 'react'
import { 
  FileText, 
  TestTube, 
  ClipboardCheck, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Users,
  Target,
  Award,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Star
} from 'lucide-react'
import { motion } from 'framer-motion'

// Dados mockados mais realistas
const projectStats = {
  overall: {
    conformity: 94.2,
    documents: 156,
    tests: 89,
    checklists: 234,
    materials: 67,
    nonConformities: 12
  },
  recent: {
    documents: { value: 156, change: 12, trend: 'up' },
    tests: { value: 89, change: 5, trend: 'up' },
    checklists: { value: 234, change: 18, trend: 'up' },
    materials: { value: 67, change: -3, trend: 'down' },
    nonConformities: { value: 12, change: -25, trend: 'down' }
  }
}

const recentActivities = [
  {
    id: 1,
    type: 'document',
    title: 'Especificação técnica aprovada',
    description: 'Especificação técnica para betão estrutural C30/37',
    time: '2 horas atrás',
    status: 'success',
    zone: 'Zona A - Fundações',
    user: 'Maria Santos'
  },
  {
    id: 2,
    type: 'test',
    title: 'Ensaio de resistência não conforme',
    description: 'Resistência do betão: 28.5 MPa (esperado: 30 MPa)',
    time: '4 horas atrás',
    status: 'error',
    zone: 'Zona B - Pilares',
    user: 'Carlos Mendes'
  },
  {
    id: 3,
    type: 'checklist',
    title: 'Inspeção de armaduras concluída',
    description: 'Checklist de armaduras - 95% de conformidade',
    time: '6 horas atrás',
    status: 'success',
    zone: 'Zona C - Lajes',
    user: 'Ana Costa'
  },
  {
    id: 4,
    type: 'material',
    title: 'Material recebido e aprovado',
    description: 'Cimento CEM I 42.5R - 50 toneladas',
    time: '1 dia atrás',
    status: 'success',
    zone: 'Armazém Central',
    user: 'João Silva'
  },
  {
    id: 5,
    type: 'nonConformity',
    title: 'Nova não conformidade registada',
    description: 'NC-2024-001: Desalinhamento em pilares',
    time: '2 dias atrás',
    status: 'warning',
    zone: 'Zona D - Estrutura',
    user: 'Pedro Alves'
  }
]

const conformityData = [
  { module: 'Documentos', percentage: 95, color: 'bg-blue-500' },
  { module: 'Ensaios', percentage: 87, color: 'bg-green-500' },
  { module: 'Checklists', percentage: 92, color: 'bg-purple-500' },
  { module: 'Materiais', percentage: 98, color: 'bg-orange-500' }
]

const quickActions = [
  { 
    title: 'Novo Documento', 
    description: 'Registar nova documentação',
    icon: FileText, 
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    path: '/documentos/novo'
  },
  { 
    title: 'Registar Ensaio', 
    description: 'Inserir resultados de ensaios',
    icon: TestTube, 
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    path: '/ensaios/novo'
  },
  { 
    title: 'Criar Checklist', 
    description: 'Nova inspeção ou verificação',
    icon: ClipboardCheck, 
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    path: '/checklists/novo'
  },
  { 
    title: 'Reportar NC', 
    description: 'Registar não conformidade',
    icon: AlertTriangle, 
    color: 'bg-gradient-to-br from-red-500 to-red-600',
    path: '/nao-conformidades/nova'
  }
]

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Dashboard de Qualidade
          </h1>
          <p className="text-gray-600 mt-2">
            Visão geral da gestão da qualidade do projeto
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-xl p-1 shadow-soft">
            {['week', 'month', 'quarter'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-gradient-primary text-white shadow-glow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period === 'week' ? 'Semana' : period === 'month' ? 'Mês' : 'Trimestre'}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {Object.entries(projectStats.recent).map(([key, stat], index) => {
          const icons = {
            documents: FileText,
            tests: TestTube,
            checklists: ClipboardCheck,
            materials: Package,
            nonConformities: AlertTriangle
          }
          const colors = {
            documents: 'bg-gradient-to-br from-blue-500 to-blue-600',
            tests: 'bg-gradient-to-br from-green-500 to-green-600',
            checklists: 'bg-gradient-to-br from-purple-500 to-purple-600',
            materials: 'bg-gradient-to-br from-orange-500 to-orange-600',
            nonConformities: 'bg-gradient-to-br from-red-500 to-red-600'
          }
          const labels = {
            documents: 'Documentos',
            tests: 'Ensaios',
            checklists: 'Checklists',
            materials: 'Materiais',
            nonConformities: 'NCs'
          }
          
          const Icon = icons[key as keyof typeof icons]
          const color = colors[key as keyof typeof colors]
          const label = labels[key as keyof typeof labels]

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="stat-card group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${color} shadow-glow`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{label}</div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conformity Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card card-hover">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="card-title">Conformidade Geral</h3>
                  <p className="card-description">Percentagem de conformidade por módulo</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-primary"></div>
                  <span className="text-sm font-semibold text-gray-900">
                    {projectStats.overall.conformity}%
                  </span>
                </div>
              </div>
            </div>
            <div className="card-content">
              <div className="space-y-6">
                {conformityData.map((item, index) => (
                  <motion.div 
                    key={item.module}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{item.module}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
                    </div>
                    <div className="progress">
                      <div 
                        className={`progress-bar ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="card card-hover h-full">
            <div className="card-header">
              <h3 className="card-title">Atividade Recente</h3>
              <p className="card-description">Últimas atividades no sistema</p>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div 
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.status === 'success' ? 'bg-success-100' : 
                      activity.status === 'error' ? 'bg-danger-100' : 'bg-warning-100'
                    }`}>
                      {activity.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-success-600" />
                      ) : activity.status === 'error' ? (
                        <XCircle className="h-4 w-4 text-danger-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-warning-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {activity.zone}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {activity.user}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="card card-hover">
          <div className="card-header">
            <h3 className="card-title">Ações Rápidas</h3>
            <p className="card-description">Acesse rapidamente as funcionalidades mais usadas</p>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="group flex flex-col items-center p-6 rounded-2xl border-2 border-gray-200 hover:border-primary-200 hover:shadow-soft transition-all duration-300 hover:scale-105"
                  >
                    <div className={`p-4 rounded-2xl ${action.color} shadow-glow mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h4>
                    <p className="text-sm text-gray-600 text-center leading-relaxed">{action.description}</p>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Project Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="card card-hover">
          <div className="card-header">
            <h3 className="card-title">Próximos Prazos</h3>
            <p className="card-description">Documentos e ensaios com prazo próximo</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-warning-50 rounded-xl border border-warning-200">
                <div>
                  <p className="text-sm font-semibold text-warning-800">Ensaio de Resistência</p>
                  <p className="text-xs text-warning-600">Zona A - Fundações</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-warning-800">2 dias</p>
                  <p className="text-xs text-warning-600">Vence em 15/01</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-info-50 rounded-xl border border-info-200">
                <div>
                  <p className="text-sm font-semibold text-info-800">Certificado de Material</p>
                  <p className="text-xs text-info-600">Cimento CEM I</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-info-800">5 dias</p>
                  <p className="text-xs text-info-600">Vence em 18/01</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="card-header">
            <h3 className="card-title">Zonas de Trabalho</h3>
            <p className="card-description">Status por zona do projeto</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {['Zona A - Fundações', 'Zona B - Pilares', 'Zona C - Lajes', 'Zona D - Estrutura'].map((zone, index) => (
                <div key={zone} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{zone}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-success-500"></div>
                    <span className="text-sm font-semibold text-success-600">Ativa</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="card-header">
            <h3 className="card-title">Equipa de Qualidade</h3>
            <p className="card-description">Membros da equipa ativos</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {[
                { name: 'João Silva', role: 'Eng. Qualidade', status: 'online' },
                { name: 'Maria Santos', role: 'Técnica Lab', status: 'online' },
                { name: 'Carlos Mendes', role: 'Inspetor', status: 'away' },
                { name: 'Ana Costa', role: 'Coordenadora', status: 'online' }
              ].map((member, index) => (
                <div key={member.name} className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                      member.status === 'online' ? 'bg-success-500' : 'bg-warning-500'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 