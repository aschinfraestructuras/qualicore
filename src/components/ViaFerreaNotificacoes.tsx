import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellRing,
  X,
  Eye,
  EyeOff,
  Settings,
  AlertTriangle,
  Clock,
  Shield,
  Wrench,
  FileText,
  CheckCircle,
  Filter,
  MoreVertical,
  Trash2,
  MarkAsUnread,
  ExternalLink,
  Train,
  MapPin,
  Calendar,
  Zap,
  TrendingDown,
  Ruler,
  Activity
} from 'lucide-react';
import {
  viaFerreaNotificacoesService,
  ViaFerreaNotificacao,
  ViaFerreaNotificacoesConfig
} from '../lib/via-ferrea-notificacoes';
import toast from 'react-hot-toast';

interface ViaFerreaNotificacoesProps {
  trilhos: any[];
  travessas: any[];
  inspecoes: any[];
}

const NOTIFICATION_ICONS = {
  inspecao_vencida: Clock,
  inspecao_proxima: Calendar,
  elemento_critico: AlertTriangle,
  manutencao_urgente: Wrench,
  tensao_alta: Zap,
  desgaste_excessivo: TrendingDown,
  geometria_fora_padrao: Ruler,
  sistema_alerta: Shield,
  relatorio_disponivel: FileText,
  nova_inspecao: CheckCircle
};

const PRIORITY_COLORS = {
  baixa: 'text-gray-500 bg-gray-100',
  media: 'text-blue-500 bg-blue-100',
  alta: 'text-orange-500 bg-orange-100',
  critica: 'text-red-500 bg-red-100'
};

const CATEGORY_COLORS = {
  inspecao: 'bg-blue-50 border-blue-200',
  manutencao: 'bg-orange-50 border-orange-200',
  seguranca: 'bg-red-50 border-red-200',
  qualidade: 'bg-green-50 border-green-200',
  sistema: 'bg-purple-50 border-purple-200'
};

