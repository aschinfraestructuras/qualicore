import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Settings, 
  Check, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  Info,
  ExternalLink,
  List,
  Table
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  calibracoesNotificacoesService, 
  CalibracaoNotificacao, 
  CalibracoesNotificacoesConfig 
} from '../lib/calibracoes-notificacoes-simple';

interface CalibracoesNotificacoesProps {
  onViewDetails?: (tipo: string, id: string) => void;
}

export const CalibracoesNotificacoes: React.FC<CalibracoesNotificacoesProps> = ({ 
  onViewDetails 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [notificacoes, setNotificacoes] = useState<CalibracaoNotificacao[]>([]);
  const [config, setConfig] = useState<CalibracoesNotificacoesConfig>(
    calibracoesNotificacoesService.getConfig()
  );
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  useEffect(() => {
    loadNotificacoes();
    
    // Atualizar notificações periodicamente
    const interval = setInterval(loadNotificacoes, 30000); // 30 segundos
    
    return () => clearInterval(interval);
  }, []);

  const loadNotificacoes = () => {
    setNotificacoes(calibracoesNotificacoesService.getNotificacoes());
  };

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida);
  const estatisticas = calibracoesNotificacoesService.getEstatisticas();

  const getNotificacoesFiltradas = () => {
    switch (filter) {
      case 'unread':
        return notificacoes.filter(n => !n.lida);
      case 'critical':
        return notificacoes.filter(n => n.prioridade === 'CRITICA' || n.prioridade === 'ALTA');
      default:
        return notificacoes;
    }
  };

  const marcarComoLida = (id: string) => {
    calibracoesNotificacoesService.marcarComoLida(id);
    loadNotificacoes();
  };

  const marcarTodasComoLidas = () => {
    calibracoesNotificacoesService.marcarTodasComoLidas();
    loadNotificacoes();
    toast.success('Todas as notificações marcadas como lidas');
  };

  const eliminarNotificacao = (id: string) => {
    calibracoesNotificacoesService.eliminarNotificacao(id);
    loadNotificacoes();
    toast.success('Notificação eliminada');
  };

  const atualizarConfig = (novaConfig: Partial<CalibracoesNotificacoesConfig>) => {
    const configAtualizada = { ...config, ...novaConfig };
    setConfig(configAtualizada);
    calibracoesNotificacoesService.atualizarConfig(configAtualizada);
    toast.success('Configuração atualizada');
  };

  const verificarManual = async () => {
    try {
      await calibracoesNotificacoesService.verificarManual();
      loadNotificacoes();
      toast.success('Verificação manual concluída');
    } catch (error) {
      toast.error('Erro na verificação manual');
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'CRITICA': return 'text-red-600 bg-red-100';
      case 'ALTA': return 'text-orange-600 bg-orange-100';
      case 'MEDIA': return 'text-yellow-600 bg-yellow-100';
      case 'BAIXA': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'CALIBRACAO_VENCIDA':
      case 'EQUIPAMENTO_CRITICO':
        return <AlertTriangle className="w-4 h-4" />;
      case 'CALIBRACAO_PROXIMA':
      case 'AUDITORIA_PROXIMA':
        return <Clock className="w-4 h-4" />;
      case 'MANUTENCAO_PENDENTE':
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const handleNotificacaoAction = (notificacao: CalibracaoNotificacao) => {
    if (notificacao.acao && onViewDetails) {
      // Determinar o tipo baseado na notificação
      let tipo = 'equipamentos';
      if (notificacao.calibracao_id) tipo = 'calibracoes';
      if (notificacao.manutencao_id) tipo = 'manutencoes';
      
      onViewDetails(tipo, notificacao.equipamento_id || '');
      setShowDropdown(false);
    }
  };

  const handleDetails = (notificacao: CalibracaoNotificacao) => {
    if (notificacao.dados) {
      toast.success(`Detalhes: ${notificacao.titulo}`, {
        duration: 3000
      });
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {notificacoesNaoLidas.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notificacoesNaoLidas.length > 99 ? '99+' : notificacoesNaoLidas.length}
          </span>
        )}
      </button>

      {/* Dropdown de Notificações */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Notificações</h3>
                {notificacoesNaoLidas.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {notificacoesNaoLidas.length}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowConfig(!showConfig)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Configurações */}
            <AnimatePresence>
              {showConfig && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-gray-200 p-4 bg-gray-50"
                >
                  <h4 className="font-medium text-gray-900 mb-3">Configurações</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sistema Ativo</span>
                      <button
                        onClick={() => atualizarConfig({ ativo: !config.ativo })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          config.ativo ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            config.ativo ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Notificações In-App</span>
                      <button
                        onClick={() => atualizarConfig({ inApp: !config.inApp })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          config.inApp ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            config.inApp ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <button
                      onClick={verificarManual}
                      className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Verificar Manualmente
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filtros */}
            <div className="flex items-center space-x-2 p-3 border-b border-gray-200">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Todas ({notificacoes.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === 'unread' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Não Lidas ({notificacoesNaoLidas.length})
              </button>
              <button
                onClick={() => setFilter('critical')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === 'critical' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Críticas ({estatisticas.porPrioridade.CRITICA + estatisticas.porPrioridade.ALTA})
              </button>
            </div>

            {/* Lista de Notificações */}
            <div className="max-h-96 overflow-y-auto">
              {getNotificacoesFiltradas().length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {getNotificacoesFiltradas().map((notificacao) => (
                    <motion.div
                      key={notificacao.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notificacao.lida ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getTipoIcon(notificacao.tipo)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium ${
                              !notificacao.lida ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {notificacao.titulo}
                            </h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPrioridadeColor(notificacao.prioridade)}`}>
                              {notificacao.prioridade}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notificacao.mensagem}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {new Date(notificacao.data_criacao).toLocaleString('pt-PT')}
                            </span>
                            <div className="flex items-center space-x-2">
                              {notificacao.acao && (
                                <button
                                  onClick={() => handleNotificacaoAction(notificacao)}
                                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                                >
                                  <Table className="h-3 w-3" />
                                  <span>{notificacao.acao}</span>
                                </button>
                              )}
                              {notificacao.dados && (
                                <button
                                  onClick={() => handleDetails(notificacao)}
                                  className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800"
                                >
                                  <Info className="h-3 w-3" />
                                  <span>Detalhes</span>
                                </button>
                              )}
                              {!notificacao.lida && (
                                <button
                                  onClick={() => marcarComoLida(notificacao.id)}
                                  className="text-xs text-green-600 hover:text-green-800"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                onClick={() => eliminarNotificacao(notificacao.id)}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notificacoesNaoLidas.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={marcarTodasComoLidas}
                  className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Marcar Todas como Lidas
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
