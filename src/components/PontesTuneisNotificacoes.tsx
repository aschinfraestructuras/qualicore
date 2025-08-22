import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellOff,
  AlertTriangle,
  Shield,
  Clock,
  Settings,
  X,
  Check,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  Filter,
  Search,
  Building,
  Mountain,
  Gauge,
  Activity,
  Wrench,
  Eye,
  ExternalLink,
  RefreshCw,
  Download,
  MoreVertical,
  Zap,
  Target,
  GitBranch,
  Construction
} from 'lucide-react';
import {
  pontesTuneisNotificacoesService,
  PontesTuneisNotificacao,
  PontesTuneisNotificacaoTipo,
  PontesTuneisNotificacoesConfig
} from '../lib/pontes-tuneis-notificacoes';
import toast from 'react-hot-toast';

interface PontesTuneisNotificacoesProps {
  className?: string;
  onNotificationClick?: (notificacao: PontesTuneisNotificacao) => void;
}

export default function PontesTuneisNotificacoes({ 
  className = "",
  onNotificationClick 
}: PontesTuneisNotificacoesProps) {
  const [notificacoes, setNotificacoes] = useState<PontesTuneisNotificacao[]>([]);
  const [config, setConfig] = useState<PontesTuneisNotificacoesConfig | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [filtro, setFiltro] = useState<{
    busca: string;
    prioridade: string;
    categoria: string;
    lida: string;
  }>({
    busca: '',
    prioridade: '',
    categoria: '',
    lida: ''
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Atualizar a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setNotificacoes(pontesTuneisNotificacoesService.getNotificacoes());
    setConfig(pontesTuneisNotificacoesService.getConfig());
  };

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida);
  const estatisticas = pontesTuneisNotificacoesService.getEstatisticas();

  // Filtrar notificações
  const notificacoesFiltradas = notificacoes.filter(notificacao => {
    const matchBusca = !filtro.busca || 
      notificacao.titulo.toLowerCase().includes(filtro.busca.toLowerCase()) ||
      notificacao.mensagem.toLowerCase().includes(filtro.busca.toLowerCase());
    
    const matchPrioridade = !filtro.prioridade || notificacao.prioridade === filtro.prioridade;
    const matchCategoria = !filtro.categoria || notificacao.categoria === filtro.categoria;
    const matchLida = !filtro.lida || 
      (filtro.lida === 'lida' && notificacao.lida) ||
      (filtro.lida === 'nao_lida' && !notificacao.lida);

    return matchBusca && matchPrioridade && matchCategoria && matchLida;
  });

  const handleMarcarComoLida = (id: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    pontesTuneisNotificacoesService.marcarComoLida(id);
    loadData();
  };

  const handleMarcarTodasComoLidas = () => {
    pontesTuneisNotificacoesService.marcarTodasComoLidas();
    loadData();
    toast.success('Todas as notificações foram marcadas como lidas');
  };

  const handleRemoverNotificacao = (id: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    pontesTuneisNotificacoesService.removerNotificacao(id);
    loadData();
    toast.success('Notificação removida');
  };

  const handleLimparTodas = () => {
    pontesTuneisNotificacoesService.limparNotificacoes();
    loadData();
    setShowDropdown(false);
    toast.success('Todas as notificações foram removidas');
  };

  const handleVerificarArtificialmente = async () => {
    try {
      toast.loading('Verificando estruturas...');
      await pontesTuneisNotificacoesService.verificarArtificialmente();
      loadData();
      toast.dismiss();
      toast.success('Verificação concluída!');
    } catch (error) {
      toast.dismiss();
      toast.error('Erro na verificação');
    }
  };

  const handleNotificationClick = (notificacao: PontesTuneisNotificacao) => {
    if (!notificacao.lida) {
      handleMarcarComoLida(notificacao.id);
    }
    
    if (onNotificationClick) {
      onNotificationClick(notificacao);
    }
    
    setShowDropdown(false);
  };

  const handleUpdateConfig = (novaConfig: Partial<PontesTuneisNotificacoesConfig>) => {
    pontesTuneisNotificacoesService.updateConfig(novaConfig);
    setConfig(pontesTuneisNotificacoesService.getConfig());
    toast.success('Configuração atualizada');
  };

  // Ícones por tipo de notificação
  const getTipoIcon = (tipo: PontesTuneisNotificacaoTipo) => {
    const icons = {
      inspecao_vencida: Clock,
      inspecao_proxima: AlertCircle,
      estrutura_critica: AlertTriangle,
      deformacao_excessiva: Activity,
      sobrecarga_detectada: Gauge,
      fadiga_material: Zap,
      corrosao_avancada: Shield,
      fissura_estrutural: GitBranch,
      manutencao_urgente: Wrench,
      condicoes_meteorologicas: Info,
      vida_util_esgotada: Target,
      sistema_alerta: Bell,
      relatorio_disponivel: Download,
      nova_estrutura: Building,
      atualizacao_normas: RefreshCw
    };
    return icons[tipo] || Info;
  };

  // Cores por prioridade
  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      baixa: 'text-blue-600 bg-blue-100',
      media: 'text-yellow-600 bg-yellow-100',
      alta: 'text-orange-600 bg-orange-100',
      critica: 'text-red-600 bg-red-100'
    };
    return colors[prioridade] || 'text-gray-600 bg-gray-100';
  };

  const NotificationCard = ({ notificacao }: { notificacao: PontesTuneisNotificacao }) => {
    const IconComponent = getTipoIcon(notificacao.tipo);
    const prioridadeColor = getPrioridadeColor(notificacao.prioridade);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
          notificacao.lida 
            ? 'bg-gray-50 border-gray-200' 
            : 'bg-white border-blue-200 shadow-sm'
        }`}
        onClick={() => handleNotificationClick(notificacao)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${prioridadeColor}`}>
              <IconComponent size={16} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-medium ${notificacao.lida ? 'text-gray-700' : 'text-gray-900'}`}>
                  {notificacao.titulo}
                </h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${prioridadeColor}`}>
                  {notificacao.prioridade.toUpperCase()}
                </span>
              </div>
              
              <p className={`text-sm mb-2 ${notificacao.lida ? 'text-gray-500' : 'text-gray-600'}`}>
                {notificacao.mensagem}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  {notificacao.data_criacao.toLocaleDateString('pt-PT')} às{' '}
                  {notificacao.data_criacao.toLocaleTimeString('pt-PT', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                
                {notificacao.estrutura_tipo && (
                  <span className="flex items-center gap-1">
                    {notificacao.estrutura_tipo === 'ponte' ? <Building size={12} /> : <Mountain size={12} />}
                    {notificacao.estrutura_tipo}
                  </span>
                )}
                
                {notificacao.quilometro && (
                  <span>KM {notificacao.quilometro}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {notificacao.acao_requerida && (
              <span className="text-orange-500" title="Ação requerida">
                <AlertTriangle size={14} />
              </span>
            )}
            
            {!notificacao.lida && (
              <button
                onClick={(e) => handleMarcarComoLida(notificacao.id, e)}
                className="text-blue-600 hover:text-blue-800"
                title="Marcar como lida"
              >
                <Check size={14} />
              </button>
            )}
            
            <button
              onClick={(e) => handleRemoverNotificacao(notificacao.id, e)}
              className="text-red-600 hover:text-red-800"
              title="Remover notificação"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Botão principal */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
      >
        <Bell size={20} />
        {notificacoesNaoLidas.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notificacoesNaoLidas.length > 99 ? '99+' : notificacoesNaoLidas.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notificações de Estruturas
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Configurações"
                  >
                    <Settings size={16} />
                  </button>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Estatísticas rápidas */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{estatisticas.nao_lidas}</div>
                  <div className="text-xs text-blue-600">Não lidas</div>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <div className="text-lg font-bold text-red-600">{estatisticas.criticas}</div>
                  <div className="text-xs text-red-600">Críticas</div>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">{estatisticas.com_acao}</div>
                  <div className="text-xs text-orange-600">Com ação</div>
                </div>
              </div>

              {/* Ações rápidas */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarcarTodasComoLidas}
                    className="text-xs text-blue-600 hover:text-blue-800"
                    disabled={notificacoesNaoLidas.length === 0}
                  >
                    Marcar todas como lidas
                  </button>
                  <button
                    onClick={handleVerificarArtificialmente}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    Verificar agora
                  </button>
                </div>
                <button
                  onClick={handleLimparTodas}
                  className="text-xs text-red-600 hover:text-red-800"
                  disabled={notificacoes.length === 0}
                >
                  Limpar todas
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filtro.prioridade}
                  onChange={(e) => setFiltro(prev => ({ ...prev, prioridade: e.target.value }))}
                  className="text-xs px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="">Todas prioridades</option>
                  <option value="critica">Crítica</option>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
                
                <select
                  value={filtro.lida}
                  onChange={(e) => setFiltro(prev => ({ ...prev, lida: e.target.value }))}
                  className="text-xs px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="">Todas</option>
                  <option value="nao_lida">Não lidas</option>
                  <option value="lida">Lidas</option>
                </select>
              </div>
            </div>

            {/* Lista de notificações */}
            <div className="max-h-64 overflow-y-auto">
              {notificacoesFiltradas.length > 0 ? (
                <div className="p-3 space-y-3">
                  <AnimatePresence>
                    {notificacoesFiltradas.slice(0, 10).map(notificacao => (
                      <NotificationCard 
                        key={notificacao.id} 
                        notificacao={notificacao} 
                      />
                    ))}
                  </AnimatePresence>
                  
                  {notificacoesFiltradas.length > 10 && (
                    <div className="text-center py-2">
                      <span className="text-sm text-gray-500">
                        E mais {notificacoesFiltradas.length - 10} notificações...
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Nenhuma notificação encontrada</p>
                </div>
              )}
            </div>

            {/* Configurações (expandidas) */}
            <AnimatePresence>
              {showConfig && config && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-t border-gray-200 bg-gray-50 overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    <h4 className="font-medium text-gray-900">Configurações de Notificação</h4>
                    
                    {/* Toggle geral */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Notificações ativas</span>
                      <button
                        onClick={() => handleUpdateConfig({ ativo: !config.ativo })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          config.ativo ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            config.ativo ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Canais */}
                    <div>
                      <span className="text-sm text-gray-700 block mb-2">Canais ativos:</span>
                      <div className="space-y-1">
                        {Object.entries(config.canais).map(([canal, ativo]) => (
                          <label key={canal} className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={ativo}
                              onChange={(e) => handleUpdateConfig({
                                canais: { ...config.canais, [canal]: e.target.checked }
                              })}
                              className="rounded"
                            />
                            {canal.replace('_', '-').toUpperCase()}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Periodicidade */}
                    <div>
                      <label className="text-sm text-gray-700 block mb-1">
                        Verificar a cada (minutos):
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={config.periodicidade_verificacao}
                        onChange={(e) => handleUpdateConfig({
                          periodicidade_verificacao: parseInt(e.target.value)
                        })}
                        className="w-full text-sm px-2 py-1 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