export function ViaFerreaNotificacoes({ trilhos, travessas, inspecoes }: ViaFerreaNotificacoesProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [notificacoes, setNotificacoes] = useState<ViaFerreaNotificacao[]>([]);
  const [config, setConfig] = useState<ViaFerreaNotificacoesConfig>(viaFerreaNotificacoesService.getConfig());
  const [filtro, setFiltro] = useState<'todas' | 'nao_lidas' | 'criticas'>('nao_lidas');

  useEffect(() => {
    // Carregar notificações iniciais
    setNotificacoes(viaFerreaNotificacoesService.getNotificacoes());

    // Iniciar verificações periódicas
    if (config.ativo) {
      viaFerreaNotificacoesService.startPeriodicChecks(trilhos, travessas, inspecoes);
    }

    // Atualizar notificações a cada 30 segundos
    const interval = setInterval(() => {
      setNotificacoes(viaFerreaNotificacoesService.getNotificacoes());
    }, 30000);

    return () => {
      clearInterval(interval);
      viaFerreaNotificacoesService.stopPeriodicChecks();
    };
  }, [trilhos, travessas, inspecoes, config.ativo]);

  const notificacaosFiltradas = notificacoes.filter(notificacao => {
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

  const handleMarcarComoLida = (id: string) => {
    viaFerreaNotificacoesService.marcarComoLida(id);
    setNotificacoes(viaFerreaNotificacoesService.getNotificacoes());
  };

  const handleMarcarTodasComoLidas = () => {
    viaFerreaNotificacoesService.marcarTodasComoLidas();
    setNotificacoes(viaFerreaNotificacoesService.getNotificacoes());
    toast.success('Todas as notificações foram marcadas como lidas');
  };

  const handleRemoverNotificacao = (id: string) => {
    viaFerreaNotificacoesService.removerNotificacao(id);
    setNotificacoes(viaFerreaNotificacoesService.getNotificacoes());
    toast.success('Notificação removida');
  };

  const handleUpdateConfig = (novaConfig: Partial<ViaFerreaNotificacoesConfig>) => {
    const configAtualizada = { ...config, ...novaConfig };
    setConfig(configAtualizada);
    viaFerreaNotificacoesService.updateConfig(novaConfig);
    
    if (configAtualizada.ativo) {
      viaFerreaNotificacoesService.startPeriodicChecks(trilhos, travessas, inspecoes);
    } else {
      viaFerreaNotificacoesService.stopPeriodicChecks();
    }
    
    toast.success('Configurações atualizadas');
  };

  const formatarTempo = (data: Date) => {
    const agora = new Date();
    const diff = Math.floor((agora.getTime() - data.getTime()) / 1000);

    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return `${Math.floor(diff / 86400)}d atrás`;
  };

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        {notificacoesNaoLidas.length > 0 ? (
          <BellRing className="h-6 w-6" />
        ) : (
          <Bell className="h-6 w-6" />
        )}
        
        {notificacoesNaoLidas.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notificacoesNaoLidas.length > 9 ? '9+' : notificacoesNaoLidas.length}
          </span>
        )}
      </button>

      {/* Dropdown de Notificações */}
      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Train className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Via Férrea</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowConfig(true)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Configurações"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowDropdown(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Filtros */}
                <div className="flex space-x-1 mt-3">
                  {[
                    { id: 'nao_lidas', label: 'Não Lidas', count: notificacoesNaoLidas.length },
                    { id: 'criticas', label: 'Críticas', count: notificacoes.filter(n => n.prioridade === 'critica').length },
                    { id: 'todas', label: 'Todas', count: notificacoes.length }
                  ].map(opcao => (
                    <button
                      key={opcao.id}
                      onClick={() => setFiltro(opcao.id as any)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filtro === opcao.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {opcao.label} ({opcao.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Ações */}
              {notificacaosFiltradas.length > 0 && (
                <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                  <button
                    onClick={handleMarcarTodasComoLidas}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Marcar todas como lidas
                  </button>
                </div>
              )}

              {/* Lista de Notificações */}
              <div className="max-h-96 overflow-y-auto">
                {notificacaosFiltradas.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>Nenhuma notificação encontrada</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notificacaosFiltradas.map(notificacao => {
                      const IconComponent = NOTIFICATION_ICONS[notificacao.tipo] || Bell;
                      
                      return (
                        <motion.div
                          key={notificacao.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            !notificacao.lida ? 'bg-blue-50' : ''
                          } ${CATEGORY_COLORS[notificacao.categoria] || 'bg-gray-50'}`}
                        >
                          <div className="flex items-start space-x-3">
                            {/* Ícone */}
                            <div className={`p-2 rounded-lg ${PRIORITY_COLORS[notificacao.prioridade]}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>

                            {/* Conteúdo */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {notificacao.titulo}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {notificacao.mensagem}
                                  </p>
                                  
                                  {/* Metadados */}
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                    {notificacao.quilometro && (
                                      <div className="flex items-center space-x-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>KM {notificacao.quilometro}</span>
                                      </div>
                                    )}
                                    <span>{formatarTempo(notificacao.data_criacao)}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${PRIORITY_COLORS[notificacao.prioridade]}`}>
                                      {notificacao.prioridade}
                                    </span>
                                  </div>
                                </div>

                                {/* Ações */}
                                <div className="flex items-center space-x-1">
                                  {!notificacao.lida && (
                                    <button
                                      onClick={() => handleMarcarComoLida(notificacao.id)}
                                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                      title="Marcar como lida"
                                    >
                                      <Eye className="h-3 w-3" />
                                    </button>
                                  )}
                                  
                                  <button
                                    onClick={() => handleRemoverNotificacao(notificacao.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Remover"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  Sistema de notificações da Via Férrea ativo
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de Configurações */}
      <AnimatePresence>
        {showConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Configurações de Notificações</h3>
                  <button
                    onClick={() => setShowConfig(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Sistema Ativo */}
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={config.ativo}
                        onChange={(e) => handleUpdateConfig({ ativo: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900">Ativar sistema de notificações</span>
                    </label>
                  </div>

                  {/* Canais */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Canais de Notificação</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={config.canais.in_app}
                          onChange={(e) => handleUpdateConfig({
                            canais: { ...config.canais, in_app: e.target.checked }
                          })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Notificações in-app</span>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={config.canais.email}
                          onChange={(e) => handleUpdateConfig({
                            canais: { ...config.canais, email: e.target.checked }
                          })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Notificações por email</span>
                      </label>
                      
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={config.canais.push}
                          onChange={(e) => handleUpdateConfig({
                            canais: { ...config.canais, push: e.target.checked }
                          })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Notificações push</span>
                      </label>
                    </div>
                  </div>

                  {/* Tipos de Notificação */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Tipos de Alerta</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {Object.entries(config.tipos).map(([tipo, ativo]) => (
                        <label key={tipo} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={ativo}
                            onChange={(e) => handleUpdateConfig({
                              tipos: { ...config.tipos, [tipo]: e.target.checked }
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {tipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Prioridades */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Prioridades</h4>
                    <div className="space-y-2">
                      {Object.entries(config.prioridades).map(([prioridade, ativo]) => (
                        <label key={prioridade} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={ativo}
                            onChange={(e) => handleUpdateConfig({
                              prioridades: { ...config.prioridades, [prioridade]: e.target.checked }
                            })}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`text-sm px-2 py-1 rounded ${PRIORITY_COLORS[prioridade as keyof typeof PRIORITY_COLORS]}`}>
                            {prioridade.charAt(0).toUpperCase() + prioridade.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Periodicidade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Verificar a cada (minutos)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={config.periodicidade_verificacao}
                      onChange={(e) => handleUpdateConfig({
                        periodicidade_verificacao: parseInt(e.target.value) || 30
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowConfig(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
