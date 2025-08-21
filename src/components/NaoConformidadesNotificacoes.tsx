import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Settings,
  X,
  Check,
  Trash2,
  ExternalLink,
  List,
  Table,
  Info,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  MapPin,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Mail,
  Smartphone
} from 'lucide-react';
import { naoConformidadesNotificacoesService, NaoConformidadeNotificacao } from '../lib/nao-conformidades-notificacoes';
import toast from 'react-hot-toast';

interface NaoConformidadesNotificacoesProps {
  onViewDetails?: (nc: any) => void;
}

export function NaoConformidadesNotificacoes({ onViewDetails }: NaoConformidadesNotificacoesProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [notificacoes, setNotificacoes] = useState<NaoConformidadeNotificacao[]>([]);
  const [config, setConfig] = useState(naoConformidadesNotificacoesService.getConfig());
  const [filtro, setFiltro] = useState<'todas' | 'nao_lidas' | 'criticas'>('todas');

  useEffect(() => {
    const atualizarNotificacoes = () => {
      setNotificacoes(naoConformidadesNotificacoesService.getNotificacoes());
    };

    // Atualizar inicialmente
    atualizarNotificacoes();

    // Atualizar a cada 5 segundos
    const interval = setInterval(atualizarNotificacoes, 5000);

    return () => clearInterval(interval);
  }, []);

  const notificacoesFiltradas = notificacoes.filter(notificacao => {
    switch (filtro) {
      case 'nao_lidas':
        return !notificacao.lida;
      case 'criticas':
        return notificacao.prioridade === 'critica';
      default:
        return true;
    }
  });

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida);

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'prazo_vencido':
        return <Clock className="w-4 h-4 text-red-500" />;
      case 'prazo_proximo':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'nc_critica':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'tendencia_aumento':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'custo_alto':
        return <DollarSign className="w-4 h-4 text-red-500" />;
      case 'area_critica':
        return <MapPin className="w-4 h-4 text-orange-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'critica':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'alta':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleMarcarComoLida = (id: string) => {
    naoConformidadesNotificacoesService.marcarComoLida(id);
    setNotificacoes(naoConformidadesNotificacoesService.getNotificacoes());
  };

  const handleMarcarTodasComoLidas = () => {
    naoConformidadesNotificacoesService.marcarTodasComoLidas();
    setNotificacoes(naoConformidadesNotificacoesService.getNotificacoes());
  };

  const handleRemoverNotificacao = (id: string) => {
    naoConformidadesNotificacoesService.removerNotificacao(id);
    setNotificacoes(naoConformidadesNotificacoesService.getNotificacoes());
  };

  const handleLimparTodas = () => {
    naoConformidadesNotificacoesService.limparNotificacoes();
    setNotificacoes(naoConformidadesNotificacoesService.getNotificacoes());
  };

  const handleAcao = (notificacao: NaoConformidadeNotificacao) => {
    if (notificacao.acao) {
      // Aqui seria implementada a navegação para a ação
      toast.success(`Navegando para: ${notificacao.acao}`);
    }
    
    if (notificacao.dados && onViewDetails) {
      // Se houver dados específicos, mostrar detalhes
      toast.success('Mostrando detalhes da notificação');
    }
    
    setShowDropdown(false);
  };

  const handleConfigChange = (key: keyof typeof config, value: any) => {
    const novaConfig = { ...config, [key]: value };
    setConfig(novaConfig);
    naoConformidadesNotificacoesService.atualizarConfig(novaConfig);
  };

  const formatarData = (data: Date) => {
    const agora = new Date();
    const diff = agora.getTime() - data.getTime();
    const minutos = Math.floor(diff / (1000 * 60));
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutos < 1) return 'Agora';
    if (minutos < 60) return `${minutos}m atrás`;
    if (horas < 24) return `${horas}h atrás`;
    if (dias < 7) return `${dias}d atrás`;
    return data.toLocaleDateString('pt-PT');
  };

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {notificacoesNaoLidas.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {notificacoesNaoLidas.length > 9 ? '9+' : notificacoesNaoLidas.length}
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
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
                {notificacoesNaoLidas.length > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {notificacoesNaoLidas.length} nova(s)
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setShowConfig(!showConfig)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  title="Configurações"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                >
                  <X className="w-4 h-4" />
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
                  <h4 className="text-xs font-semibold text-gray-700 mb-3">Configurações</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Sistema ativo</span>
                      <button
                        onClick={() => handleConfigChange('ativo', !config.ativo)}
                        className={`w-8 h-4 rounded-full transition-colors ${
                          config.ativo ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          config.ativo ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Notificações in-app</span>
                      <button
                        onClick={() => handleConfigChange('inApp', !config.inApp)}
                        className={`w-8 h-4 rounded-full transition-colors ${
                          config.inApp ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          config.inApp ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Email</span>
                      <button
                        onClick={() => handleConfigChange('email', !config.email)}
                        className={`w-8 h-4 rounded-full transition-colors ${
                          config.email ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          config.email ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Push</span>
                      <button
                        onClick={() => handleConfigChange('push', !config.push)}
                        className={`w-8 h-4 rounded-full transition-colors ${
                          config.push ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          config.push ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filtros */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <div className="flex space-x-1">
                {[
                  { key: 'todas', label: 'Todas', count: notificacoes.length },
                  { key: 'nao_lidas', label: 'Não lidas', count: notificacoesNaoLidas.length },
                  { key: 'criticas', label: 'Críticas', count: notificacoes.filter(n => n.prioridade === 'critica').length }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFiltro(key as any)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      filtro === key
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
              
              {notificacoesNaoLidas.length > 0 && (
                <button
                  onClick={handleMarcarTodasComoLidas}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>

            {/* Lista de Notificações */}
            <div className="max-h-96 overflow-y-auto">
              {notificacoesFiltradas.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {notificacoesFiltradas.map((notificacao) => (
                    <motion.div
                      key={notificacao.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notificacao.lida ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notificacao.tipo)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notificacao.lida ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notificacao.titulo}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notificacao.mensagem}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className={`px-2 py-1 text-xs rounded-full border ${getPrioridadeColor(notificacao.prioridade)}`}>
                                  {notificacao.prioridade}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {formatarData(notificacao.data_criacao)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {notificacao.acao && (
                                <button
                                  onClick={() => handleAcao(notificacao)}
                                  className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                  title="Ver detalhes"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              )}
                              
                              {notificacao.dados && (
                                <button
                                  onClick={() => {
                                    toast.success('Detalhes da notificação', {
                                      description: JSON.stringify(notificacao.dados, null, 2)
                                    });
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                  title="Ver dados"
                                >
                                  <Info className="w-3 h-3" />
                                </button>
                              )}
                              
                              {!notificacao.lida && (
                                <button
                                  onClick={() => handleMarcarComoLida(notificacao.id)}
                                  className="p-1 text-gray-400 hover:text-green-600 rounded"
                                  title="Marcar como lida"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleRemoverNotificacao(notificacao.id)}
                                className="p-1 text-gray-400 hover:text-red-600 rounded"
                                title="Remover"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {filtro === 'todas' ? 'Nenhuma notificação' : 
                     filtro === 'nao_lidas' ? 'Nenhuma notificação não lida' : 
                     'Nenhuma notificação crítica'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notificacoes.length > 0 && (
              <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50">
                <span className="text-xs text-gray-500">
                  {notificacoesFiltradas.length} de {notificacoes.length} notificação(ões)
                </span>
                <button
                  onClick={handleLimparTodas}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Limpar todas
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
