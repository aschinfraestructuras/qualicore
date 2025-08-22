import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  Tag,
  Users,
  MapPin,
  Calendar,
  BarChart3,
  FileText,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface PIECardProps {
  pie: {
    id: string;
    titulo: string;
    codigo: string;
    descricao?: string;
    status: string;
    prioridade: string;
    data_planeada?: string;
    responsavel?: string;
    zona?: string;
  };
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
  onShare: (id: string) => void;
}

const PIECard: React.FC<PIECardProps> = ({ pie, onEdit, onView, onDelete, onExport, onShare }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'reprovado': return 'bg-red-100 text-red-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado': return <CheckCircle className="w-4 h-4" />;
      case 'em_andamento': return <Clock className="w-4 h-4" />;
      case 'reprovado': return <XCircle className="w-4 h-4" />;
      case 'concluido': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'urgente': return 'bg-purple-100 text-purple-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'baixa': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{pie.titulo}</h3>
            <p className="text-sm text-gray-600">{pie.codigo}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(pie.status)}`}>
              {getStatusIcon(pie.status)}
              <span className="ml-1">{pie.status.replace('_', ' ')}</span>
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(pie.prioridade)}`}>
              {pie.prioridade}
            </span>
          </div>
        </div>

        {/* Description */}
        {pie.descricao && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pie.descricao}</p>
        )}

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          {pie.responsavel && (
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span>{pie.responsavel}</span>
            </div>
          )}
          {pie.zona && (
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{pie.zona}</span>
            </div>
          )}
          {pie.data_planeada && (
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(pie.data_planeada).toLocaleDateString('pt-PT')}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onView(pie.id)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Visualizar"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(pie.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onExport(pie.id)}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Exportar"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onShare(pie.id)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Partilhar"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(pie.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PontosInspecaoEnsaios: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data para teste
  const mockPies = [
    {
      id: "1",
      titulo: "Inspeção de Betonagem - Pilar P1",
      codigo: "PIE-001",
      descricao: "Inspeção de qualidade da betonagem do pilar P1 da ponte principal",
      status: "em_andamento",
      prioridade: "alta",
      data_planeada: "2024-01-15",
      responsavel: "João Silva",
      zona: "Ponte Principal"
    },
    {
      id: "2",
      titulo: "Controlo de Armaduras - Fundação F2",
      codigo: "PIE-002",
      descricao: "Verificação das armaduras da fundação F2 antes da betonagem",
      status: "aprovado",
      prioridade: "normal",
      data_planeada: "2024-01-10",
      responsavel: "Maria Santos",
      zona: "Fundações"
    },
    {
      id: "3",
      titulo: "Ensaio de Compactação - Aterro A1",
      codigo: "PIE-003",
      descricao: "Ensaio de compactação do aterro A1 para verificar densidade",
      status: "concluido",
      prioridade: "baixa",
      data_planeada: "2024-01-05",
      responsavel: "Carlos Oliveira",
      zona: "Aterros"
    },
    {
      id: "4",
      titulo: "Inspeção de Sinalização - KM 45+200",
      codigo: "PIE-004",
      descricao: "Verificação da sinalização ferroviária no quilómetro 45+200",
      status: "reprovado",
      prioridade: "urgente",
      data_planeada: "2024-01-20",
      responsavel: "Ana Costa",
      zona: "Via Férrea"
    }
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Dados atualizados");
    }, 1000);
  };

  const handleCreatePIE = () => {
    toast.success("Criar novo PIE");
    // navigate("/pie/editor");
  };

  const handleEdit = (id: string) => {
    toast.success(`Editar PIE ${id}`);
    // navigate(`/pie/editor/${id}`);
  };

  const handleView = (id: string) => {
    toast.success(`Visualizar PIE ${id}`);
    // navigate(`/pie/view/${id}`);
  };

  const handleDelete = (id: string) => {
    toast.success(`Eliminar PIE ${id}`);
  };

  const handleExport = (id: string) => {
    toast.success(`Exportar PIE ${id}`);
  };

  const handleShare = (id: string) => {
    toast.success(`Partilhar PIE ${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                PIE - Pontos de Inspeção e Ensaios
              </h1>
              <p className="text-gray-600">
                Gestão de pontos de inspeção e ensaios de qualidade
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreatePIE}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Novo PIE</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Search and View Controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar PIEs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* PIEs Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }
        >
          {mockPies.map((pie, index) => (
            <PIECard
              key={pie.id}
              pie={pie}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
              onExport={handleExport}
              onShare={handleShare}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {mockPies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum PIE encontrado
            </h3>
            <p className="text-gray-600">
              Crie o seu primeiro ponto de inspeção e ensaio
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreatePIE}
              className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg mx-auto hover:bg-blue-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Criar PIE</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PontosInspecaoEnsaios; 
