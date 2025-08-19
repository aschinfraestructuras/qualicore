import React, { useState } from "react";
import { ShareService } from "@/services/shareService";
import { Checklist } from "@/types";
import toast from "react-hot-toast";
import {
  X,
  Mail,
  Download,
  Cloud,
  Share2,
  Send,
  FileText,
  CheckCircle,
  AlertCircle,
  ClipboardList,
} from "lucide-react";

interface ShareChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklist: Checklist;
}

export const ShareChecklistModal: React.FC<ShareChecklistModalProps> = ({
  isOpen,
  onClose,
  checklist,
}) => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(`Checklist: ${checklist.codigo}`);
  const [message, setMessage] = useState(
    `Segue em anexo o checklist ${checklist.codigo} - ${checklist.tipo}.\n\nDetalhes:\n- Código: ${checklist.codigo}\n- Tipo: ${checklist.tipo}\n- Responsável: ${checklist.responsavel}\n- Estado: ${checklist.estado}\n- Zona: ${checklist.zona}\n\nCumprimentos,`
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"quick" | "advanced">("quick");

  const shareService = new ShareService();

  const handleShareByEmail = async () => {
    if (!email.trim()) {
      toast.error("Por favor, introduza um endereço de email");
      return;
    }

    setIsLoading(true);
    try {
      await shareService.shareChecklistByEmail(checklist, email, subject, message);
      toast.success("Checklist partilhado por email com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao partilhar checklist:", error);
      toast.error("Erro ao partilhar checklist por email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToBackend = async () => {
    setIsLoading(true);
    try {
      await shareService.saveChecklistToBackend(checklist);
      toast.success("Checklist guardado no backend com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao guardar checklist:", error);
      toast.error("Erro ao guardar checklist no backend");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadLocally = async () => {
    setIsLoading(true);
    try {
      await shareService.downloadChecklistLocally(checklist);
      toast.success("Checklist descarregado localmente com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao descarregar checklist:", error);
      toast.error("Erro ao descarregar checklist localmente");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Share2 className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Partilhar Checklist
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Checklist Info */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClipboardList className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {checklist.codigo}
              </h3>
              <p className="text-gray-600 capitalize">{checklist.tipo}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {checklist.responsavel}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {checklist.estado}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {checklist.zona}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("quick")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "quick"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Ações Rápidas
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "advanced"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Opções Avançadas
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "quick" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Email */}
                <button
                  onClick={handleShareByEmail}
                  disabled={isLoading}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <Mail className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Partilhar por Email
                  </span>
                  <span className="text-xs text-gray-500 text-center mt-1">
                    Enviar PDF por email
                  </span>
                </button>

                {/* Backend */}
                <button
                  onClick={handleSaveToBackend}
                  disabled={isLoading}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors disabled:opacity-50"
                >
                  <Cloud className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Guardar no Backend
                  </span>
                  <span className="text-xs text-gray-500 text-center mt-1">
                    Armazenar na nuvem
                  </span>
                </button>

                {/* Download */}
                <button
                  onClick={handleDownloadLocally}
                  disabled={isLoading}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors disabled:opacity-50"
                >
                  <Download className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Descarregar Localmente
                  </span>
                  <span className="text-xs text-gray-500 text-center mt-1">
                    Guardar no PC
                  </span>
                </button>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">A processar...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Email Configuration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Destinatário
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@empresa.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleShareByEmail}
                  disabled={isLoading || !email.trim()}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Email
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
