import {
  Ensaio,
  Documento,
  Checklist,
  Material,
  Fornecedor,
  NaoConformidade,
  Obra,
} from "@/types";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, ArrowLeft, Eye, EyeOff, CheckCircle, Star, Globe, Lock, Settings, TestTube, FileText, ClipboardCheck, Building, BarChart3, Target, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

type AuthMode = "login" | "register" | "reset";

export default function Login() {
  const [mode, setMode] = useState<AuthMode>("login");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLoginSuccess = () => {
    navigate(from, { replace: true });
  };

  const handleSwitchToRegister = () => setMode("register");
  const handleSwitchToLogin = () => setMode("login");
  const handleSwitchToReset = () => setMode("reset");

  const benefits = [
    "Sistema de Gestão da Qualidade",
    "Controlo de Ensaios e Materiais",
    "Gestão de Não Conformidades",
    "Relatórios em Tempo Real",
    "Dashboards Interativos",
    "Colaboração em Equipa"
  ];

  const qualityIcons = [
    { icon: TestTube, color: "from-blue-500 to-indigo-600", delay: 0 },
    { icon: FileText, color: "from-emerald-500 to-green-600", delay: 0.5 },
    { icon: ClipboardCheck, color: "from-purple-500 to-pink-600", delay: 1 },
    { icon: Building, color: "from-orange-500 to-red-600", delay: 1.5 },
    { icon: BarChart3, color: "from-cyan-500 to-blue-600", delay: 2 },
    { icon: Target, color: "from-pink-500 to-rose-600", delay: 2.5 }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      {/* Enhanced Left Side - Branding */}
      <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Enhanced Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Floating Quality Icons */}
        <div className="absolute inset-0">
          {qualityIcons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 0.3, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1, 
                delay: item.delay,
                type: "spring",
                stiffness: 100
              }}
              className="absolute"
              style={{
                left: `${20 + (index % 3) * 30}%`,
                top: `${20 + Math.floor(index / 3) * 30}%`,
              }}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg animate-pulse-glow`}>
                <item.icon className="h-4 w-4 text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.6, y: -20 }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 text-center text-white"
        >
          {/* Animated Logo */}
          <motion.div 
            className="flex items-center justify-center mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1, 
              delay: 0.8,
              type: "spring",
              stiffness: 200
            }}
          >
            <motion.div 
              className="h-24 w-24 rounded-3xl bg-white/20 flex items-center justify-center shadow-glow border border-white/30 backdrop-blur-sm relative overflow-hidden"
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={{ 
                boxShadow: [
                  "0 0 30px rgba(255,255,255,0.3)",
                  "0 0 60px rgba(255,255,255,0.5)",
                  "0 0 30px rgba(255,255,255,0.3)"
                ]
              }}
              transition={{ 
                boxShadow: { duration: 2, repeat: Infinity },
                scale: { duration: 0.3 }
              }}
            >
              <Shield className="h-14 w-14 text-white" />
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </motion.div>
          </motion.div>

          <motion.h1 
            className="text-5xl lg:text-6xl font-bold font-display mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <span className="gradient-text-animate">Qualicore</span>
          </motion.h1>

          <motion.p 
            className="text-xl lg:text-2xl text-blue-100 mb-8 font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            Gestão da Qualidade para Construção Civil
          </motion.p>

          <motion.div 
            className="space-y-4 text-blue-100 max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="flex items-center justify-center space-x-3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                ></motion.div>
                <span className="text-sm lg:text-base">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <motion.div 
            className="mt-12 flex items-center justify-center space-x-6 text-blue-200 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Globe className="h-4 w-4 mr-2" />
              <span>Portugal</span>
            </motion.div>
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Lock className="h-4 w-4 mr-2" />
              <span>100% Seguro</span>
            </motion.div>
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="h-4 w-4 mr-2 fill-current" />
              <span>5.0</span>
            </motion.div>
          </motion.div>

          {/* Developer credit */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8 }}
          >
            <motion.a 
              href="https://www.linkedin.com/in/antunesmartins/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              <Settings className="h-4 w-4 mr-2 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">Desenvolvido por José Antunes</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Right Side - Auth Forms */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1, delay: i * 0.2 }}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Enhanced Back to home button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
          >
            <motion.div
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            </motion.div>
            Voltar ao início
          </motion.button>

          {/* Enhanced Auth Forms */}
          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              >
                <div className="text-center mb-8">
                  <motion.h2 
                    className="text-3xl font-bold text-gray-900 mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Bem-vindo de volta
                  </motion.h2>
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    Entre na sua conta para continuar
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <LoginForm 
                    onSuccess={handleLoginSuccess} 
                    onSwitchToRegister={handleSwitchToRegister}
                    onSwitchToReset={handleSwitchToReset}
                  />
                </motion.div>
                <motion.div 
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <button
                    onClick={handleSwitchToReset}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    Esqueceu a palavra-passe?
                  </button>
                </motion.div>
                <motion.div 
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <span className="text-gray-600 text-sm">Não tem uma conta? </span>
                  <button
                    onClick={handleSwitchToRegister}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Registar-se
                  </button>
                </motion.div>
              </motion.div>
            )}

            {mode === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              >
                <div className="text-center mb-8">
                  <motion.h2 
                    className="text-3xl font-bold text-gray-900 mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Criar conta
                  </motion.h2>
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    Comece a usar o Qualicore hoje
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <RegisterForm 
                    onSuccess={handleLoginSuccess} 
                    onSwitchToLogin={handleSwitchToLogin}
                  />
                </motion.div>
                <motion.div 
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <span className="text-gray-600 text-sm">Já tem uma conta? </span>
                  <button
                    onClick={handleSwitchToLogin}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Entrar
                  </button>
                </motion.div>
              </motion.div>
            )}

            {mode === "reset" && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              >
                <div className="text-center mb-8">
                  <motion.h2 
                    className="text-3xl font-bold text-gray-900 mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Recuperar palavra-passe
                  </motion.h2>
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    Enviaremos instruções para o seu email
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <ResetPasswordForm onSwitchToLogin={handleSwitchToLogin} />
                </motion.div>
                <motion.div 
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <button
                    onClick={handleSwitchToLogin}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    Voltar ao login
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
