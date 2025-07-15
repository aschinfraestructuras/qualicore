import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Upload,
  Save,
  X,
  Image as ImageIcon,
  Phone,
  Mail,
  Globe,
  MapPin,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { reportService, type EmpresaConfig } from "@/services/reportService";

interface EmpresaConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmpresaConfig({ isOpen, onClose }: EmpresaConfigProps) {
  const [config, setConfig] = useState<EmpresaConfig>({
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

      // Atualizar serviço de relatórios
      reportService.atualizarConfigEmpresa(config);
      if (logotipo) {
        reportService.definirLogotipo(logotipo);
      }

      toast.success("Configuração da empresa salva com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast.error("Erro ao salvar configuração");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfig({
      nome: "Qualicore",
      morada: "Rua da Qualidade, 123",
      telefone: "+351 123 456 789",
      email: "info@qualicore.pt",
      website: "www.qualicore.pt",
      nif: "123456789",
    });
    setLogotipo("");
    setLogotipoFile(null);
    toast.success("Configuração resetada para valores padrão");
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-semibold">
                  Configuração da Empresa
                </h2>
                <p className="text-blue-100">
                  Configure os dados da sua empresa para os relatórios
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Logotipo */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Logotipo da Empresa
              </h3>

              <div className="space-y-4">
                {logotipo && (
                  <div className="flex items-center space-x-4">
                    <img
                      src={logotipo}
                      alt="Logotipo"
                      className="w-20 h-20 object-contain border border-gray-300 rounded-lg"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Logotipo atual</p>
                      <button
                        onClick={() => {
                          setLogotipo("");
                          setLogotipoFile(null);
                        }}
                        className="text-red-600 text-sm hover:text-red-800"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogotipoChange}
                    className="hidden"
                    id="logotipo-upload"
                  />
                  <label
                    htmlFor="logotipo-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {logotipo ? "Alterar logotipo" : "Carregar logotipo"}
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Informações da Empresa */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
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
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, nome: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIF *
                  </label>
                  <input
                    type="text"
                    value={config.nif}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, nif: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123456789"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Morada
                  </label>
                  <input
                    type="text"
                    value={config.morada}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, morada: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Rua da Qualidade, 123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={config.telefone}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        telefone: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+351 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={config.email}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="info@empresa.pt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="h-4 w-4 inline mr-1" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={config.website}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="www.empresa.pt"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Pré-visualização do Cabeçalho
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center space-x-4">
                  {logotipo && (
                    <img
                      src={logotipo}
                      alt="Logo"
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {config.nome}
                    </h4>
                    <p className="text-sm text-gray-600">{config.morada}</p>
                    <p className="text-sm text-gray-600">
                      Tel: {config.telefone} | Email: {config.email}
                    </p>
                    {config.website && (
                      <p className="text-sm text-gray-600">{config.website}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Resetar
            </button>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? "A guardar..." : "Guardar"}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
