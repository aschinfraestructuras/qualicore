import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HardHat, FolderOpen, Eye, TestTube, ClipboardCheck, BarChart3,
  BookOpen, AlertTriangle, FileCheck, Award, Upload, HelpCircle,
  Building2, Building, Train, Zap, Bell, Shield, Settings, Grid3X3,
  Users, Layers, Wrench, Package, ChevronDown, X
} from 'lucide-react';

interface QuickNavigationProps {
  darkMode?: boolean;
  className?: string;
}

interface Module {
  id: string;
  nome: string;
  path: string;
  icon: any;
  color: string;
  priority: 'alta' | 'media' | 'baixa';
}

const QuickNavigation: React.FC<QuickNavigationProps> = ({ darkMode = false, className = '' }) => {
  console.log('🎯 QuickNavigation render - darkMode:', darkMode);
  
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showAllModules, setShowAllModules] = useState(false);

  const categories = [
    {
      id: 'planeamento',
      title: 'Planeamento',
      icon: HardHat,
      color: 'from-slate-600 to-gray-700',
      modules: [
        { id: "obras", nome: "Obras", path: "/obras", icon: HardHat, color: "from-slate-600 to-gray-700", priority: "alta" as const },
        { id: "documentos", nome: "Documentos", path: "/documentos", icon: FolderOpen, color: "from-indigo-500 to-purple-500", priority: "alta" as const },
        { id: "rfis", nome: "RFIs", path: "/rfis", icon: HelpCircle, color: "from-blue-500 to-cyan-500", priority: "media" as const },
        { id: "submissao-materiais", nome: "Submissão Materiais", path: "/submissao-materiais", icon: Upload, color: "from-purple-500 to-pink-500", priority: "media" as const }
      ]
    },
    {
      id: 'qualidade',
      title: 'Qualidade',
      icon: Award,
      color: 'from-emerald-500 to-teal-500',
      modules: [
        { id: "normas", nome: "Normas", path: "/normas", icon: BookOpen, color: "from-emerald-500 to-teal-500", priority: "alta" as const },
        { id: "checklists", nome: "Checklists", path: "/checklists", icon: ClipboardCheck, color: "from-purple-500 to-pink-500", priority: "alta" as const },
        { id: "pie", nome: "PIE", path: "/pie", icon: Eye, color: "from-blue-500 to-cyan-500", priority: "alta" as const },
        { id: "auditorias", nome: "Auditorias", path: "/auditorias", icon: FileCheck, color: "from-indigo-500 to-purple-500", priority: "alta" as const },
        { id: "nao-conformidades", nome: "Não Conformidades", path: "/nao-conformidades", icon: AlertTriangle, color: "from-red-500 to-orange-500", priority: "alta" as const }
      ]
    },
    {
      id: 'execucao',
      title: 'Execução',
      icon: TestTube,
      color: 'from-blue-500 to-cyan-500',
      modules: [
        { id: "ensaios", nome: "Ensaios", path: "/ensaios", icon: TestTube, color: "from-indigo-500 to-purple-500", priority: "alta" as const },
        { id: "controlo-betonagens", nome: "Betonagens", path: "/controlo-betonagens", icon: Wrench, color: "from-blue-500 to-cyan-500", priority: "alta" as const },
        { id: "armaduras", nome: "Armaduras", path: "/armaduras", icon: Package, color: "from-slate-600 to-gray-700", priority: "alta" as const },
        { id: "caracterizacao-solos", nome: "Solos", path: "/caracterizacao-solos", icon: Layers, color: "from-emerald-500 to-teal-500", priority: "media" as const }
      ]
    },
    {
      id: 'ferroviaria',
      title: 'Ferroviária',
      icon: Train,
      color: 'from-indigo-500 to-purple-500',
      modules: [
        { id: "via-ferrea", nome: "Via Férrea", path: "/via-ferrea", icon: Train, color: "from-indigo-500 to-purple-500", priority: "alta" as const },
        { id: "pontes-tuneis", nome: "Pontes & Túneis", path: "/pontes-tuneis", icon: Building2, color: "from-slate-600 to-gray-700", priority: "alta" as const },
        { id: "eletrificacao", nome: "Eletrificação", path: "/eletrificacao", icon: Zap, color: "from-yellow-500 to-orange-500", priority: "alta" as const },
        { id: "sinalizacao", nome: "Sinalização", path: "/sinalizacao", icon: Bell, color: "from-red-500 to-pink-500", priority: "alta" as const },
        { id: "estacoes", nome: "Estações", path: "/estacoes", icon: Building, color: "from-blue-500 to-cyan-500", priority: "media" as const },
        { id: "seguranca-ferroviaria", nome: "Segurança", path: "/seguranca-ferroviaria", icon: Shield, color: "from-green-500 to-emerald-500", priority: "alta" as const }
      ]
    },
    {
      id: 'recursos',
      title: 'Recursos',
      icon: Settings,
      color: 'from-purple-500 to-pink-500',
      modules: [
        { id: "materiais", nome: "Materiais", path: "/materiais", icon: Grid3X3, color: "from-purple-500 to-pink-500", priority: "alta" as const },
        { id: "fornecedores", nome: "Fornecedores", path: "/fornecedores", icon: Users, color: "from-emerald-500 to-teal-500", priority: "alta" as const },
        { id: "fornecedores-avancados", nome: "Fornecedores Av.", path: "/fornecedores-avancados", icon: Building2, color: "from-indigo-500 to-purple-500", priority: "alta" as const },
        { id: "calibracoes-equipamentos", nome: "Calibrações", path: "/calibracoes-equipamentos", icon: Settings, color: "from-slate-600 to-gray-700", priority: "media" as const }
      ]
    }
  ];

  // Todos os módulos do sistema (23 módulos)
  const allModules = [
    // Planeamento & Gestão
    { id: "obras", nome: "Obras", path: "/obras", icon: HardHat, color: "from-slate-600 to-gray-700", priority: "alta" as const },
    { id: "documentos", nome: "Documentos", path: "/documentos", icon: FolderOpen, color: "from-indigo-500 to-purple-500", priority: "alta" as const },
    { id: "rfis", nome: "RFIs", path: "/rfis", icon: HelpCircle, color: "from-blue-500 to-cyan-500", priority: "media" as const },
    { id: "submissao-materiais", nome: "Submissão", path: "/submissao-materiais", icon: Upload, color: "from-purple-500 to-pink-500", priority: "media" as const },
    { id: "relatorios", nome: "Relatórios", path: "/relatorios", icon: BarChart3, color: "from-orange-500 to-red-500", priority: "media" as const },
    { id: "rececao-obra-garantias", nome: "Receção Obra", path: "/rececao-obra-garantias", icon: Building2, color: "from-indigo-500 to-purple-500", priority: "alta" as const },
    
    // Qualidade
    { id: "normas", nome: "Normas", path: "/normas", icon: BookOpen, color: "from-emerald-500 to-teal-500", priority: "alta" as const },
    { id: "checklists", nome: "Checklists", path: "/checklists", icon: ClipboardCheck, color: "from-purple-500 to-pink-500", priority: "alta" as const },
    { id: "pie", nome: "PIE", path: "/pie", icon: Eye, color: "from-blue-500 to-cyan-500", priority: "alta" as const },
    { id: "auditorias", nome: "Auditorias", path: "/auditorias", icon: FileCheck, color: "from-indigo-500 to-purple-500", priority: "alta" as const },
    { id: "certificados", nome: "Certificados", path: "/certificados", icon: Award, color: "from-yellow-500 to-orange-500", priority: "media" as const },
    { id: "nao-conformidades", nome: "Não Conformidades", path: "/nao-conformidades", icon: AlertTriangle, color: "from-red-500 to-pink-500", priority: "alta" as const },
    
    // Execução
    { id: "caracterizacao-solos", nome: "Solos", path: "/caracterizacao-solos", icon: Layers, color: "from-emerald-500 to-teal-500", priority: "media" as const },
    { id: "ensaios-compactacao", nome: "Compactação", path: "/ensaios-compactacao", icon: BarChart3, color: "from-blue-500 to-cyan-500", priority: "alta" as const },
    { id: "controlo-betonagens", nome: "Betonagens", path: "/controlo-betonagens", icon: Wrench, color: "from-slate-600 to-gray-700", priority: "alta" as const },
    { id: "armaduras", nome: "Armaduras", path: "/armaduras", icon: Package, color: "from-indigo-500 to-purple-500", priority: "alta" as const },
    { id: "ensaios", nome: "Ensaios", path: "/ensaios", icon: TestTube, color: "from-purple-500 to-pink-500", priority: "alta" as const },
    
    // Ferroviária
    { id: "via-ferrea", nome: "Via Férrea", path: "/via-ferrea", icon: Train, color: "from-indigo-500 to-purple-500", priority: "alta" as const },
    { id: "pontes-tuneis", nome: "Pontes & Túneis", path: "/pontes-tuneis", icon: Building2, color: "from-slate-600 to-gray-700", priority: "alta" as const },
    { id: "eletrificacao", nome: "Eletrificação", path: "/eletrificacao", icon: Zap, color: "from-yellow-500 to-orange-500", priority: "alta" as const },
    { id: "sinalizacao", nome: "Sinalização", path: "/sinalizacao", icon: Bell, color: "from-red-500 to-pink-500", priority: "alta" as const },
    { id: "estacoes", nome: "Estações", path: "/estacoes", icon: Building, color: "from-blue-500 to-cyan-500", priority: "media" as const },
    { id: "seguranca-ferroviaria", nome: "Segurança", path: "/seguranca-ferroviaria", icon: Shield, color: "from-green-500 to-emerald-500", priority: "alta" as const },
    
    // Recursos
    { id: "materiais", nome: "Materiais", path: "/materiais", icon: Grid3X3, color: "from-purple-500 to-pink-500", priority: "alta" as const },
    { id: "fornecedores", nome: "Fornecedores", path: "/fornecedores", icon: Users, color: "from-emerald-500 to-teal-500", priority: "alta" as const },
    { id: "fornecedores-avancados", nome: "Fornecedores Av.", path: "/fornecedores-avancados", icon: Building2, color: "from-indigo-500 to-purple-500", priority: "alta" as const },
    { id: "calibracoes-equipamentos", nome: "Calibrações", path: "/calibracoes-equipamentos", icon: Settings, color: "from-slate-600 to-gray-700", priority: "media" as const }
  ];

  const mostUsedModules = allModules.slice(0, 6);

  const handleModuleClick = (module: Module) => {
    navigate(module.path);
    setExpandedCategory(null);
  };

  return (
    <div className={`${className} ${darkMode ? 'bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95' : 'bg-gradient-to-r from-white/95 via-blue-50/95 to-white/95'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-700/50' : 'border-blue-200/50'} transition-all duration-300 shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Most Used Modules */}
          <div className="flex items-center space-x-1">
            {mostUsedModules.slice(0, 6).map((module) => (
              <motion.button
                key={module.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleModuleClick(module)}
                className={`flex items-center space-x-2 px-2 py-2 rounded-lg ${darkMode ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-100/50 hover:bg-gray-200/50'} transition-all duration-200 group relative overflow-hidden`}
              >
                <div className={`w-5 h-5 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center shadow-sm`}>
                  <module.icon className="h-3 w-3 text-white" />
                </div>
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:${darkMode ? 'text-white' : 'text-gray-900'} whitespace-nowrap`}>
                  {module.nome}
                </span>
                {module.priority === 'alta' && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm"></div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-r ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-lg`}></div>
              </motion.button>
            ))}
          </div>

          {/* Categories Dropdown */}
          <div className="flex items-center space-x-2">
            {categories.map((category) => (
              <div key={category.id} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-100/50 hover:bg-gray-200/50'} transition-all duration-200 group`}
                >
                  <div className={`w-6 h-6 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                    <category.icon className="h-3 w-3 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {category.title}
                  </span>
                  <ChevronDown className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-transform duration-200 ${expandedCategory === category.id ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {expandedCategory === category.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full left-0 mt-2 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-2 z-50`}
                    >
                      <div className="grid grid-cols-1 gap-2">
                        {category.modules.map((module) => (
                          <motion.button
                            key={module.id}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleModuleClick(module)}
                            className={`flex items-center space-x-3 p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700/60' : 'hover:bg-gray-50/80'} transition-all duration-200 text-left border ${darkMode ? 'border-gray-700/50' : 'border-gray-200/30'} hover:border-${darkMode ? 'gray-600' : 'gray-300'}`}
                          >
                            <div className={`w-10 h-10 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center shadow-md`}>
                              <module.icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {module.nome}
                              </div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {module.priority === 'alta' ? 'Prioridade Alta' : module.priority === 'media' ? 'Prioridade Média' : 'Prioridade Baixa'}
                              </div>
                            </div>
                            {module.priority === 'alta' && (
                              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-md"></div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Show All Modules Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAllModules(!showAllModules)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="text-sm font-medium">Todos os Módulos</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{allModules.length}</span>
            </motion.button>
          </div>
        </div>

        {/* All Modules Panel */}
        <AnimatePresence>
          {showAllModules && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`overflow-hidden border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Grid3X3 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Todos os Módulos do Sistema
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {allModules.length} módulos disponíveis
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAllModules(false)}
                    className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {allModules.map((module, index) => (
                    <motion.button
                      key={module.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleModuleClick(module)}
                      className={`flex flex-col items-center p-3 rounded-xl ${darkMode ? 'bg-gray-700/60 hover:bg-gray-600/60' : 'bg-white/80 hover:bg-gray-50/80'} border ${darkMode ? 'border-gray-600/50' : 'border-gray-200/50'} transition-all duration-200 group relative overflow-hidden shadow-sm hover:shadow-md`}
                    >
                      <div className={`w-10 h-10 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center mb-2 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <module.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className={`text-xs font-semibold text-center ${darkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:${darkMode ? 'text-white' : 'text-gray-900'} leading-tight`}>
                        {module.nome}
                      </span>
                      {module.priority === 'alta' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
                      )}
                      <div className={`absolute inset-0 bg-gradient-to-r ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}></div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuickNavigation;
