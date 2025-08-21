import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, BarChart3, PieChart, TrendingUp,
  CheckCircle, Clock, AlertTriangle, XCircle,
  FileCheck, Upload, Download, Eye,
  Calendar, Users, Shield, Award,
  Filter, Search, Settings, RefreshCw,
  Percent, Hash, Layers, BookOpen,
  FileX, FilePlus, FileSearch, FileArchive,
  Activity, Zap, Target, Globe,
  ChevronRight, ChevronLeft, Maximize2,
  Download as DownloadIcon, Printer, Share2
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface DocumentoDashboardProps {
  documentos: any[];
  darkMode?: boolean;
  onGenerateReport?: (config: any) => void;
}

export const DocumentoDashboard: React.FC<DocumentoDashboardProps> = ({ documentos, darkMode = false, onGenerateReport }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'reports' | 'insights'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Calcular estatísticas avançadas
  const stats = {
    total: documentos.length,
    aprovados: documentos.filter(d => d.estado === 'aprovado').length,
    em_analise: documentos.filter(d => d.estado === 'em_analise').length,
    pendentes: documentos.filter(d => d.estado === 'pendente').length,
    reprovados: documentos.filter(d => d.estado === 'reprovado').length,
    vencidos: documentos.filter(d => new Date(d.data_validade) < new Date()).length,
    proximos_vencimento: documentos.filter(d => {
      const dataValidade = new Date(d.data_validade);
      const hoje = new Date();
      const diffTime = dataValidade.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }).length,
    taxa_aprovacao: documentos.length > 0 ? Math.round((documentos.filter(d => d.estado === 'aprovado').length / documentos.length) * 100) : 0,
    documentos_criticos: documentos.filter(d => {
      const dataValidade = new Date(d.data_validade);
      const hoje = new Date();
      const diffTime = dataValidade.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    }).length
  };

  // Dados para gráficos
  const dadosPorTipo = documentos.reduce((acc, doc) => {
    acc[doc.tipo] = (acc[doc.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dadosPorEstado = {
    'Aprovados': stats.aprovados,
    'Em Análise': stats.em_analise,
    'Pendentes': stats.pendentes,
    'Reprovados': stats.reprovados
  };

  const dadosPorZona = documentos.reduce((acc, doc) => {
    acc[doc.zona] = (acc[doc.zona] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Dados de tendência temporal (calculados dos documentos reais)
  const dadosTendencia = React.useMemo(() => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const hoje = new Date();
    const dados = [];
    
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mes = meses[data.getMonth()];
      const documentosMes = documentos.filter(d => {
        const docDate = new Date(d.created);
        return docDate.getMonth() === data.getMonth() && docDate.getFullYear() === data.getFullYear();
      });
      const aprovadosMes = documentosMes.filter(d => d.estado === 'aprovado');
      
      dados.push({
        mes,
        documentos: documentosMes.length,
        aprovados: aprovadosMes.length
      });
    }
    
    return dados;
  }, [documentos]);

  // Dados por responsável
  const dadosPorResponsavel = documentos.reduce((acc, doc) => {
    acc[doc.responsavel] = (acc[doc.responsavel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Dados de vencimento por mês
  const dadosVencimento = React.useMemo(() => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const hoje = new Date();
    const dados = [];
    
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mes = meses[data.getMonth()];
      const vencimentosMes = documentos.filter(d => {
        const dataValidade = new Date(d.data_validade);
        return dataValidade.getMonth() === data.getMonth() && dataValidade.getFullYear() === data.getFullYear();
      });
      
      dados.push({
        mes,
        vencimentos: vencimentosMes.length,
        vencidos: vencimentosMes.filter(d => new Date(d.data_validade) < hoje).length
      });
    }
    
    return dados;
  }, [documentos]);

  // Componente de gráfico de pizza premium avançado
  const PremiumPieChart = ({ data, title, colors }: { data: Record<string, number>, title: string, colors: string[] }) => {
    const entries = Object.entries(data).slice(0, 5);
    const total = entries.reduce((sum, [_, value]) => sum + value, 0);
    
    let currentAngle = 0;
    const radius = 60;
    const centerX = 100;
    const centerY = 100;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className={`p-6 rounded-3xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-xl shadow-xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/30'} relative overflow-hidden group`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h3>
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                {/* Definições de gradiente */}
                <defs>
                  <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                
                {entries.map(([label, value], index) => {
                  const percentage = total > 0 ? (value / total) * 100 : 0;
                  const angle = (percentage / 100) * 360;
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + angle;
                  
                  const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
                  
                  const largeArcFlag = angle > 180 ? 1 : 0;
                  
                  const pathData = [
                    `M ${centerX} ${centerY}`,
                    `L ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    'Z'
                  ].join(' ');
                  
                  currentAngle += angle;
                  
                  return (
                    <motion.path
                      key={label}
                      d={pathData}
                      fill={colors[index % colors.length]}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="group-hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                    />
                  );
                })}
                
                {/* Círculo central com gradiente */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="25"
                  fill={darkMode ? '#374151' : '#f8fafc'}
                  className="drop-shadow-lg"
                />
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="20"
                  fill="url(#centerGradient)"
                  className="drop-shadow-lg"
                />
              </svg>
              
              {/* Total no centro */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {total}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legenda */}
          <div className="space-y-3">
            {entries.map(([label, value], index) => {
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <motion.div
                  key={label}
                  className="flex items-center justify-between group/item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} group-hover/item:text-purple-600 transition-colors`}>
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {value}
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({percentage}%)
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

           // Componente de gráfico de linha premium avançado
         const PremiumLineChart = ({ data, title, color }: { data: any[], title: string, color: string }) => {
           const maxValue = Math.max(...data.map(d => Math.max(d.documentos || 0, d.aprovados || 0, d.vencimentos || 0, d.vencidos || 0)));
           
           return (
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               whileHover={{ scale: 1.02 }}
               className={`p-6 rounded-3xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-xl shadow-xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/30'} relative overflow-hidden group`}
             >
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-3xl"></div>
               <div className="relative z-10">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                     {title}
                   </h3>
                   <div className="flex items-center space-x-2">
                     <TrendingUp className="h-5 w-5 text-indigo-500" />
                     <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                   </div>
                 </div>
       
                 <div className="relative h-48">
                   <svg width="100%" height="100%" viewBox="0 0 400 200" className="absolute inset-0">
                     {/* Grid lines com gradiente */}
                     <defs>
                       <linearGradient id="gridGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                         <stop offset="0%" stopColor={darkMode ? "#374151" : "#e5e7eb"} stopOpacity="0.3" />
                         <stop offset="100%" stopColor={darkMode ? "#374151" : "#e5e7eb"} stopOpacity="0.1" />
                       </linearGradient>
                     </defs>
                     
                     {[0, 1, 2, 3, 4].map((i) => (
                       <line
                         key={i}
                         x1="0"
                         y1={40 + i * 40}
                         x2="400"
                         y2={40 + i * 40}
                         stroke="url(#gridGradient)"
                         strokeWidth="1"
                       />
                     ))}
                     
                     {/* Área sob a linha com gradiente */}
                     {data.length > 1 && (
                       <defs>
                         <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                           <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                           <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                         </linearGradient>
                       </defs>
                     )}
                     
                     {/* Área sob a linha */}
                     {data.length > 1 && maxValue > 0 && (
                       <path
                         d={data.map((item, index) => {
                           const x = (index / (data.length - 1)) * 360 + 20;
                           const y = 180 - ((item.documentos || 0) / maxValue) * 140;
                           return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                         }).join(' ') + ` L ${(data.length - 1) / (data.length - 1) * 360 + 20} 180 L 20 180 Z`}
                         fill="url(#areaGradient)"
                       />
                     )}
                     
                     {/* Line chart com animação */}
                     {data.map((item, index) => {
                       const x = (index / (data.length - 1)) * 360 + 20;
                       const y1 = maxValue > 0 ? 180 - ((item.documentos || 0) / maxValue) * 140 : 180;
                       const y2 = maxValue > 0 ? 180 - ((item.aprovados || 0) / maxValue) * 140 : 180;
                       
                       if (index > 0) {
                         const prevItem = data[index - 1];
                         const prevX = ((index - 1) / (data.length - 1)) * 360 + 20;
                         const prevY1 = maxValue > 0 ? 180 - ((prevItem.documentos || 0) / maxValue) * 140 : 180;
                         const prevY2 = maxValue > 0 ? 180 - ((prevItem.aprovados || 0) / maxValue) * 140 : 180;
                         
                         return (
                           <g key={index}>
                             <line
                               x1={prevX}
                               y1={prevY1}
                               x2={x}
                               y2={y1}
                               stroke={color}
                               strokeWidth="3"
                               fill="none"
                               strokeLinecap="round"
                             />
                             <line
                               x1={prevX}
                               y1={prevY2}
                               x2={x}
                               y2={y2}
                               stroke="#10B981"
                               strokeWidth="3"
                               fill="none"
                               strokeLinecap="round"
                             />
                           </g>
                         );
                       }
                       return null;
                     })}
                     
                     {/* Data points com animação */}
                     {data.map((item, index) => {
                       const x = (index / (data.length - 1)) * 360 + 20;
                       const y1 = maxValue > 0 ? 180 - ((item.documentos || 0) / maxValue) * 140 : 180;
                       const y2 = maxValue > 0 ? 180 - ((item.aprovados || 0) / maxValue) * 140 : 180;
                       
                       return (
                         <g key={index}>
                           <circle cx={x} cy={y1} r="5" fill={color} className="group-hover:r-6 transition-all duration-300" />
                           <circle cx={x} cy={y1} r="8" fill={color} opacity="0.2" className="group-hover:opacity-0.4 transition-opacity duration-300" />
                           <circle cx={x} cy={y2} r="5" fill="#10B981" className="group-hover:r-6 transition-all duration-300" />
                           <circle cx={x} cy={y2} r="8" fill="#10B981" opacity="0.2" className="group-hover:opacity-0.4 transition-opacity duration-300" />
                           <text x={x} y="195" textAnchor="middle" className={`text-xs font-medium ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>
                             {item.mes}
                           </text>
                         </g>
                       );
                     })}
                   </svg>
                 </div>
                 
                 <div className="flex items-center justify-center space-x-6 mt-4">
                   <div className="flex items-center space-x-2">
                     <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }}></div>
                     <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total</span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                     <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Aprovados</span>
                   </div>
                 </div>
               </div>
             </motion.div>
           );
         };

  // Componente de gráfico de barras premium
  const PremiumBarChart = ({ data, title, color }: { data: Record<string, number>, title: string, color: string }) => {
    const items = Object.entries(data).map(([key, value]) => ({ name: key, value }));
    const maxValue = Math.max(...items.map(item => item.value));

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 rounded-3xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-xl shadow-xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/30'} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h3>
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                  <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {item.value}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / maxValue) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full rounded-full ${color} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // Componente de métricas avançadas
  const AdvancedMetrics = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {/* Taxa de Aprovação */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-emerald-900/60 to-emerald-800/60' : 'bg-gradient-to-br from-emerald-50 to-emerald-100'} backdrop-blur-xl shadow-xl border ${darkMode ? 'border-emerald-700/50' : 'border-emerald-200/30'} relative overflow-hidden group`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Percent className="h-6 w-6 text-white" />
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-emerald-200' : 'text-emerald-700'} mb-2`}>
            Taxa de Aprovação
          </h3>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-emerald-900'} mb-2`}>
            {stats.taxa_aprovacao}%
          </p>
          <div className="w-full bg-emerald-200/30 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000"
              initial={{ width: 0 }}
              animate={{ width: `${stats.taxa_aprovacao}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Documentos Críticos */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-red-900/60 to-red-800/60' : 'bg-gradient-to-br from-red-50 to-red-100'} backdrop-blur-xl shadow-xl border ${darkMode ? 'border-red-700/50' : 'border-red-200/30'} relative overflow-hidden group`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <Activity className="h-5 w-5 text-red-500" />
          </div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-red-200' : 'text-red-700'} mb-2`}>
            Documentos Críticos
          </h3>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-red-900'} mb-2`}>
            {stats.documentos_criticos}
          </p>
          <div className="w-full bg-red-200/30 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-1000"
              initial={{ width: 0 }}
              animate={{ width: `${stats.documentos_criticos > 0 ? Math.min((stats.documentos_criticos / stats.total) * 100, 100) : 0}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Próximos Vencimentos */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-yellow-900/60 to-yellow-800/60' : 'bg-gradient-to-br from-yellow-50 to-yellow-100'} backdrop-blur-xl shadow-xl border ${darkMode ? 'border-yellow-700/50' : 'border-yellow-200/30'} relative overflow-hidden group`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <Calendar className="h-5 w-5 text-yellow-500" />
          </div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-yellow-200' : 'text-yellow-700'} mb-2`}>
            Próximos Vencimentos
          </h3>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-yellow-900'} mb-2`}>
            {stats.proximos_vencimento}
          </p>
          <div className="w-full bg-yellow-200/30 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-1000"
              initial={{ width: 0 }}
              animate={{ width: `${stats.total > 0 ? (stats.proximos_vencimento / stats.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Documentos Vencidos */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className={`p-6 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-orange-900/60 to-orange-800/60' : 'bg-gradient-to-br from-orange-50 to-orange-100'} backdrop-blur-xl shadow-xl border ${darkMode ? 'border-orange-700/50' : 'border-orange-200/30'} relative overflow-hidden group`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileX className="h-6 w-6 text-white" />
            </div>
            <XCircle className="h-5 w-5 text-orange-500" />
          </div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-orange-200' : 'text-orange-700'} mb-2`}>
            Documentos Vencidos
          </h3>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-orange-900'} mb-2`}>
            {stats.vencidos}
          </p>
          <div className="w-full bg-orange-200/30 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1000"
              initial={{ width: 0 }}
              animate={{ width: `${stats.total > 0 ? (stats.vencidos / stats.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header do Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
          Dashboard de Documentos
        </h2>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Análise avançada e métricas de gestão documental
        </p>
      </motion.div>

      {/* Tabs de Navegação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <div className={`inline-flex rounded-2xl p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {[
            { id: 'overview', label: 'Visão Geral', icon: Eye },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'reports', label: 'Relatórios', icon: FileText },
            { id: 'insights', label: 'Insights', icon: Target }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} shadow-lg`
                    : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Conteúdo das Tabs */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <AdvancedMetrics />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PremiumPieChart
                data={dadosPorEstado}
                title="Distribuição por Estado"
                colors={['#10B981', '#F59E0B', '#3B82F6', '#EF4444']}
              />
              
              <PremiumBarChart
                data={dadosPorTipo}
                title="Documentos por Tipo"
                color="bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Gráficos de tendência temporal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PremiumLineChart
                data={dadosTendencia}
                title="Tendência de Documentos (6 meses)"
                color="#3B82F6"
              />
              
              <PremiumLineChart
                data={dadosVencimento}
                title="Vencimentos por Mês"
                color="#EF4444"
              />
            </div>

            {/* Gráficos de distribuição */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <PremiumBarChart
                data={dadosPorZona}
                title="Documentos por Zona"
                color="bg-gradient-to-r from-blue-500 to-indigo-500"
              />
              
              <PremiumPieChart
                data={dadosPorTipo}
                title="Distribuição por Tipo"
                colors={['#8B5CF6', '#F97316', '#14B8A6', '#EF4444', '#10B981']}
              />

              <PremiumBarChart
                data={dadosPorResponsavel}
                title="Documentos por Responsável"
                color="bg-gradient-to-r from-emerald-500 to-green-500"
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  title: 'Relatório Executivo', 
                  icon: FileText, 
                  color: 'from-blue-500 to-indigo-500',
                  tipo: 'executivo'
                },
                { 
                  title: 'Relatório Detalhado', 
                  icon: BarChart3, 
                  color: 'from-purple-500 to-pink-500',
                  tipo: 'detalhado'
                },
                { 
                  title: 'Relatório de Vencimentos', 
                  icon: Calendar, 
                  color: 'from-emerald-500 to-green-500',
                  tipo: 'vencimentos'
                }
              ].map((report, index) => (
                <motion.div
                  key={report.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-3xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-xl shadow-xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/30'} relative overflow-hidden group cursor-pointer`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${report.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative z-10 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${report.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <report.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                      {report.title}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                      Gere relatórios detalhados e personalizados
                    </p>
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => onGenerateReport?.({
                          tipo: report.tipo,
                          titulo: report.title,
                          periodo: {
                            inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            fim: new Date().toISOString().split('T')[0]
                          },
                          filtros: {},
                          incluirGraficos: true,
                          incluirTabelas: true,
                          incluirEstatisticas: true,
                          formato: 'pdf'
                        })}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        title="Gerar PDF"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onGenerateReport?.({
                          tipo: report.tipo,
                          titulo: report.title,
                          periodo: {
                            inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            fim: new Date().toISOString().split('T')[0]
                          },
                          filtros: {},
                          incluirGraficos: true,
                          incluirTabelas: true,
                          incluirEstatisticas: true,
                          formato: 'excel'
                        })}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                        title="Gerar Excel"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onGenerateReport?.({
                          tipo: 'personalizado',
                          titulo: report.title,
                          periodo: {
                            inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            fim: new Date().toISOString().split('T')[0]
                          },
                          filtros: {},
                          incluirGraficos: true,
                          incluirTabelas: true,
                          incluirEstatisticas: true,
                          formato: 'config'
                        })}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'
                        }`}
                        title="Configurar Relatório"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Eficiência Documental', value: '87%', icon: Target, color: 'from-emerald-500 to-green-500' },
                { title: 'Tempo Médio de Aprovação', value: '2.3 dias', icon: Clock, color: 'from-blue-500 to-indigo-500' },
                { title: 'Taxa de Renovação', value: '94%', icon: RefreshCw, color: 'from-purple-500 to-pink-500' },
                { title: 'Conformidade Normativa', value: '96%', icon: Shield, color: 'from-orange-500 to-red-500' }
              ].map((insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-3xl ${darkMode ? 'bg-gray-800/60' : 'bg-white/80'} backdrop-blur-xl shadow-xl border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/30'} relative overflow-hidden group`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${insight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <insight.icon className="h-6 w-6 text-white" />
                      </div>
                      <Zap className="h-5 w-5 text-gray-400" />
                    </div>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                      {insight.title}
                    </h3>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {insight.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
