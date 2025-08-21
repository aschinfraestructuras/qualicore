import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BellOff, 
  Settings, 
  Check, 
  X, 
  Trash2, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock,
  Filter,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Monitor,
  ExternalLink,
  List,
  Table
} from 'lucide-react';
import { 
  normasNotificacoesService, 
  type Notificacao, 
  type TipoNotificacao, 
  type PrioridadeNotificacao,
  type ConfiguracaoNotificacoes 
} from '../lib/normas-notificacoes';
import toast from 'react-hot-toast';

interface NormasNotificacoesProps {
  className?: string;
}

export const NormasNotificacoes: React.FC<NormasNotificacoesProps> = ({ className = '' }) => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoNotificacoes>(
    normasNotificacoesService.getConfiguracao()
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState<'todas' | 'naoLidas' | 'criticas'>('todas');
  const [contagemNaoLidas, setContagemNaoLidas] = useState(0);

  // Carregar notificações e configurar atualizações
  useEffect(() => {
    carregarNotificacoes();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(carregarNotificacoes, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const carregarNotificacoes = () => {
    const novasNotificacoes = normasNotificacoesService.getNotificacoes();
    const naoLidas = normasNotificacoesService.getContagemNaoLidas();
    
    setNotificacoes(novasNotificacoes);
    setContagemNaoLidas(naoLidas);
  };

  const aplicarFiltros = (): Notificacao[] => {
    switch (filtroAtivo) {
      case 'naoLidas':
        return notificacoes.filter(n => !n.lida);
      case 'criticas':
        return notificacoes.filter(n => n.prioridade === 'CRITICA' || n.prioridade === 'ALTA');
      default:
        return notificacoes;
    }
  };

  const marcarComoLida = (id: string) => {
    normasNotificacoesService.marcarComoLida(id);
    carregarNotificacoes();
    toast.success('Notificação marcada como lida');
  };

  const marcarTodasComoLidas = () => {
    normasNotificacoesService.marcarTodasComoLidas();
    carregarNotificacoes();
    toast.success('Todas as notificações marcadas como lidas');
  };

  const excluirNotificacao = (id: string) => {
    normasNotificacoesService.excluirNotificacao(id);
    carregarNotificacoes();
    toast.success('Notificação excluída');
  };

  const limparAntigas = () => {
    normasNotificacoesService.limparNotificacoesAntigas();
    carregarNotificacoes();
    toast.success('Notificações antigas removidas');
  };

  const atualizarConfiguracao = (novaConfig: Partial<ConfiguracaoNotificacoes>) => {
    const configAtualizada = { ...configuracao, ...novaConfig };
    normasNotificacoesService.atualizarConfiguracao(configAtualizada);
    setConfiguracao(configAtualizada);
    toast.success('Configuração atualizada');
  };

  const ativarSistema = (ativo: boolean) => {
    normasNotificacoesService.ativarSistema(ativo);
    setConfiguracao(prev => ({ ...prev, ativo }));
    toast.success(ativo ? 'Sistema de notificações ativado' : 'Sistema de notificações desativado');
  };

  const getIconePrioridade = (prioridade: PrioridadeNotificacao) => {
    switch (prioridade) {
      case 'CRITICA':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'ALTA':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'MEDIA':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'BAIXA':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCorPrioridade = (prioridade: PrioridadeNotificacao): string => {
    switch (prioridade) {
      case 'CRITICA': return 'border-red-200 bg-red-50';
      case 'ALTA': return 'border-orange-200 bg-orange-50';
      case 'MEDIA': return 'border-blue-200 bg-blue-50';
      case 'BAIXA': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const formatarData = (data: Date): string => {
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

  const notificacoesFiltradas = aplicarFiltros();

  return (
    <div className={`relative ${className}`}>
      {/* Botão principal */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {configuracao.ativo ? (
          <Bell className="w-5 h-5 text-gray-600" />
        ) : (
          <BellOff className="w-5 h-5 text-gray-400" />
        )}
        
        {/* Badge de notificações não lidas */}
        {contagemNaoLidas > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {contagemNaoLidas > 99 ? '99+' : contagemNaoLidas}
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown de notificações */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex items-center space-x-2 mt-3">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="flex space-x-1">
                  {[
                    { key: 'todas', label: 'Todas' },
                    { key: 'naoLidas', label: 'Não lidas' },
                    { key: 'criticas', label: 'Críticas' }
                  ].map(filtro => (
                    <button
                      key={filtro.key}
                      onClick={() => setFiltroAtivo(filtro.key as any)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        filtroAtivo === filtro.key
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filtro.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Configurações */}
            <AnimatePresence>
              {showConfig && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-gray-200 bg-gray-50"
                >
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Sistema Ativo</span>
                      <button
                        onClick={() => ativarSistema(!configuracao.ativo)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          configuracao.ativo ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            configuracao.ativo ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Na aplicação</span>
                        <input
                          type="checkbox"
                          checked={configuracao.inApp}
                          onChange={(e) => atualizarConfiguracao({ inApp: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Email</span>
                        <input
                          type="checkbox"
                          checked={configuracao.email}
                          onChange={(e) => atualizarConfiguracao({ email: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Push</span>
                        <input
                          type="checkbox"
                          checked={configuracao.push}
                          onChange={(e) => atualizarConfiguracao({ push: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lista de notificações */}
            <div className="max-h-96 overflow-y-auto">
              {notificacoesFiltradas.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhuma notificação encontrada</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notificacoesFiltradas.map((notificacao) => (
                    <motion.div
                      key={notificacao.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border-l-4 ${getCorPrioridade(notificacao.prioridade)} ${
                        !notificacao.lida ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIconePrioridade(notificacao.prioridade)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              !notificacao.lida ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {notificacao.titulo}
                            </p>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500">
                                {formatarData(notificacao.dataCriacao)}
                              </span>
                              {!notificacao.lida && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">
                            {notificacao.mensagem}
                          </p>
                          
                          {notificacao.detalhes && (
                            <p className="text-xs text-gray-500 mt-1">
                              {notificacao.detalhes}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-2 mt-3">
                            {notificacao.acao && (
                              <button
                                onClick={() => {
                                  if (notificacao.url) {
                                    window.location.href = notificacao.url;
                                  }
                                  marcarComoLida(notificacao.id);
                                  setShowDropdown(false);
                                }}
                                className="flex items-center space-x-1 text-xs bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors"
                              >
                                <Table className="w-3 h-3" />
                                <span>{notificacao.acao}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}
                            
                            {/* Botão adicional para ver detalhes */}
                            {notificacao.dados && (
                              <button
                                onClick={() => {
                                  // Mostrar toast com mais detalhes
                                  const dados = notificacao.dados;
                                  if (dados.normasVencidas && Array.isArray(dados.normasVencidas)) {
                                    toast(`${dados.normasVencidas.length} norma(s) vencida(s) encontrada(s)`, {
                                      icon: '📋',
                                      duration: 3000
                                    });
                                  } else if (dados.normasCriticas && Array.isArray(dados.normasCriticas)) {
                                    toast(`${dados.normasCriticas.length} norma(s) crítica(s) encontrada(s)`, {
                                      icon: '⚠️',
                                      duration: 3000
                                    });
                                  } else if (dados.diasAteVencimento) {
                                    toast(`Vence em ${dados.diasAteVencimento} dias`, {
                                      icon: '📅',
                                      duration: 3000
                                    });
                                  }
                                }}
                                className="flex items-center space-x-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                              >
                                <Info className="w-3 h-3" />
                                <span>Detalhes</span>
                              </button>
                            )}
                            
                            {!notificacao.lida ? (
                              <button
                                onClick={() => marcarComoLida(notificacao.id)}
                                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                            ) : (
                              <button
                                onClick={() => marcarComoLida(notificacao.id)}
                                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                <EyeOff className="w-3 h-3" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => excluirNotificacao(notificacao.id)}
                              className="text-xs text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notificacoesFiltradas.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={marcarTodasComoLidas}
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Marcar todas como lidas
                  </button>
                  <button
                    onClick={limparAntigas}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Limpar antigas
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para fechar */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};
