import {
  Bell,
  Menu,
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Sun,
  Moon,
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { User as UserType } from "@/types";
import { useAuthStore } from "@/lib/auth";
import toast from "react-hot-toast";
import { notificationService } from "@/services/notificationService";

export default function Header() {
  const { toggleSidebar, user, setUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(notificationService.getNotifications());
  const [unreadCount, setUnreadCount] = useState(notificationService.getUnreadCount());
  const [darkMode, setDarkMode] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications([...notificationService.getNotifications()]);
      setUnreadCount(notificationService.getUnreadCount());
    }, 2000); // Atualiza a cada 2s
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications([...notificationService.getNotifications()]);
    setUnreadCount(notificationService.getUnreadCount());
  };

  // Dark mode inicial: ler do localStorage ou preferências do sistema
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  // Perfil editável
  const { register, handleSubmit, reset } = useForm<UserType>({
    defaultValues: user || {
      nome: "",
      email: "",
      perfil: "qualidade",
      avatar: "",
    },
  });
  useEffect(() => {
    if (user) reset(user);
  }, [user, reset]);
  const handleProfileSave = (data: UserType) => {
    setUser({ ...user, ...data });
    setShowProfileModal(false);
    localStorage.setItem("user", JSON.stringify({ ...user, ...data }));
  };

  const handleLogout = async () => {
    try {
      await useAuthStore.getState().signOut();
      navigate("/login");
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <header
      className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-gray-200/60 fixed w-full z-30 left-0 top-0 h-20 flex items-center"
    >
      <div className="flex h-20 items-center justify-between px-8 w-full">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar documentos, ensaios, materiais..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-96 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={darkMode ? "Modo claro" : "Modo escuro"}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-200" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-200" />
            )}
          </button>

          {/* Help */}
          <button
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            title="Ajuda"
            onClick={() => setShowHelpModal(true)}
          >
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </button>

          {/* Settings */}
          <button
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            title="Configurações"
            onClick={() => setShowSettingsModal(true)}
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              title="Notificações"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-danger text-white text-xs flex items-center justify-center font-semibold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-strong border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
                  <button
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => { notificationService.markAllAsRead(); setNotifications([...notificationService.getNotifications()]); setUnreadCount(0); }}
                  >
                    Marcar todas como lidas
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 transition-colors flex items-start space-x-3 ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {notification.type === 'urgent' && <span className="text-red-500">🚨</span>}
                          {notification.type === 'high' && <span className="text-orange-500">⚠️</span>}
                          {notification.type === 'medium' && <span className="text-yellow-500">ℹ️</span>}
                          {notification.type === 'low' && <span className="text-blue-500">✅</span>}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 text-sm">{notification.title}</span>
                            {!notification.read && (
                              <button
                                className="text-xs text-blue-600 hover:underline ml-2"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                Marcar como lida
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-700 mt-1">{notification.message}</p>
                          <span className="text-xs text-gray-400 mt-1 block">{notification.timestamp.toLocaleString()}</span>
                          {notification.action && (
                            <a
                              href={notification.action.url}
                              className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                            >
                              {notification.action.label}
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-400 text-sm">Sem notificações</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-sm font-bold text-white">JA</span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900">
                  José Antunes
                </p>
                <p className="text-xs text-gray-500">
                  jose.antunes@qualicore.pt
                </p>
              </div>
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-strong border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    José Antunes
                  </p>
                  <p className="text-xs text-gray-500">
                    jose.antunes@qualicore.pt
                  </p>
                </div>
                <div className="py-2">
                  <button
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowProfileModal(true);
                    }}
                  >
                    <User className="h-4 w-4 mr-3 text-gray-500" />
                    Perfil
                  </button>
                  <button
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowSettingsModal(true);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-3 text-gray-500" />
                    Configurações
                  </button>
                  <div className="border-t border-gray-100 my-2" />
                  <button
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}

      {/* Modal de Perfil Editável */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Perfil do Utilizador"
      >
        <form className="space-y-4" onSubmit={handleSubmit(handleProfileSave)}>
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input {...register("nome")} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input {...register("email")} className="input" type="email" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Avatar (URL)
            </label>
            <input {...register("avatar")} className="input" />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowProfileModal(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
      {/* Modal de Configurações */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Configurações do Sistema"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                Modo Escuro
              </span>
              <p className="text-sm text-gray-500">Alterar tema da aplicação</p>
            </div>
            <button
              className={`btn btn-secondary ${darkMode ? "bg-gray-900 text-white" : ""}`}
              onClick={toggleDarkMode}
              type="button"
            >
              {darkMode ? "Desativar" : "Ativar"}
            </button>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <h4 className="font-medium text-gray-900 mb-2">Preferências de Notificações</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Notificações por email</span>
                <button className="btn btn-secondary btn-sm">Ativar</button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Alertas críticos</span>
                <button className="btn btn-secondary btn-sm">Ativar</button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <h4 className="font-medium text-gray-900 mb-2">Exportação de Dados</h4>
            <div className="space-y-2">
              <button className="w-full btn btn-outline btn-sm">
                Exportar todos os dados
              </button>
              <button className="w-full btn btn-outline btn-sm">
                Backup automático
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <h4 className="font-medium text-gray-900 mb-2">Sobre o Sistema</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Versão:</strong> Qualicore v1.0.0</p>
              <p><strong>Desenvolvido por:</strong> José Antunes</p>
              <p><strong>Contacto:</strong> jose.antunes@qualicore.pt</p>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="btn btn-primary"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>
      {/* Modal de Ajuda */}
      <Modal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="Ajuda & Suporte"
        size="md"
      >
        <div className="p-2">
          <h2 className="text-lg font-bold mb-2 text-blue-700 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" /> Ajuda & Suporte
          </h2>
          <p className="mb-4 text-gray-700">
            Bem-vindo ao sistema de Gestão da Qualidade!
            <br />
            Aqui pode gerir documentos, ensaios, checklists, materiais,
            fornecedores, não conformidades e muito mais.
            <br />
            Use o menu lateral para navegar entre módulos e as ações rápidas
            para criar novos registos.
          </p>
          <ul className="mb-4 space-y-2">
            <li>
              <a
                href="mailto:support@qualicore.pt"
                className="text-blue-600 hover:underline"
              >
                Contactar suporte: support@qualicore.pt
              </a>
            </li>
            <li>
              <a
                href="https://faq.qualicore.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                FAQ e Dicas Rápidas
              </a>
            </li>
            <li>
              <a
                href="https://docs.qualicore.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Documentação Completa
              </a>
            </li>
          </ul>
          <div className="flex justify-end">
            <button
              onClick={() => setShowHelpModal(false)}
              className="btn btn-primary"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
}
