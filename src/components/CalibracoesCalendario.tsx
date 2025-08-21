import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Wrench,
  Settings,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Bell,
  FileText,
  Shield,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  Equipamento, 
  Calibracao, 
  Manutencao, 
  Inspecao 
} from '../types/calibracoes';

interface CalibracoesCalendarioProps {
  equipamentos: Equipamento[];
  calibracoes: Calibracao[];
  manutencoes: Manutencao[];
  inspecoes: Inspecao[];
  onViewDetails?: (tipo: string, id: string) => void;
  onAddEvent?: (tipo: string) => void;
}

interface CalendarioEvento {
  id: string;
  tipo: 'calibracao' | 'manutencao' | 'inspecao' | 'auditoria';
  titulo: string;
  descricao: string;
  data: Date;
  dataFim?: Date;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  equipamento_id?: string;
  equipamento_nome?: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'atrasada';
  dados: any;
}

export default function CalibracoesCalendario({
  equipamentos,
  calibracoes,
  manutencoes,
  inspecoes,
  onViewDetails,
  onAddEvent
}: CalibracoesCalendarioProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarioEvento | null>(null);
  const [filtros, setFiltros] = useState({
    calibracoes: true,
    manutencoes: true,
    inspecoes: true,
    auditorias: true
  });

  // Gerar eventos do calendário
  const eventos = useMemo(() => {
    const eventosArray: CalendarioEvento[] = [];

    // Adicionar calibrações
    if (filtros.calibracoes) {
      calibracoes.forEach(calibracao => {
        const equipamento = equipamentos.find(e => e.id === calibracao.equipamento_id);
        const dataVencimento = new Date(calibracao.data_proxima_calibracao);
        const hoje = new Date();
        
        eventosArray.push({
          id: `calib_${calibracao.id}`,
          tipo: 'calibracao',
          titulo: `Calibração: ${equipamento?.nome || 'Equipamento'}`,
          descricao: `Calibração do equipamento ${equipamento?.nome} - ${calibracao.laboratorio || 'Laboratório'}`,
          data: dataVencimento,
          prioridade: dataVencimento < hoje ? 'critica' : 
                     dataVencimento.getTime() - hoje.getTime() < 7 * 24 * 60 * 60 * 1000 ? 'alta' :
                     dataVencimento.getTime() - hoje.getTime() < 30 * 24 * 60 * 60 * 1000 ? 'media' : 'baixa',
          equipamento_id: calibracao.equipamento_id,
          equipamento_nome: equipamento?.nome,
          status: dataVencimento < hoje ? 'atrasada' : 'pendente',
          dados: calibracao
        });
      });
    }

    // Adicionar manutenções
    if (filtros.manutencoes) {
      manutencoes.forEach(manutencao => {
        const equipamento = equipamentos.find(e => e.id === manutencao.equipamento_id);
        const dataManutencao = new Date(manutencao.data_manutencao);
        
        eventosArray.push({
          id: `manut_${manutencao.id}`,
          tipo: 'manutencao',
          titulo: `Manutenção: ${equipamento?.nome || 'Equipamento'}`,
          descricao: `Manutenção ${manutencao.tipo} - ${manutencao.tecnico_responsavel || 'Técnico'}`,
          data: dataManutencao,
          dataFim: manutencao.data_conclusao ? new Date(manutencao.data_conclusao) : undefined,
          prioridade: manutencao.prioridade === 'alta' ? 'alta' : 
                     manutencao.prioridade === 'media' ? 'media' : 'baixa',
          equipamento_id: manutencao.equipamento_id,
          equipamento_nome: equipamento?.nome,
          status: manutencao.status === 'concluida' ? 'concluida' : 
                 manutencao.status === 'em_andamento' ? 'em_andamento' : 'pendente',
          dados: manutencao
        });
      });
    }

    // Adicionar inspeções
    if (filtros.inspecoes) {
      inspecoes.forEach(inspecao => {
        const equipamento = equipamentos.find(e => e.id === inspecao.equipamento_id);
        const dataInspecao = new Date(inspecao.data_inspecao);
        
        eventosArray.push({
          id: `insp_${inspecao.id}`,
          tipo: 'inspecao',
          titulo: `Inspeção: ${equipamento?.nome || 'Equipamento'}`,
          descricao: `Inspeção ${inspecao.tipo} - ${inspecao.inspetor || 'Inspetor'}`,
          data: dataInspecao,
          prioridade: inspecao.prioridade === 'alta' ? 'alta' : 
                     inspecao.prioridade === 'media' ? 'media' : 'baixa',
          equipamento_id: inspecao.equipamento_id,
          equipamento_nome: equipamento?.nome,
          status: inspecao.status === 'concluida' ? 'concluida' : 
                 inspecao.status === 'em_andamento' ? 'em_andamento' : 'pendente',
          dados: inspecao
        });
      });
    }

    // Adicionar auditorias (mock data)
    if (filtros.auditorias) {
      const auditoriasMock = [
        {
          id: 'audit_1',
          titulo: 'Auditoria Externa - IPQ',
          data: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
          tipo: 'EXTERNA',
          auditor: 'Dr. João Silva'
        },
        {
          id: 'audit_2',
          titulo: 'Auditoria Interna Mensal',
          data: new Date(currentDate.getFullYear(), currentDate.getMonth(), 28),
          tipo: 'INTERNA',
          auditor: 'Eng. Maria Santos'
        }
      ];

      auditoriasMock.forEach(auditoria => {
        eventosArray.push({
          id: auditoria.id,
          tipo: 'auditoria',
          titulo: auditoria.titulo,
          descricao: `Auditoria ${auditoria.tipo} - ${auditoria.auditor}`,
          data: auditoria.data,
          prioridade: 'media',
          status: 'pendente',
          dados: auditoria
        });
      });
    }

    return eventosArray.sort((a, b) => a.data.getTime() - b.data.getTime());
  }, [equipamentos, calibracoes, manutencoes, inspecoes, filtros, currentDate]);

  // Navegação do calendário
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Obter eventos para uma data específica
  const getEventosParaData = (data: Date) => {
    return eventos.filter(evento => {
      const eventoData = new Date(evento.data);
      return eventoData.getDate() === data.getDate() &&
             eventoData.getMonth() === data.getMonth() &&
             eventoData.getFullYear() === data.getFullYear();
    });
  };

  // Obter cor do evento baseado no tipo e prioridade
  const getEventoColor = (evento: CalendarioEvento) => {
    if (evento.status === 'atrasada') return 'bg-red-500';
    if (evento.status === 'concluida') return 'bg-green-500';
    
    switch (evento.prioridade) {
      case 'critica': return 'bg-red-600';
      case 'alta': return 'bg-orange-500';
      case 'media': return 'bg-yellow-500';
      case 'baixa': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Obter ícone do evento
  const getEventoIcon = (tipo: string) => {
    switch (tipo) {
      case 'calibracao': return <Settings className="w-3 h-3" />;
      case 'manutencao': return <Wrench className="w-3 h-3" />;
      case 'inspecao': return <Eye className="w-3 h-3" />;
      case 'auditoria': return <Shield className="w-3 h-3" />;
      default: return <Calendar className="w-3 h-3" />;
    }
  };

  // Renderizar vista mensal
  const renderMonthView = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Cabeçalho dos dias da semana */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50">
            {day}
          </div>
        ))}
        
        {/* Dias do calendário */}
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          const eventosDia = getEventosParaData(date);
          
          return (
            <div
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`min-h-24 p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                !isCurrentMonth ? 'bg-gray-100 text-gray-400' : ''
              } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              <div className="text-sm font-medium mb-1">{date.getDate()}</div>
              <div className="space-y-1">
                {eventosDia.slice(0, 3).map(evento => (
                  <div
                    key={evento.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(evento);
                      setShowEventModal(true);
                    }}
                    className={`${getEventoColor(evento)} text-white text-xs p-1 rounded truncate flex items-center space-x-1`}
                  >
                    {getEventoIcon(evento.tipo)}
                    <span className="truncate">{evento.titulo.split(':')[1]?.trim() || evento.titulo}</span>
                  </div>
                ))}
                {eventosDia.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{eventosDia.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Calendário de Eventos</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Hoje
            </button>
            <button
              onClick={goToNext}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">
            {currentDate.toLocaleDateString('pt-PT', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Filtros */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <label className="flex items-center space-x-1 text-sm">
              <input
                type="checkbox"
                checked={filtros.calibracoes}
                onChange={(e) => setFiltros(prev => ({ ...prev, calibracoes: e.target.checked }))}
                className="rounded"
              />
              <span>Calibrações</span>
            </label>
            <label className="flex items-center space-x-1 text-sm">
              <input
                type="checkbox"
                checked={filtros.manutencoes}
                onChange={(e) => setFiltros(prev => ({ ...prev, manutencoes: e.target.checked }))}
                className="rounded"
              />
              <span>Manutenções</span>
            </label>
            <label className="flex items-center space-x-1 text-sm">
              <input
                type="checkbox"
                checked={filtros.inspecoes}
                onChange={(e) => setFiltros(prev => ({ ...prev, inspecoes: e.target.checked }))}
                className="rounded"
              />
              <span>Inspeções</span>
            </label>
            <label className="flex items-center space-x-1 text-sm">
              <input
                type="checkbox"
                checked={filtros.auditorias}
                onChange={(e) => setFiltros(prev => ({ ...prev, auditorias: e.target.checked }))}
                className="rounded"
              />
              <span>Auditorias</span>
            </label>
          </div>

          {/* Botões de ação */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onAddEvent?.('calibracao')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Evento</span>
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vista do Calendário */}
      <div className="mb-6">
        {renderMonthView()}
      </div>

      {/* Lista de Eventos Próximos */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Eventos</h3>
        <div className="space-y-3">
          {eventos
            .filter(evento => evento.data >= new Date())
            .slice(0, 5)
            .map(evento => (
              <motion.div
                key={evento.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getEventoColor(evento)}`}></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{evento.titulo}</h4>
                    <p className="text-sm text-gray-600">{evento.descricao}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {evento.data.toLocaleDateString('pt-PT')}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedEvent(evento);
                      setShowEventModal(true);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Modal de Detalhes do Evento */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.titulo}</h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">{selectedEvent.descricao}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Data:</span>
                  <span className="text-sm font-medium">
                    {selectedEvent.data.toLocaleDateString('pt-PT')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Prioridade:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedEvent.prioridade === 'critica' ? 'bg-red-100 text-red-800' :
                    selectedEvent.prioridade === 'alta' ? 'bg-orange-100 text-orange-800' :
                    selectedEvent.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedEvent.prioridade.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedEvent.status === 'concluida' ? 'bg-green-100 text-green-800' :
                    selectedEvent.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' :
                    selectedEvent.status === 'atrasada' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedEvent.status.toUpperCase()}
                  </span>
                </div>
                
                {selectedEvent.equipamento_nome && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Equipamento:</span>
                    <span className="text-sm font-medium">{selectedEvent.equipamento_nome}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    onViewDetails?.(selectedEvent.tipo, selectedEvent.equipamento_id || '');
                    setShowEventModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver Detalhes
                </button>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
