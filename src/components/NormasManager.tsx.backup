import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  Download,
  Tag,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Norma {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  versao: string;
  data_publicacao: string;
  data_entrada_vigor: string;
  status: 'Ativa' | 'Revogada' | 'Em Revisão';
  organismo: string;
  idioma: string;
  url_oficial?: string;
  url_download?: string;
  tags: string[];
  aplicabilidade: string[];
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

interface NormasManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNorma: (norma: Norma) => void;
  selectedNormas?: string[];
  multiple?: boolean;
}

const CATEGORIAS_NORMAS = {
  'Geotecnia': [
    'Ensaios de Solos',
    'Fundações',
    'Taludes e Estabilização',
    'Aterros e Terraplenagem',
    'Sondagens'
  ],
  'Betão': [
    'Ensaios de Betão',
    'Especificações',
    'Execução',
    'Durabilidade',
    'Aditivos'
  ],
  'Aço': [
    'Ensaios de Aço',
    'Estruturas Metálicas',
    'Soldadura',
    'Proteção Anticorrosiva'
  ],
  'Pavimentos': [
    'Ensaios de Pavimentos',
    'Materiais',
    'Execução',
    'Manutenção'
  ],
  'Estruturas': [
    'Dimensionamento',
    'Execução',
    'Inspeção',
    'Manutenção'
  ],
  'Ambiente': [
    'Gestão Ambiental',
    'Resíduos',
    'Emissões',
    'Monitorização'
  ],
  'Segurança': [
    'Segurança na Construção',
    'Equipamentos',
    'Proteção Individual',
    'Planos de Emergência'
  ]
};

const NORMAS_EXEMPLO: Norma[] = [
  {
    id: '1',
    codigo: 'NP EN ISO 17892-12:2018',
    titulo: 'Investigações geotécnicas e ensaios de solos - Ensaios laboratoriais de solos - Parte 12: Determinação dos limites de Atterberg',
    descricao: 'Esta norma especifica métodos para a determinação dos limites de liquidez e plasticidade dos solos.',
    categoria: 'Geotecnia',
    subcategoria: 'Ensaios de Solos',
    versao: '2018',
    data_publicacao: '2018-12-01',
    data_entrada_vigor: '2019-01-01',
    status: 'Ativa',
    organismo: 'IPQ',
    idioma: 'Português',
    url_oficial: 'https://www.ipq.pt/pt/pagina/np-en-iso-17892-12-2018',
    tags: ['solos', 'atterberg', 'liquidez', 'plasticidade'],
    aplicabilidade: ['Fundações', 'Aterros', 'Taludes']
  },
  {
    id: '2',
    codigo: 'NP EN ISO 17892-4:2016',
    titulo: 'Investigações geotécnicas e ensaios de solos - Ensaios laboratoriais de solos - Parte 4: Determinação da distribuição granulométrica das partículas',
    descricao: 'Esta norma especifica métodos para a determinação da distribuição granulométrica das partículas do solo.',
    categoria: 'Geotecnia',
    subcategoria: 'Ensaios de Solos',
    versao: '2016',
    data_publicacao: '2016-11-01',
    data_entrada_vigor: '2017-01-01',
    status: 'Ativa',
    organismo: 'IPQ',
    idioma: 'Português',
    url_oficial: 'https://www.ipq.pt/pt/pagina/np-en-iso-17892-4-2016',
    tags: ['solos', 'granulometria', 'peneiração', 'sedimentação'],
    aplicabilidade: ['Fundações', 'Aterros', 'Materiais']
  },
  {
    id: '3',
    codigo: 'NP EN 206:2013+A1:2016',
    titulo: 'Betão - Especificação, propriedades, produção e conformidade',
    descricao: 'Esta norma especifica requisitos para a especificação, propriedades, produção e conformidade do betão.',
    categoria: 'Betão',
    subcategoria: 'Especificações',
    versao: '2013+A1:2016',
    data_publicacao: '2016-06-01',
    data_entrada_vigor: '2016-07-01',
    status: 'Ativa',
    organismo: 'IPQ',
    idioma: 'Português',
    url_oficial: 'https://www.ipq.pt/pt/pagina/np-en-206-2013-a1-2016',
    tags: ['betão', 'especificação', 'propriedades', 'conformidade'],
    aplicabilidade: ['Estruturas', 'Fundações', 'Pavimentos']
  },
  {
    id: '4',
    codigo: 'NP EN 1992-1-1:2010',
    titulo: 'Eurocódigo 2: Dimensionamento de estruturas de betão - Parte 1-1: Regras gerais e regras para edifícios',
    descricao: 'Esta norma fornece regras para o dimensionamento de estruturas de betão armado e pré-esforçado.',
    categoria: 'Estruturas',
    subcategoria: 'Dimensionamento',
    versao: '2010',
    data_publicacao: '2010-12-01',
    data_entrada_vigor: '2011-01-01',
    status: 'Ativa',
    organismo: 'IPQ',
    idioma: 'Português',
    url_oficial: 'https://www.ipq.pt/pt/pagina/np-en-1992-1-1-2010',
    tags: ['eurocódigo', 'betão', 'dimensionamento', 'estruturas'],
    aplicabilidade: ['Edifícios', 'Pontes', 'Estruturas Especiais']
  },
  {
    id: '5',
    codigo: 'NP EN 1997-1:2010',
    titulo: 'Eurocódigo 7: Dimensionamento geotécnico - Parte 1: Regras gerais',
    descricao: 'Esta norma fornece regras para o dimensionamento geotécnico de estruturas.',
    categoria: 'Geotecnia',
    subcategoria: 'Fundações',
    versao: '2010',
    data_publicacao: '2010-12-01',
    data_entrada_vigor: '2011-01-01',
    status: 'Ativa',
    organismo: 'IPQ',
    idioma: 'Português',
    url_oficial: 'https://www.ipq.pt/pt/pagina/np-en-1997-1-2010',
    tags: ['eurocódigo', 'geotecnia', 'fundações', 'dimensionamento'],
    aplicabilidade: ['Fundações', 'Taludes', 'Aterros']
  }
];

