import { useNavigate } from "react-router-dom";
import { Shield, ArrowRight, Sparkles, CheckCircle, Zap, BarChart3, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: BarChart3,
      title: "Dashboards Inteligentes",
      description: "Métricas em tempo real com visualizações avançadas"
    },
    {
      icon: Shield,
      title: "Gestão da Qualidade",
      description: "Controlo completo de conformidade e padrões"
    },
    {
      icon: Users,
      title: "Colaboração em Equipa",
      description: "Trabalho em conjunto com ferramentas modernas"
    },
    {
      icon: Award,
      title: "Certificações",
      description: "Gestão de certificados e documentação"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        
                 {/* Grid Pattern */}
         <div className="absolute inset-0 opacity-30" style={{
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
         }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center p-8"
        >
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Qualicore
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="btn btn-ghost btn-md"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary btn-md"
            >
              Começar Agora
            </button>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col items-center text-center px-8 py-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200/50 mb-8"
          >
            <Sparkles className="h-4 w-4 text-emerald-600 mr-2" />
            <span className="text-sm font-semibold text-emerald-700">
              Sistema de Gestão da Qualidade Avançado
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Modernize a
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Gestão da Qualidade
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl leading-relaxed"
          >
            Transforme o controlo de qualidade da sua obra com tecnologia de ponta, 
            <span className="font-semibold text-gray-800"> formulários inteligentes </span>
            e <span className="font-semibold text-gray-800">dashboards em tempo real</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-6 mb-16"
          >
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary btn-lg text-lg px-8 py-4 shadow-2xl hover:shadow-3xl group"
            >
              <span>Começar Gratuitamente</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-outline btn-lg text-lg px-8 py-4 group"
            >
              <span>Ver Demo Interativo</span>
              <Zap className="h-5 w-5 ml-2 group-hover:scale-110 transition-transform" />
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-sm text-gray-600">Conformidade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-sm text-gray-600">Disponibilidade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                50+
              </div>
              <div className="text-sm text-gray-600">Funcionalidades</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="px-8 py-20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent mb-4">
                Por que escolher o Qualicore?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Uma plataforma completa que revoluciona a gestão da qualidade na construção civil
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
                  className="glass-card p-8 rounded-3xl text-center group hover:scale-105 transition-all duration-500"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="px-8 py-20 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent mb-6">
              Pronto para transformar sua gestão da qualidade?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Junte-se a centenas de empresas que já confiam no Qualicore
            </p>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary btn-lg text-lg px-10 py-4 shadow-2xl hover:shadow-3xl group"
            >
              <span>Começar Agora - É Gratuito</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          className="px-8 py-12 border-t border-white/20"
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">
                Qualicore
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Modernizando a gestão da qualidade na construção civil
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span>© 2024 Qualicore. Todos os direitos reservados.</span>
              <span>•</span>
              <span>Desenvolvido por José Antunes</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
