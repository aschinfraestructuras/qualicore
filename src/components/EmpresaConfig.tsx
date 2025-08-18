import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Save,
  Upload,
  X,
  Image as ImageIcon,
  File as FileIcon,
} from 'lucide-react';
import { reportService, type EmpresaConfig as EmpresaConfigType } from "@/services/reportService";
import { AnimatePresence } from 'framer-motion';

interface EmpresaConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmpresaConfig({ isOpen, onClose }: EmpresaConfigProps) {
  const [config, setConfig] = useState<EmpresaConfigType>({
    nome: "Qualicore",
    morada: "Rua da Qualidade, 123",
    telefone: "+351 123 456 789",
    email: "info@qualicore.pt",
    website: "www.qualicore.pt",
    nif: "123456789",
  });
  const [logotipo, setLogotipo] = useState<string>("");
  const [logotipoFile, setLogotipoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Carregar configuração atual
      carregarConfiguracao();
    }
  }, [isOpen]);

  const carregarConfiguracao = () => {
    // Aqui poderia carregar de localStorage ou API
    const savedConfig = localStorage.getItem("empresaConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    const savedLogotipo = localStorage.getItem("empresaLogotipo");
    if (savedLogotipo) {
      setLogotipo(savedLogotipo);
    }
  };

  const handleLogotipoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        toast.error("O arquivo é muito grande. Máximo 5MB.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione apenas arquivos de imagem.");
        return;
      }

      setLogotipoFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogotipo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validar campos obrigatórios
      if (!config.nome.trim()) {
        toast.error("Nome da empresa é obrigatório");
        return;
      }

      if (!config.nif.trim()) {
        toast.error("NIF é obrigatório");
        return;
      }

      // Salvar configuração
      localStorage.setItem("empresaConfig", JSON.stringify(config));

      if (logotipo) {
        localStorage.setItem("empresaLogotipo", logotipo);
      }

      toast.success("Configuração salva com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast.error("Erro ao salvar configuração");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Configuração da Empresa</h2>
                  <p className="text-sm text-gray-600">Configure os dados da sua empresa</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="p-6 space-y-6">
            {/* Logotipo */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Logotipo da Empresa
              </h3>
              <div className="flex items-center space-x-4">
                {logotipo && (
                  <div className="w-20 h-20 border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={logotipo}
                      alt="Logotipo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogotipoChange}
                    className="hidden"
                    id="logotipo-input"
                  />
                  <label
                    htmlFor="logotipo-input"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {logotipo ? "Alterar Logotipo" : "Carregar Logotipo"}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG até 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Informações da Empresa */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileIcon className="h-5 w-5 mr-2" />
                Informações da Empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    value={config.nome}
                    onChange={(e) => setConfig({ ...config, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome da empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIF *
                  </label>
                  <input
                    type="text"
                    value={config.nif}
                    onChange={(e) => setConfig({ ...config, nif: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123456789"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Morada
                  </label>
                  <input
                    type="text"
                    value={config.morada}
                    onChange={(e) => setConfig({ ...config, morada: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rua da Qualidade, 123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={config.telefone}
                    onChange={(e) => setConfig({ ...config, telefone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+351 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={config.email}
                    onChange={(e) => setConfig({ ...config, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="info@empresa.pt"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={config.website}
                    onChange={(e) => setConfig({ ...config, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="www.empresa.pt"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? "Salvando..." : "Salvar"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
