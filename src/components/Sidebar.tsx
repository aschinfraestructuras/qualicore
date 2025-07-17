import { Link, useLocation } from "react-router-dom";
import { Shield, X, Settings } from "lucide-react";
import { useAppStore } from "../stores/appStore";
import { menuItems } from "./Navbar";

export default function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''} lg:translate-x-0 transition-all duration-300 w-80 lg:w-80 fixed lg:static z-40 h-full`}>
        <div className="flex h-full flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          {/* Header */}
          <div className="flex h-20 items-center justify-between border-b border-slate-700/50 px-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-glow">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white font-display tracking-wide">Qualicore</span>
                <p className="text-xs text-slate-400">Gestão da Qualidade</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-700/50 transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
                Navegação Principal
              </h3>
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-r ${item.color} text-white shadow-glow scale-105`
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:scale-102'
                      }`}
                      title={item.description}
                    >
                      <div className={`p-2 rounded-xl mr-3 transition-all duration-300 ${
                        isActive
                          ? 'bg-white/20'
                          : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                        }`} />
                      </div>
                      <span className="truncate font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
                Ações Rápidas
              </h3>
              <div className="space-y-2">
                {/* quickActions.map((action) => { */}
                {/*   const Icon = action.icon */}
                {/*   return ( */}
                {/*     <Link */}
                {/*       key={action.path} */}
                {/*       to={action.path} */}
                {/*       className="group flex items-center px-4 py-3 text-sm font-medium rounded-2xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300 hover:scale-102" */}
                {/*     > */}
                {/*       <div className={`p-2 rounded-xl mr-3 bg-gradient-to-br ${action.color} shadow-glow group-hover:scale-110 transition-transform duration-300`}> */}
                {/*         <Icon className="h-4 w-4 text-white" /> */}
                {/*       </div> */}
                {/*       <span className="truncate font-semibold">{action.label}</span> */}
                {/*     </Link> */}
                {/*   ) */}
                {/* })} */}
              </div>
            </div>

            {/* Project Stats */}
            <div className="px-3">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-2xl p-5 border border-slate-600/50 backdrop-blur-sm">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
                  Estatísticas do Projeto
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Conformidade Geral</span>
                    <span className="text-sm font-bold text-emerald-400">94.2%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-1000" style={{ width: '94.2%' }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">NCs Abertas</span>
                      <span className="text-red-400 font-bold">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Ensaios Pendentes</span>
                      <span className="text-yellow-400 font-bold">7</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Documentos</span>
                      <span className="text-blue-400 font-bold">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Materiais</span>
                      <span className="text-orange-400 font-bold">67</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-700/50 p-4">
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-slate-600/50">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-glow">
                <span className="text-sm font-bold text-white">JS</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">João Silva</p>
                <p className="text-xs text-slate-400 truncate">Engenheiro de Qualidade</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                  <span className="text-xs text-emerald-400">Online</span>
                </div>
              </div>
              <button className="p-2 rounded-xl hover:bg-slate-600/50 transition-colors">
                <Settings className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