export default function NormasManager({ 
  isOpen, 
  onClose, 
  onSelectNorma, 
  selectedNormas = [],
  multiple = false 
}: NormasManagerProps) {
  const [normas, setNormas] = useState<Norma[]>(NORMAS_EXEMPLO);
  const [filteredNormas, setFilteredNormas] = useState<Norma[]>(NORMAS_EXEMPLO);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedSubcategoria, setSelectedSubcategoria] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar normas
  useEffect(() => {
    let filtered = normas;

    if (searchTerm) {
      filtered = filtered.filter(norma =>
        norma.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        norma.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        norma.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategoria) {
      filtered = filtered.filter(norma => norma.categoria === selectedCategoria);
    }

    if (selectedSubcategoria) {
      filtered = filtered.filter(norma => norma.subcategoria === selectedSubcategoria);
    }

    if (selectedStatus) {
      filtered = filtered.filter(norma => norma.status === selectedStatus);
    }

    setFilteredNormas(filtered);
  }, [normas, searchTerm, selectedCategoria, selectedSubcategoria, selectedStatus]);

  const handleSelectNorma = (norma: Norma) => {
    if (multiple) {
      // Modo múltiplo - adicionar/remover da seleção
      const isSelected = selectedNormas.includes(norma.codigo);
      if (isSelected) {
        onSelectNorma(norma); // Remove
      } else {
        onSelectNorma(norma); // Add
      }
    } else {
      // Modo único - selecionar e fechar
      onSelectNorma(norma);
      onClose();
    }
  };

  const isNormaSelected = (norma: Norma) => {
    return selectedNormas.includes(norma.codigo);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativa': return 'text-green-600 bg-green-100';
      case 'Revogada': return 'text-red-600 bg-red-100';
      case 'Em Revisão': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativa': return <CheckCircle className="w-4 h-4" />;
      case 'Revogada': return <AlertCircle className="w-4 h-4" />;
      case 'Em Revisão': return <Edit className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Gestor de Normas</h2>
                <p className="text-blue-100">Selecionar normas de referência</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <span className="sr-only">Fechar</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Pesquisar normas por código, título ou tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={selectedCategoria}
                    onChange={(e) => {
                      setSelectedCategoria(e.target.value);
                      setSelectedSubcategoria('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas as categorias</option>
                    {Object.keys(CATEGORIAS_NORMAS).map(categoria => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategoria
                  </label>
                  <select
                    value={selectedSubcategoria}
                    onChange={(e) => setSelectedSubcategoria(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!selectedCategoria}
                  >
                    <option value="">Todas as subcategorias</option>
                    {selectedCategoria && CATEGORIAS_NORMAS[selectedCategoria as keyof typeof CATEGORIAS_NORMAS]?.map(subcategoria => (
                      <option key={subcategoria} value={subcategoria}>{subcategoria}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos os status</option>
                    <option value="Ativa">Ativa</option>
                    <option value="Em Revisão">Em Revisão</option>
                    <option value="Revogada">Revogada</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Normas List */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          <div className="p-6">
            <div className="grid gap-4">
              {filteredNormas.map((norma) => (
                <motion.div
                  key={norma.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isNormaSelected(norma) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectNorma(norma)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {norma.codigo}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(norma.status)}`}>
                          {getStatusIcon(norma.status)}
                          <span>{norma.status}</span>
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-2">{norma.titulo}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center space-x-1">
                          <Tag className="w-4 h-4" />
                          <span>{norma.categoria} → {norma.subcategoria}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>v{norma.versao}</span>
                        </span>
                        <span>{norma.organismo}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {norma.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {norma.url_oficial && (
                        <a
                          href={norma.url_oficial}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Ver norma oficial"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      
                      {isNormaSelected(norma) && (
                        <div className="p-2 text-blue-600">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredNormas.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma norma encontrada
                </h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros ou termos de pesquisa
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredNormas.length} norma{filteredNormas.length !== 1 ? 's' : ''} encontrada{filteredNormas.length !== 1 ? 's' : ''}
              {selectedNormas.length > 0 && (
                <span className="ml-2 text-blue-600">
                  • {selectedNormas.length} selecionada{selectedNormas.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              
              {multiple && selectedNormas.length > 0 && (
                <button
                  onClick={() => {
                    // Confirmar seleção múltipla
                    onClose();
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Confirmar ({selectedNormas.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
