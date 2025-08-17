import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Gauge,
  Ruler,
  HardHat,
  FileText,
  BarChart3,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash,
  Train,
  Zap,
  Shield,
  Database,
  Settings,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Trilho {
  id: string;
  codigo: string;
  tipo: 'UIC60' | 'UIC54' | 'S49' | 'S54';
  material: 'Aço' | 'Aço endurecido' | 'Aço especial';
  comprimento: number;
  peso: number;
  fabricante: string;
  dataFabricacao: string;
  dataInstalacao: string;
  kmInicial: number;
  kmFinal: number;
  estado: 'Excelente' | 'Bom' | 'Regular' | 'Mau' | 'Crítico';
  tensao: number;
  geometria: {
    alinhamento: number;
    nivel: number;
    bitola: number;
  };
  inspecoes: Inspecao[];
  ultimaInspecao: string;
  proximaInspecao: string;
}

interface Travessa {
  id: string;
  codigo: string;
  tipo: 'Betão' | 'Madeira' | 'Aço';
  material: string;
  comprimento: number;
  largura: number;
  altura: number;
  peso: number;
  fabricante: string;
  dataFabricacao: string;
  dataInstalacao: string;
  kmInicial: number;
  kmFinal: number;
  estado: 'Excelente' | 'Bom' | 'Regular' | 'Mau' | 'Crítico';
  inspecoes: Inspecao[];
  ultimaInspecao: string;
  proximaInspecao: string;
}

interface Inspecao {
  id: string;
  data: string;
  tipo: 'Geometria' | 'Visual' | 'Ultrassom' | 'Magnetoscopia' | 'Penetrantes';
  inspector: string;
  resultado: 'Conforme' | 'Não Conforme' | 'Crítico';
  observacoes: string;
  acoes: string;
  proximaInspecao: string;
  fotos: string[];
  relatorio: string;
}

