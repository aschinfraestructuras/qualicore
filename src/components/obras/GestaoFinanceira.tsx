import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, TrendingUp, TrendingDown, BarChart3, Plus, Edit, Trash2, 
  Calculator, Target, AlertTriangle, CheckCircle, Clock, Calendar,
  PieChart, LineChart, Activity, Zap, Percent, Euro, Receipt,
  CreditCard, Banknote, PiggyBank, Wallet
} from 'lucide-react';
import { GestaoFinanceiraObra, OrcamentoDetalhado, ControloCustos } from '@/types';
import toast from 'react-hot-toast';

interface GestaoFinanceiraProps {
  gestaoFinanceira: GestaoFinanceiraObra;
  orcamentos: OrcamentoDetalhado[];
  controloCustos: ControloCustos[];
  onGestaoFinanceiraChange: (gestao: GestaoFinanceiraObra) => void;
  onOrcamentosChange: (orcamentos: OrcamentoDetalhado[]) => void;
  onControloCustosChange: (controlo: ControloCustos[]) => void;
}

export default function GestaoFinanceira({ 
  gestaoFinanceira, 
  orcamentos, 
  controloCustos, 
  onGestaoFinanceiraChange, 
  onOrcamentosChange, 
  onControloCustosChange 
}: GestaoFinanceiraProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orcamentos' | 'controlo' | 'fluxo'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dentro_orcamento': return 'text-green-600 bg-green-100';
      case 'acima_orcamento': return 'text-red-600 bg-red-100';
      case 'atencao': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < threshold) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const calcularVariancia = (previsto: number, realizado: number) => {
    return realizado - previsto;
  };

  const calcularPercentualExecucao = (realizado: number, total: number) => {
    return total > 0 ? (realizado / total) * 100 : 0;
  };

  const stats = {
    orcamentoTotal: orcamentos.reduce((acc, orc) => acc + orc.valor_previsto, 0),
    valorExecutado: orcamentos.reduce((acc, orc) => acc + orc.valor_realizado, 0),
    valorPendente: orcamentos.reduce((acc, orc) => acc + (orc.valor_previsto - orc.valor_realizado), 0),
    percentualExecucao: 0,
    varianciaTotal: 0,
    controloCustos: controloCustos.length,
    alertas: controloCustos.filter(c => c.status === 'acima_orcamento').length,
  };

  stats.percentualExecucao = calcularPercentualExecucao(stats.valorExecutado, stats.orcamentoTotal);
  stats.varianciaTotal = calcularVariancia(stats.orcamentoTotal, stats.valorExecutado);

  const categoriasOrcamento = [
    { nome: 'Materiais', valor: 450000, cor: 'bg-blue-500' },
    { nome: 'Mão de Obra', valor: 320000, cor: 'bg-green-500' },
    { nome: 'Equipamentos', valor: 180000, cor: 'bg-purple-500' },
    { nome: 'Serviços', valor: 120000, cor: 'bg-orange-500' },
    { nome: 'Administrativo', valor: 80000, cor: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <DollarSign className="h-6 w-6 mr-3 text-emerald-600" />
            Gestão Financeira
          </h2>
          <p className="text-gray-600 mt-1">Controlo de orçamentos, custos e fluxo de caixa</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('orcamentos')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'orcamentos' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Orçamentos
          </button>
          <button
            onClick={() => setActiveTab('controlo')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'controlo' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Controlo de Custos
          </button>
          <button
            onClick={() => setActiveTab('fluxo')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'fluxo' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Fluxo de Caixa
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Orçamento Total</span>
                </div>
                {getTrendIcon(stats.orcamentoTotal)}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.orcamentoTotal.toLocaleString('pt-PT')}€
              </div>
              <div className="text-sm text-gray-600">
                Valor previsto para o projeto
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Executado</span>
                </div>
                {getTrendIcon(stats.valorExecutado)}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.valorExecutado.toLocaleString('pt-PT')}€
              </div>
              <div className="text-sm text-gray-600">
                {stats.percentualExecucao.toFixed(1)}% do orçamento
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Pendente</span>
                </div>
                {getTrendIcon(stats.valorPendente)}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.valorPendente.toLocaleString('pt-PT')}€
              </div>
              <div className="text-sm text-gray-600">
                Valor ainda por executar
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Variação</span>
                </div>
                {getTrendIcon(stats.varianciaTotal)}
              </div>
              <div className={`text-3xl font-bold mb-2 ${stats.varianciaTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.varianciaTotal >= 0 ? '+' : ''}{stats.varianciaTotal.toLocaleString('pt-PT')}€
              </div>
              <div className="text-sm text-gray-600">
                Diferença vs. orçamento
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Progresso do Orçamento</h3>
              <span className="text-2xl font-bold text-emerald-600">{stats.percentualExecucao.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-green-500 h-4 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min(stats.percentualExecucao, 100)}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Executado:</span>
                <span className="font-semibold text-gray-900 ml-2">{stats.valorExecutado.toLocaleString('pt-PT')}€</span>
              </div>
              <div>
                <span className="text-gray-600">Pendente:</span>
                <span className="font-semibold text-gray-900 ml-2">{stats.valorPendente.toLocaleString('pt-PT')}€</span>
              </div>
              <div>
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold text-gray-900 ml-2">{stats.orcamentoTotal.toLocaleString('pt-PT')}€</span>
              </div>
            </div>
          </div>

          {/* Categorias de Orçamento */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Categoria</h3>
              <div className="space-y-4">
                {categoriasOrcamento.map((categoria, index) => {
                  const percentual = (categoria.valor / stats.orcamentoTotal) * 100;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${categoria.cor}`}></div>
                        <span className="font-medium text-gray-900">{categoria.nome}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {categoria.valor.toLocaleString('pt-PT')}€
                        </div>
                        <div className="text-sm text-gray-600">{percentual.toFixed(1)}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas Financeiros</h3>
              <div className="space-y-4">
                {stats.alertas > 0 ? (
                  <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">{stats.alertas} alertas ativos</p>
                      <p className="text-sm text-red-700">Itens acima do orçamento</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Tudo controlado</p>
                      <p className="text-sm text-green-700">Orçamentos dentro do previsto</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">{controloCustos.length} itens controlados</p>
                    <p className="text-sm text-blue-700">Monitorização ativa de custos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Orçamentos Tab */}
      {activeTab === 'orcamentos' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Orçamentos Detalhados</h3>
            <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Novo Orçamento
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orcamentos.map((orcamento) => {
              const variancia = calcularVariancia(orcamento.valor_previsto, orcamento.valor_realizado);
              const percentual = calcularPercentualExecucao(orcamento.valor_realizado, orcamento.valor_previsto);
              
              return (
                <div key={orcamento.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Receipt className="h-5 w-5 text-emerald-600" />
                      <span className="font-semibold text-gray-900">{orcamento.categoria}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Previsto</p>
                      <p className="font-semibold text-gray-900">{orcamento.valor_previsto.toLocaleString('pt-PT')}€</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Realizado</p>
                      <p className="font-semibold text-gray-900">{orcamento.valor_realizado.toLocaleString('pt-PT')}€</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Variação</p>
                        <p className={`font-semibold ${variancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {variancia >= 0 ? '+' : ''}{variancia.toLocaleString('pt-PT')}€
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Progresso</p>
                        <p className="font-semibold text-gray-900">{percentual.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        percentual > 100 ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(percentual, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Controlo de Custos Tab */}
      {activeTab === 'controlo' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Controlo de Custos</h3>
            <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Novo Controlo
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Item</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Categoria</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Previsto</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Realizado</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Variação</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {controloCustos.map((controlo) => {
                    const variancia = calcularVariancia(controlo.valor_previsto, controlo.valor_realizado);
                    const percentual = calcularPercentualExecucao(controlo.valor_realizado, controlo.valor_previsto);
                    
                    return (
                      <tr key={controlo.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{controlo.item}</p>
                            <p className="text-sm text-gray-600">{controlo.descricao}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {controlo.categoria}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          {controlo.valor_previsto.toLocaleString('pt-PT')}€
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          {controlo.valor_realizado.toLocaleString('pt-PT')}€
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-medium ${variancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {variancia >= 0 ? '+' : ''}{variancia.toLocaleString('pt-PT')}€
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(controlo.status)}`}>
                            {controlo.status === 'dentro_orcamento' ? 'Dentro' : 
                             controlo.status === 'acima_orcamento' ? 'Acima' : 'Atenção'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Fluxo de Caixa Tab */}
      {activeTab === 'fluxo' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Fluxo de Caixa</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
              <option value="trimestre">Este Trimestre</option>
              <option value="ano">Este Ano</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Entradas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Pagamentos Cliente</p>
                      <p className="text-sm text-gray-600">Recebimentos previstos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">+850.000€</p>
                    <p className="text-sm text-gray-600">Este mês</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Banknote className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Subvenções</p>
                      <p className="text-sm text-gray-600">Apoios governamentais</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">+120.000€</p>
                    <p className="text-sm text-gray-600">Este mês</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Saídas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                      <TrendingDown className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Fornecedores</p>
                      <p className="text-sm text-gray-600">Materiais e serviços</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">-420.000€</p>
                    <p className="text-sm text-gray-600">Este mês</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Operacionais</p>
                      <p className="text-sm text-gray-600">Custos administrativos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">-85.000€</p>
                    <p className="text-sm text-gray-600">Este mês</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Saldo Previsto</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-emerald-50 rounded-xl">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PiggyBank className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Saldo Atual</h4>
                <p className="text-3xl font-bold text-emerald-600">465.000€</p>
                <p className="text-sm text-gray-600 mt-2">Disponível</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Próximo Mês</h4>
                <p className="text-3xl font-bold text-blue-600">+880.000€</p>
                <p className="text-sm text-gray-600 mt-2">Entradas previstas</p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Saldo Final</h4>
                <p className="text-3xl font-bold text-purple-600">1.345.000€</p>
                <p className="text-sm text-gray-600 mt-2">Previsto</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
