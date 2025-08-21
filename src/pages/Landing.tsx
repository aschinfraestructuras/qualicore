import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle, Zap, BarChart3, Users, Award, Play, Star, Globe, Lock, Building, TestTube, FileText, ClipboardCheck, Target, TrendingUp, Settings, Database, Target as TargetIcon, Award as AwardIcon, Trophy, Medal, Crown, Lightbulb, Rocket, Flame, Heart, Gem, Diamond, Crown as CrownIcon, CheckSquare, Award as AwardIcon2, Star as StarIcon, Zap as ZapIcon } from "lucide-react";
import { motion } from "framer-motion";
import QualicoreLogo from "../components/QualicoreLogo";

export default function Landing() {
  const navigate = useNavigate();
  
  const qualityModules = [
    {
      icon: TestTube,
      title: "Ensaios & Controlo",
      description: "Gestão completa de ensaios e controlo de qualidade",
      color: "from-blue-500 to-indigo-600",
      features: ["Ensaios de Materiais", "Controlo Betonagens", "Caracterização Solos"]
    },
    {
      icon: FileText,
      title: "Documentação",
      description: "Sistema integrado de gestão documental",
      color: "from-emerald-500 to-green-600",
      features: ["Certificados", "Normas", "Documentos Técnicos"]
    },
    {
      icon: ClipboardCheck,
      title: "Inspeções",
      description: "Checklists e pontos de inspeção automatizados",
      color: "from-purple-500 to-pink-600",
      features: ["Checklists", "Pontos de Inspeção", "RFIs"]
    },
    {
      icon: Building,
      title: "Obras & Infraestruturas",
      description: "Gestão especializada para construção civil",
      color: "from-orange-500 to-red-600",
      features: ["Obras", "Infraestruturas", "Manutenção"]
    }
  ];

  const qualityCertifications = [
    { icon: AwardIcon, name: "ISO 9001", color: "from-blue-500 to-indigo-600" },
    { icon: TargetIcon, name: "ISO 14001", color: "from-green-500 to-emerald-600" },
    { icon: AwardIcon, name: "OHSAS 18001", color: "from-purple-500 to-pink-600" },
    { icon: Crown, name: "Excelência", color: "from-yellow-500 to-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Quality Circles */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border-4 border-blue-300/30 rounded-full animate-pulse-glow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 border-4 border-green-300/30 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-20 h-20 border-4 border-purple-300/30 rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        
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
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Enhanced Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center p-6"
        >
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <QualicoreLogo size="lg" variant="full" animated={true} />
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="btn btn-ghost btn-sm hover:bg-blue-50 transition-all duration-300"
            >
              Entrar
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="btn btn-primary btn-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 btn-enhanced"
            >
              Explorar Sistema
            </motion.button>
          </div>
        </motion.header>

        {/* Compact Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col items-center text-center px-8 py-12"
        >
          {/* Enhanced Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200/50 mb-6 shadow-lg animate-pulse-glow"
          >
            <Sparkles className="h-4 w-4 text-emerald-600 mr-2" />
            <span className="text-base md:text-lg font-semibold text-emerald-700">
              Sistema de Gestão da Qualidade 2025
            </span>
          </motion.div>

          {/* Enhanced Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Qualicore
            </span>
            <br />
            <span className="gradient-text-animate">
              Gestão da Qualidade
            </span>
          </motion.h1>

          {/* Enhanced Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl leading-relaxed"
          >
            Plataforma empresarial completa para <span className="font-semibold text-gray-800 bg-gradient-to-r from-blue-100 to-indigo-100 px-2 py-1 rounded">gestão da qualidade</span> 
            em <span className="font-semibold text-gray-800 bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-1 rounded">construção civil</span>.
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="btn btn-primary btn-lg px-8 py-3 shadow-2xl hover:shadow-3xl group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 btn-enhanced"
            >
              <span>Explorar Módulos</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="btn btn-outline btn-lg px-8 py-3 group border-2 hover:bg-blue-50"
            >
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              <span>Aceder ao Sistema</span>
            </motion.button>
          </motion.div>

          {/* Compact Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { value: "20+", label: "Módulos Especializados", color: "from-blue-600 to-indigo-600" },
              { value: "100%", label: "Conformidade", color: "from-emerald-600 to-green-600" },
              { value: "24/7", label: "Disponibilidade", color: "from-purple-600 to-pink-600" },
              { value: "2025", label: "Tecnologia Avançada", color: "from-orange-600 to-red-600" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 stats-card"
              >
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quality Certifications */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="mb-12"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">Certificações de Qualidade</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {qualityCertifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${cert.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <cert.icon className="h-8 w-8 text-white" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Compact Quality Modules Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="px-8 py-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent mb-3">
                Módulos de Qualidade Especializados
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
                Sistema modular completo para gestão da qualidade em construção civil
              </p>
            </div>

            {/* Quality Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {qualityModules.map((module, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer quality-module-card hover-lift"
                  onClick={() => navigate("/dashboard")}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${module.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <module.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-3">{module.description}</p>
                  <div className="space-y-1">
                    {module.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm md:text-base text-gray-500">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Compact Call to Action Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="px-8 py-12 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent mb-4">
              Pronto para implementar na sua empresa?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-6">
              Descubra como o Qualicore pode transformar a gestão da qualidade na sua organização
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="btn btn-primary btn-lg px-8 py-3 shadow-2xl hover:shadow-3xl group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 btn-enhanced"
            >
              <span>Explorar Sistema Completo</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.section>

        {/* Enhanced Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.3 }}
          className="px-8 py-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white"
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <QualicoreLogo size="md" variant="icon" animated={true} />
              <span className="text-2xl md:text-3xl font-bold ml-3">Qualicore</span>
            </div>
            <p className="text-gray-300 mb-4 text-base md:text-lg">
              Sistema de Gestão da Qualidade para Construção Civil
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm md:text-base text-gray-400">
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                <span>Portugal</span>
              </div>
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-1" />
                <span>100% Seguro</span>
              </div>
              <div className="flex items-center">
                <Settings className="h-4 w-4 mr-1" />
                <a
                  href="https://www.linkedin.com/in/antunesmartins/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Desenvolvido por José Antunes
                </a>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
