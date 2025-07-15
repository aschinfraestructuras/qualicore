import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Download,
  Trash2,
  Eye,
  X,
  FolderOpen,
  File,
  Calendar,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  dataUpload: string;
  uploader: string;
  url: string;
  categoria: "relatorio" | "documento" | "certificado" | "outro";
}

interface DocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentUpload({
  isOpen,
  onClose,
}: DocumentUploadProps) {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<Documento["categoria"]>("documento");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    Documento["categoria"] | "todos"
  >("todos");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar documentos salvos
  useEffect(() => {
    const savedDocs = localStorage.getItem("documentosUpload");
    if (savedDocs) {
      setDocumentos(JSON.parse(savedDocs));
    }
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const newDocs: Documento[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validar tamanho (máximo 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`Arquivo ${file.name} é muito grande. Máximo 10MB.`);
          continue;
        }

        // Criar URL para o arquivo
        const url = URL.createObjectURL(file);

        const doc: Documento = {
          id: Date.now().toString() + i,
          nome: file.name,
          tipo: file.type || "application/octet-stream",
          tamanho: file.size,
          dataUpload: new Date().toISOString(),
          uploader: "Utilizador Atual", // Aqui poderia pegar do contexto de auth
          url,
          categoria: selectedCategory,
        };

        newDocs.push(doc);
      }

      // Adicionar à lista
      const updatedDocs = [...documentos, ...newDocs];
      setDocumentos(updatedDocs);

      // Salvar no localStorage
      localStorage.setItem("documentosUpload", JSON.stringify(updatedDocs));

      toast.success(`${newDocs.length} documento(s) carregado(s) com sucesso!`);

      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Erro ao carregar arquivos:", error);
      toast.error("Erro ao carregar arquivos");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = (id: string) => {
    const updatedDocs = documentos.filter((doc) => doc.id !== id);
    setDocumentos(updatedDocs);
    localStorage.setItem("documentosUpload", JSON.stringify(updatedDocs));
    toast.success("Documento removido com sucesso!");
  };

  const handleDownloadDocument = (doc: Documento) => {
    const a = document.createElement("a");
    a.href = doc.url;
    a.download = doc.nome;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Download de ${doc.nome} iniciado`);
  };

  const handleViewDocument = (doc: Documento) => {
    window.open(doc.url, "_blank");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (tipo: string) => {
    if (tipo.includes("pdf"))
      return <FileText className="h-5 w-5 text-red-500" />;
    if (tipo.includes("image"))
      return <FileText className="h-5 w-5 text-green-500" />;
    if (tipo.includes("word") || tipo.includes("document"))
      return <FileText className="h-5 w-5 text-blue-500" />;
    if (tipo.includes("excel") || tipo.includes("spreadsheet"))
      return <FileText className="h-5 w-5 text-green-600" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const filteredDocs = documentos.filter((doc) => {
    const matchesSearch = doc.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "todos" || doc.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FolderOpen className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-semibold">Gestão de Documentos</h2>
                <p className="text-green-100">
                  Carregue e organize documentos do seu PC
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Carregar Documentos
                </h3>
                <p className="text-gray-600 mb-4">
                  Arraste e largue arquivos aqui ou clique para selecionar
                </p>

                <div className="flex items-center justify-center space-x-4 mb-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) =>
                      setSelectedCategory(
                        e.target.value as Documento["categoria"],
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="documento">Documento</option>
                    <option value="relatorio">Relatório</option>
                    <option value="certificado">Certificado</option>
                    <option value="outro">Outro</option>
                  </select>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer transition-colors ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploading ? "A carregar..." : "Selecionar Arquivos"}
                  </label>
                </div>

                <p className="text-sm text-gray-500">
                  Formatos suportados: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT
                  <br />
                  Tamanho máximo: 10MB por arquivo
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar documentos..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="todos">Todas as categorias</option>
                  <option value="documento">Documentos</option>
                  <option value="relatorio">Relatórios</option>
                  <option value="certificado">Certificados</option>
                  <option value="outro">Outros</option>
                </select>
              </div>
            </div>

            {/* Documents List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Documentos ({filteredDocs.length})
                </h3>
                {documentos.length > 0 && (
                  <button
                    onClick={() => {
                      setDocumentos([]);
                      localStorage.removeItem("documentosUpload");
                      toast.success("Todos os documentos removidos");
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Limpar todos
                  </button>
                )}
              </div>

              {filteredDocs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhum documento encontrado</p>
                  <p className="text-sm">
                    Carregue alguns documentos para começar
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredDocs.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          {getFileIcon(doc.tipo)}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {doc.nome}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{formatFileSize(doc.tamanho)}</span>
                              <span className="capitalize">
                                {doc.categoria}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(doc.dataUpload).toLocaleDateString(
                                  "pt-PT",
                                )}
                              </span>
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {doc.uploader}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDocument(doc)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadDocument(doc)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {documentos.length} documento(s) no total
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