export default function ViaFerrea() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTrilho, setSelectedTrilho] = useState<Trilho | null>(null);
  const [selectedTravessa, setSelectedTravessa] = useState<Travessa | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'trilho' | 'travessa' | 'inspecao'>('trilho');

  // Dados simulados para demonstração
  const trilhos: Trilho[] = [
    {
      id: '1',
      codigo: 'TR-001-2024',
      tipo: 'UIC60',
      material: 'Aço endurecido',
      comprimento: 25,
      peso: 60.3,
      fabricante: 'ArcelorMittal',
      dataFabricacao: '2024-01-15',
      dataInstalacao: '2024-03-20',
      kmInicial: 12.5,
      kmFinal: 12.525,
      estado: 'Bom',
      tensao: 850,
      geometria: {
        alinhamento: 2.1,
        nivel: 1.8,
        bitola: 1435
      },
      inspecoes: [],
      ultimaInspecao: '2024-05-15',
      proximaInspecao: '2024-08-15'
    },
    {
      id: '2',
      codigo: 'TR-002-2024',
      tipo: 'UIC54',
      material: 'Aço especial',
      comprimento: 25,
      peso: 54.8,
      fabricante: 'Voestalpine',
      dataFabricacao: '2024-02-10',
      dataInstalacao: '2024-04-15',
      kmInicial: 12.525,
      kmFinal: 12.55,
      estado: 'Excelente',
      tensao: 820,
      geometria: {
        alinhamento: 1.5,
        nivel: 1.2,
        bitola: 1435
      },
      inspecoes: [],
      ultimaInspecao: '2024-06-01',
      proximaInspecao: '2024-09-01'
    },
    {
      id: '3',
      codigo: 'TR-003-2024',
      tipo: 'S49',
      material: 'Aço',
      comprimento: 25,
      peso: 49.4,
      fabricante: 'Tata Steel',
      dataFabricacao: '2023-12-20',
      dataInstalacao: '2024-02-28',
      kmInicial: 12.55,
      kmFinal: 12.575,
      estado: 'Regular',
      tensao: 780,
      geometria: {
        alinhamento: 3.2,
        nivel: 2.8,
        bitola: 1435
      },
      inspecoes: [],
      ultimaInspecao: '2024-04-20',
      proximaInspecao: '2024-07-20'
    }
  ];

  const travessas: Travessa[] = [
    {
      id: '1',
      codigo: 'TV-001-2024',
      tipo: 'Betão',
      material: 'Betão armado pré-esforçado',
      comprimento: 2.6,
      largura: 0.25,
      altura: 0.22,
      peso: 320,
      fabricante: 'Cimpor',
      dataFabricacao: '2024-02-10',
      dataInstalacao: '2024-03-20',
      kmInicial: 12.5,
      kmFinal: 12.5026,
      estado: 'Excelente',
      inspecoes: [],
      ultimaInspecao: '2024-05-15',
      proximaInspecao: '2024-08-15'
    },
    {
      id: '2',
      codigo: 'TV-002-2024',
      tipo: 'Betão',
      material: 'Betão armado pré-esforçado',
      comprimento: 2.6,
      largura: 0.25,
      altura: 0.22,
      peso: 320,
      fabricante: 'Secil',
      dataFabricacao: '2024-01-20',
      dataInstalacao: '2024-03-25',
      kmInicial: 12.5026,
      kmFinal: 12.5052,
      estado: 'Bom',
      inspecoes: [],
      ultimaInspecao: '2024-05-20',
      proximaInspecao: '2024-08-20'
    },
    {
      id: '3',
      codigo: 'TV-003-2024',
      tipo: 'Madeira',
      material: 'Madeira de carvalho tratada',
      comprimento: 2.4,
      largura: 0.22,
      altura: 0.18,
      peso: 180,
      fabricante: 'Silvapor',
      dataFabricacao: '2023-11-15',
      dataInstalacao: '2024-01-10',
      kmInicial: 12.5052,
      kmFinal: 12.5076,
      estado: 'Mau',
      inspecoes: [],
      ultimaInspecao: '2024-03-15',
      proximaInspecao: '2024-06-15'
    }
  ];

  const stats = {
    totalTrilhos: 1247,
    totalTravessas: 8923,
    inspecoesPendentes: 23,
    alertasCriticos: 5,
    conformidade: 94.2,
    kmCobertos: 156.8
  };

  const handleAddNew = (type: 'trilho' | 'travessa' | 'inspecao') => {
    setModalType(type);
    setShowModal(true);
    toast.success(`🛤️ Abrindo formulário para novo ${type}...`, {
      icon: '🛤️',
      duration: 2000,
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '600'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Train className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Via Férrea
              </h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <span>🛤️</span>
                <span>Gestão de Trilhos e Travessas - NP EN 13674 / NP EN 13481</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleAddNew('trilho')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Trilho</span>
            </button>
            <button
              onClick={() => handleAddNew('travessa')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Nova Travessa</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8"
      >
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trilhos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTrilhos}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Travessas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTravessas}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Database className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inspeções Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inspecoesPendentes}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alertas Críticos</p>
              <p className="text-2xl font-bold text-red-600">{stats.alertasCriticos}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conformidade</p>
              <p className="text-2xl font-bold text-green-600">{stats.conformidade}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">KM Cobertos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.kmCobertos}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'trilhos', label: 'Trilhos', icon: TrendingUp },
            { id: 'travessas', label: 'Travessas', icon: Database },
            { id: 'inspecoes', label: 'Inspeções', icon: Shield },
            { id: 'normativas', label: 'Normativas', icon: FileText },
            { id: 'configuracoes', label: 'Configurações', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {activeTab === 'dashboard' && (
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Via Férrea</h2>
            
            {/* Resumo Executivo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">🛤️</span>
                  Trilhos
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="font-semibold">{trilhos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Excelente:</span>
                    <span className="text-green-600 font-semibold">{trilhos.filter(t => t.estado === 'Excelente').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Crítico:</span>
                    <span className="text-red-600 font-semibold">{trilhos.filter(t => t.estado === 'Crítico').length}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">🏗️</span>
                  Travessas
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="font-semibold">{travessas.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Excelente:</span>
                    <span className="text-green-600 font-semibold">{travessas.filter(t => t.estado === 'Excelente').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Crítico:</span>
                    <span className="text-red-600 font-semibold">{travessas.filter(t => t.estado === 'Crítico').length}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">📊</span>
                  Conformidade
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Geral:</span>
                    <span className="font-semibold text-green-600">{stats.conformidade}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Inspeções:</span>
                    <span className="font-semibold text-yellow-600">{stats.inspecoesPendentes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Alertas:</span>
                    <span className="font-semibold text-red-600">{stats.alertasCriticos}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos e Análises */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado dos Trilhos</h3>
                <div className="space-y-3">
                  {['Excelente', 'Bom', 'Regular', 'Mau', 'Crítico'].map((estado) => {
                    const count = trilhos.filter(t => t.estado === estado).length;
                    const percentage = trilhos.length > 0 ? (count / trilhos.length) * 100 : 0;
                    const color = estado === 'Excelente' ? 'bg-green-500' : 
                                 estado === 'Bom' ? 'bg-blue-500' : 
                                 estado === 'Regular' ? 'bg-yellow-500' : 
                                 estado === 'Mau' ? 'bg-orange-500' : 'bg-red-500';
                    
                    return (
                      <div key={estado} className="flex items-center space-x-3">
                        <div className="w-20 text-sm font-medium text-gray-700">{estado}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-sm font-semibold text-gray-900">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado das Travessas</h3>
                <div className="space-y-3">
                  {['Excelente', 'Bom', 'Regular', 'Mau', 'Crítico'].map((estado) => {
                    const count = travessas.filter(t => t.estado === estado).length;
                    const percentage = travessas.length > 0 ? (count / travessas.length) * 100 : 0;
                    const color = estado === 'Excelente' ? 'bg-green-500' : 
                                 estado === 'Bom' ? 'bg-blue-500' : 
                                 estado === 'Regular' ? 'bg-yellow-500' : 
                                 estado === 'Mau' ? 'bg-orange-500' : 'bg-red-500';
                    
                    return (
                      <div key={estado} className="flex items-center space-x-3">
                        <div className="w-20 text-sm font-medium text-gray-700">{estado}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-sm font-semibold text-gray-900">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Próximas Inspeções */}
            <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Inspeções</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-semibold text-gray-900">Código</th>
                      <th className="text-left py-2 px-4 font-semibold text-gray-900">Tipo</th>
                      <th className="text-left py-2 px-4 font-semibold text-gray-900">KM</th>
                      <th className="text-left py-2 px-4 font-semibold text-gray-900">Próxima Inspeção</th>
                      <th className="text-left py-2 px-4 font-semibold text-gray-900">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...trilhos, ...travessas]
                      .sort((a, b) => new Date(a.proximaInspecao).getTime() - new Date(b.proximaInspecao).getTime())
                      .slice(0, 5)
                      .map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-2 px-4">
                            <span className="font-medium text-gray-900">{item.codigo}</span>
                          </td>
                          <td className="py-2 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {('tensao' in item) ? 'Trilho' : 'Travessa'}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-gray-600">{item.kmInicial} - {item.kmFinal}</td>
                          <td className="py-2 px-4 text-gray-600">{item.proximaInspecao}</td>
                          <td className="py-2 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.estado === 'Excelente' ? 'bg-green-100 text-green-800' :
                              item.estado === 'Bom' ? 'bg-blue-100 text-blue-800' :
                              item.estado === 'Regular' ? 'bg-yellow-100 text-yellow-800' :
                              item.estado === 'Mau' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trilhos' && (
          <div className="glass-card p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestão de Trilhos</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar trilhos..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Código</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Tipo</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Material</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Estado</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">KM</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Próxima Inspeção</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {trilhos.map((trilho) => (
                    <tr key={trilho.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{trilho.codigo}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {trilho.tipo}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{trilho.material}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          trilho.estado === 'Excelente' ? 'bg-green-100 text-green-800' :
                          trilho.estado === 'Bom' ? 'bg-blue-100 text-blue-800' :
                          trilho.estado === 'Regular' ? 'bg-yellow-100 text-yellow-800' :
                          trilho.estado === 'Mau' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {trilho.estado}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{trilho.kmInicial} - {trilho.kmFinal}</td>
                      <td className="py-4 px-6 text-gray-600">{trilho.proximaInspecao}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'travessas' && (
          <div className="glass-card p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestão de Travessas</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar travessas..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Código</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Tipo</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Material</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Estado</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">KM</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Próxima Inspeção</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {travessas.map((travessa) => (
                    <tr key={travessa.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{travessa.codigo}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {travessa.tipo}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{travessa.material}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          travessa.estado === 'Excelente' ? 'bg-green-100 text-green-800' :
                          travessa.estado === 'Bom' ? 'bg-blue-100 text-blue-800' :
                          travessa.estado === 'Regular' ? 'bg-yellow-100 text-yellow-800' :
                          travessa.estado === 'Mau' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {travessa.estado}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{travessa.kmInicial} - {travessa.kmFinal}</td>
                      <td className="py-4 px-6 text-gray-600">{travessa.proximaInspecao}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inspecoes' && (
          <div className="glass-card p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestão de Inspeções</h2>
              <button
                onClick={() => handleAddNew('inspecao')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Nova Inspeção</span>
              </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar inspeções..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">Todos os tipos</option>
                <option value="geometria">Geometria</option>
                <option value="visual">Visual</option>
                <option value="ultrassom">Ultrassom</option>
                <option value="magnetoscopia">Magnetoscopia</option>
                <option value="penetrantes">Penetrantes</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">Todos os resultados</option>
                <option value="conforme">Conforme</option>
                <option value="nao-conforme">Não Conforme</option>
                <option value="critico">Crítico</option>
              </select>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Filter className="h-5 w-5" />
              </button>
            </div>

            {/* Estatísticas de Inspeções */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Inspeções</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conformes</p>
                    <p className="text-2xl font-bold text-green-600">142</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Não Conformes</p>
                    <p className="text-2xl font-bold text-yellow-600">12</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Críticos</p>
                    <p className="text-2xl font-bold text-red-600">2</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela de Inspeções */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Data</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Tipo</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Inspector</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Resultado</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Elemento</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-gray-600">2024-06-15</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Geometria
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">João Silva</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Conforme
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">TR-001-2024</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-gray-600">2024-06-10</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Ultrassom
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">Maria Santos</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Não Conforme
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">TR-003-2024</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-gray-600">2024-06-05</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Visual
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">Pedro Costa</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Crítico
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">TV-003-2024</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'normativas' && (
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Normativas Aplicáveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">NP EN 13674</h3>
                <p className="text-gray-600 mb-4">Trilhos ferroviários - Trilhos Vignole de 46 kg/m e superiores</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Especificações técnicas</li>
                  <li>• Ensaios de qualidade</li>
                  <li>• Marcagem e identificação</li>
                </ul>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">NP EN 13481</h3>
                <p className="text-gray-600 mb-4">Travessas ferroviárias - Travessas de betão armado pré-esforçado</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Especificações de fabrico</li>
                  <li>• Ensaios de resistência</li>
                  <li>• Controlo de qualidade</li>
                </ul>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">NP EN 13848</h3>
                <p className="text-gray-600 mb-4">Geometria da via - Parâmetros de qualidade</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tolerâncias de alinhamento</li>
                  <li>• Tolerâncias de nível</li>
                  <li>• Tolerâncias de bitola</li>
                </ul>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Regulamento Nacional</h3>
                <p className="text-gray-600 mb-4">Regulamento da Infraestrutura Ferroviária Nacional</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Requisitos de segurança</li>
                  <li>• Procedimentos de manutenção</li>
                  <li>• Inspeções obrigatórias</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'configuracoes' && (
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações Via Férrea</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configurações de Inspeção */}
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🔍</span>
                    Configurações de Inspeção
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequência de Inspeção (dias)
                      </label>
                      <input
                        type="number"
                        defaultValue="90"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tolerância de Alinhamento (mm)
                      </label>
                      <input
                        type="number"
                        defaultValue="2.5"
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tolerância de Nível (mm)
                      </label>
                      <input
                        type="number"
                        defaultValue="2.0"
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bitola Padrão (mm)
                      </label>
                      <input
                        type="number"
                        defaultValue="1435"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Configurações de Notificações */}
                <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🔔</span>
                    Notificações
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Alertas de Inspeção</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Alertas de Estado Crítico</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Relatórios Automáticos</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configurações de Relatórios */}
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📊</span>
                    Configurações de Relatórios
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Formato de Relatório
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="word">Word</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequência de Relatórios
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="semanal">Semanal</option>
                        <option value="mensal">Mensal</option>
                        <option value="trimestral">Trimestral</option>
                        <option value="semestral">Semestral</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destinatários (emails)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="email1@exemplo.com, email2@exemplo.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Configurações de Backup */}
                <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">💾</span>
                    Backup e Sincronização
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Backup Automático</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequência de Backup
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="diario">Diário</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensal">Mensal</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Sincronização em Tempo Real</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4 mt-8">
              <button className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200">
                Cancelar
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2">
                <Save className="h-5 w-5" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
