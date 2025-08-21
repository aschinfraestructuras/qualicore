import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Tag,
  Calendar,
  Building,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Zap,
  History,
  Lightbulb
} from 'lucide-react';
import { NormasPesquisaService } from '../lib/normas-pesquisa-avancada';
import { NormasAnalyticsService } from '../lib/normas-analytics';
import type { Norma, FiltrosNormas, CategoriaNorma, OrganismoNormativo, StatusNorma, PrioridadeNorma } from '../types/normas';
import {
  CATEGORIAS_NORMAS,
  SUBCATEGORIAS_NORMAS,
  ORGANISMOS_NORMATIVOS
} from '../types/normas';

interface NormasPesquisaAvancadaProps {
  normas: Norma[];
  onResultadosChange: (resultados: Norma[]) => void;
  onLoadingChange: (loading: boolean) => void;
  onSugestoesChange: (sugestoes: string[]) => void;
}

interface FiltrosAvancados {
  categoria?: CategoriaNorma;
  subcategoria?: string;
  organismo?: OrganismoNormativo;
  status?: StatusNorma;
  prioridade?: PrioridadeNorma;
  data_inicio?: string;
  data_fim?: string;
  aplicabilidade?: string;
  tags?: string[];
  texto_livre?: string;
}

export default function NormasPesquisaAvancada({
  normas,
  onResultadosChange,
  onLoadingChange,
  onSugestoesChange
}: NormasPesquisaAvancadaProps) {
  const [query, setQuery] = useState('');
  const [filtros, setFiltros] = useState<FiltrosAvancados>({});
  const [showFiltros, setShowFiltros] = useState(false);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [historico, setHistorico] = useState<string[]>([]);
  const [showHistorico, setShowHistorico] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Carregar histórico
  useEffect(() => {
    const historicoPesquisas = NormasPesquisaService.getHistorico();
    setHistorico(historicoPesquisas);
  }, []);

  // Pesquisa com debounce
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      realizarPesquisa();
    }, 300);

    setDebounceTimer(timer);

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [query, filtros]);

  // Gerar sugestões
  useEffect(() => {
    if (query.length >= 2) {
      gerarSugestoes();
    } else {
      setSugestoes([]);
      onSugestoesChange([]);
    }
  }, [query]);

  const realizarPesquisa = async () => {
    if (!query.trim() && Object.keys(filtros).length === 0) {
      onResultadosChange(normas);
      return;
    }

    setLoading(true);
    onLoadingChange(true);

    try {
      const resultados = await NormasPesquisaService.pesquisar(
        query,
        normas,
        filtros as FiltrosNormas,
        {
          limit: 100,
          includeObsoletas: false,
          priorizarRecentes: true,
          fuzzyMatch: true
        }
      );

      const normasResultado = resultados.map(r => r.norma);
      onResultadosChange(normasResultado);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      onResultadosChange([]);
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  const gerarSugestoes = async () => {
    try {
      const sugestoesData = await NormasPesquisaService.gerarSugestoes(query, normas);
      const sugestoesStrings = sugestoesData.map(s => s.termo);
      setSugestoes(sugestoesStrings);
      onSugestoesChange(sugestoesStrings);
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
    }
  };

  const aplicarFiltro = (campo: keyof FiltrosAvancados, valor: any) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limparFiltros = () => {
    setFiltros({});
    setQuery('');
  };

  const selecionarSugestao = (sugestao: string) => {
    setQuery(sugestao);
    setSugestoes([]);
    onSugestoesChange([]);
  };

  const selecionarHistorico = (termo: string) => {
    setQuery(termo);
    setShowHistorico(false);
  };

  const getFiltrosAtivos = () => {
    return Object.keys(filtros).filter(key => 
      filtros[key as keyof FiltrosAvancados] !== undefined && 
      filtros[key as keyof FiltrosAvancados] !== ''
    ).length;
  };

  return (
    <div className="space-y-4">
      {/* Barra de Pesquisa Principal */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Pesquisar normas por código, título, categoria..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistorico(true)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Botões de ação */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            )}
            
            <button
              onClick={() => setShowHistorico(!showHistorico)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Histórico de pesquisas"
            >
              <History className="h-4 w-4 text-gray-400" />
            </button>
            
            <button
              onClick={() => setShowFiltros(!showFiltros)}
              className={`p-1 rounded flex items-center space-x-1 ${
                getFiltrosAtivos() > 0 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-400'
              }`}
              title="Filtros avançados"
            >
              <Filter className="h-4 w-4" />
              {getFiltrosAtivos() > 0 && (
                <span className="text-xs bg-blue-500 text-white rounded-full px-1.5 py-0.5">
                  {getFiltrosAtivos()}
                </span>
              )}
            </button>
            
            {(query || getFiltrosAtivos() > 0) && (
              <button
                onClick={limparFiltros}
                className="p-1 hover:bg-gray-100 rounded"
                title="Limpar pesquisa"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Histórico de pesquisas */}
        <AnimatePresence>
          {showHistorico && historico.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              <div className="p-2 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-700">Histórico de pesquisas</h3>
              </div>
              {historico.map((termo, index) => (
                <button
                  key={index}
                  onClick={() => selecionarHistorico(termo)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-gray-700 flex items-center space-x-2"
                >
                  <History className="h-3 w-3 text-gray-400" />
                  <span>{termo}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sugestões */}
        <AnimatePresence>
          {sugestoes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              <div className="p-2 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span>Sugestões</span>
                </h3>
              </div>
              {sugestoes.map((sugestao, index) => (
                <button
                  key={index}
                  onClick={() => selecionarSugestao(sugestao)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-gray-700"
                >
                  {sugestao}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filtros Avançados */}
      <AnimatePresence>
        {showFiltros && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Filtros Avançados</h3>
              <button
                onClick={() => setShowFiltros(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={filtros.categoria || ''}
                  onChange={(e) => aplicarFiltro('categoria', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as categorias</option>
                  {Object.entries(CATEGORIAS_NORMAS).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              {/* Organismo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organismo
                </label>
                <select
                  value={filtros.organismo || ''}
                  onChange={(e) => aplicarFiltro('organismo', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos os organismos</option>
                  {Object.entries(ORGANISMOS_NORMATIVOS).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filtros.status || ''}
                  onChange={(e) => aplicarFiltro('status', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos os status</option>
                  <option value="ATIVA">Ativa</option>
                  <option value="REVISAO">Em Revisão</option>
                  <option value="OBSOLETA">Obsoleta</option>
                  <option value="SUSPENSA">Suspensa</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>
              </div>

              {/* Prioridade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <select
                  value={filtros.prioridade || ''}
                  onChange={(e) => aplicarFiltro('prioridade', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as prioridades</option>
                  <option value="CRITICA">Crítica</option>
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Média</option>
                  <option value="BAIXA">Baixa</option>
                  <option value="INFORMATIVA">Informativa</option>
                </select>
              </div>

              {/* Data de Início */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={filtros.data_inicio || ''}
                  onChange={(e) => aplicarFiltro('data_inicio', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Data de Fim */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Fim
                </label>
                <input
                  type="date"
                  value={filtros.data_fim || ''}
                  onChange={(e) => aplicarFiltro('data_fim', e.target.value || undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {getFiltrosAtivos()} filtro(s) ativo(s)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={limparFiltros}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Limpar
                </button>
                <button
                  onClick={() => setShowFiltros(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estatísticas Rápidas */}
      {getFiltrosAtivos() > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <Zap className="h-4 w-4" />
            <span>Filtros ativos: {getFiltrosAtivos()}</span>
            <button
              onClick={limparFiltros}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
