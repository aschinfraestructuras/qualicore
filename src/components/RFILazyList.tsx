import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Share2,
  Download,
  FileText,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2
} from 'lucide-react';
import type { RFI } from '@/types';

interface RFILazyListProps {
  rfis: RFI[];
  onEdit: (rfi: RFI) => void;
  onDelete: (id: string) => void;
  onView: (rfi: RFI) => void;
  onShare: (rfi: RFI) => void;
  onDownload: (rfi: RFI) => void;
  loading?: boolean;
  searchTerm?: string;
  filters?: any;
}

const ITEM_HEIGHT = 80; // Altura de cada item da lista
const CONTAINER_HEIGHT = 600; // Altura do container

export const RFILazyList: React.FC<RFILazyListProps> = ({
  rfis,
  onEdit,
  onDelete,
  onView,
  onShare,
  onDownload,
  loading = false,
  searchTerm = '',
  filters = {}
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: keyof RFI;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filtrar e ordenar RFIs
  const filteredAndSortedRFIs = useMemo(() => {
    let filtered = rfis.filter(rfi => {
      const matchesSearch = !searchTerm || 
        rfi.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rfi.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rfi.solicitante?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !filters.status || rfi.status === filters.status;
      const matchesPrioridade = !filters.prioridade || rfi.prioridade === filters.prioridade;
      const matchesSolicitante = !filters.solicitante || rfi.solicitante === filters.solicitante;

      return matchesSearch && matchesStatus && matchesPrioridade && matchesSolicitante;
    });

    // Ordenação
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [rfis, searchTerm, filters, sortConfig]);

  // Toggle item expandido
  const toggleExpanded = useCallback((id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Função de ordenação
  const handleSort = useCallback((key: keyof RFI) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  // Renderizar item da lista
  const renderItem = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const rfi = filteredAndSortedRFIs[index];
    if (!rfi) return null;

    const isExpanded = expandedItems.has(rfi.id);
    const isUrgent = rfi.prioridade === 'urgente';
    const isPending = rfi.status === 'pendente';

    return (
      <motion.div
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`relative group ${
          isUrgent ? 'bg-red-50 border-l-4 border-red-500' :
          isPending ? 'bg-yellow-50 border-l-4 border-yellow-500' :
          'bg-white border-l-4 border-transparent'
        } hover:bg-blue-50 transition-all duration-200`}
      >
        <div className="p-4 border-b border-gray-100">
          {/* Header do Item */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              {/* Ícone de Status */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                rfi.status === 'pendente' ? 'bg-yellow-100 text-yellow-600' :
                rfi.status === 'em_analise' ? 'bg-blue-100 text-blue-600' :
                rfi.status === 'respondido' ? 'bg-green-100 text-green-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {rfi.status === 'pendente' ? <Clock className="h-4 w-4" /> :
                 rfi.status === 'em_analise' ? <HelpCircle className="h-4 w-4" /> :
                 rfi.status === 'respondido' ? <CheckCircle className="h-4 w-4" /> :
                 <FileText className="h-4 w-4" />}
              </div>

              {/* Informações Principais */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {rfi.numero} - {rfi.titulo}
                  </h3>
                  {isUrgent && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                      Urgente
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {rfi.solicitante} → {rfi.destinatario}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {rfi.data_solicitacao}
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onView(rfi)}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                title="Ver detalhes"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onEdit(rfi)}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onShare(rfi)}
                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                title="Partilhar"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDownload(rfi)}
                className="p-1 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(rfi.id)}
                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Botão Expandir */}
            <button
              onClick={() => toggleExpanded(rfi.id)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {/* Conteúdo Expandido */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Descrição</h4>
                      <p className="text-sm text-gray-600">{rfi.descricao}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Detalhes</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Prioridade:</span> {rfi.prioridade}</p>
                        <p><span className="font-medium">Status:</span> {rfi.status}</p>
                        {rfi.data_resposta && (
                          <p><span className="font-medium">Data Resposta:</span> {rfi.data_resposta}</p>
                        )}
                        {rfi.impacto_custo && (
                          <p><span className="font-medium">Impacto Custo:</span> €{rfi.impacto_custo}</p>
                        )}
                        {rfi.impacto_prazo && (
                          <p><span className="font-medium">Impacto Prazo:</span> {rfi.impacto_prazo} dias</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {rfi.resposta && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Resposta</h4>
                      <p className="text-sm text-gray-600">{rfi.resposta}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }, [filteredAndSortedRFIs, expandedItems, onEdit, onDelete, onView, onShare, onDownload, toggleExpanded]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando RFIs...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (filteredAndSortedRFIs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm || Object.keys(filters).some(k => filters[k]) 
              ? 'Nenhum RFI encontrado com os filtros aplicados'
              : 'Nenhum RFI encontrado'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com Estatísticas */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {filteredAndSortedRFIs.length} RFI{filteredAndSortedRFIs.length !== 1 ? 's' : ''} encontrado{filteredAndSortedRFIs.length !== 1 ? 's' : ''}
            </span>
            {filteredAndSortedRFIs.length !== rfis.length && (
              <span className="text-xs text-gray-400">
                (de {rfis.length} total)
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setExpandedItems(new Set())}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Recolher todos
            </button>
            <button
              onClick={() => setExpandedItems(new Set(filteredAndSortedRFIs.map(r => r.id)))}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Expandir todos
            </button>
          </div>
        </div>
      </div>

      {/* Lista Virtualizada */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <List
          height={CONTAINER_HEIGHT}
          itemCount={filteredAndSortedRFIs.length}
          itemSize={ITEM_HEIGHT}
          width="100%"
        >
          {renderItem}
        </List>
      </div>

      {/* Footer com Ações */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Performance otimizada com lazy loading
          </div>
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              Última atualização: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
