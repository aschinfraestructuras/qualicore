import {
  Ensaio,
  Documento,
  Checklist,
  Material,
  Fornecedor,
  NaoConformidade,
  Obra,
} from "@/types";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Building,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Upload,
  X,
  FileText,
  User,
  Hash,
  Globe,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import DocumentUpload from "../DocumentUpload";

const fornecedorSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  nif: z
    .string()
    .min(9, "NIF deve ter pelo menos 9 dígitos")
    .max(9, "NIF deve ter no máximo 9 dígitos"),
  morada: z.string().min(1, "Morada é obrigatória"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),
  contacto: z.string().min(1, "Contacto é obrigatório"),
  estado: z.enum(["ativo", "inativo"]),
  website: z.string().optional(),
  certificacoes: z.string().optional(),
  produtos_servicos: z.string().optional(),
  observacoes: z.string().optional(),
  documents: z.array(z.any()).optional(),
}).passthrough(); // Permite campos adicionais

type FornecedorFormData = z.infer<typeof fornecedorSchema>;

interface FornecedorFormProps {
  onSubmit: (data: FornecedorFormData) => void;
  onCancel: () => void;
  initialData?: Partial<FornecedorFormData>;
  isEditing?: boolean;
}

const statusOptions = [
  { value: "ativo", label: "Ativo", color: "bg-success-100 text-success-700" },
  { value: "inativo", label: "Inativo", color: "bg-gray-100 text-gray-700" },
];

export default function FornecedorForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: FornecedorFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]); // Mock data
  const [documents, setDocuments] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<FornecedorFormData>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: initialData || {
      estado: "ativo",
      website: "",
      certificacoes: "",
      produtos_servicos: "",
      observacoes: "",
    },
  });

  const watchedEstado = watch("estado");
  const watchedWebsite = watch("website");
  const watchedCertificacoes = watch("certificacoes");
  const watchedProdutosServicos = watch("produtos_servicos");

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
    toast.success(`${files.length} ficheiro(s) adicionado(s)`);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitForm = async (data: FornecedorFormData) => {
    console.log("🚀 onSubmitForm chamado!");
    setIsSubmitting(true);
    try {
      console.log("📁 Dados do fornecedor:", data);
      console.log("📁 Documents:", documents);

      const processedData = {
        ...data,
        documents: documents, // Usar documents do DocumentUpload
      };

      console.log("📁 Dados processados:", processedData);
      
      // Simular delay de submissão
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSubmit(processedData);
      toast.success(
        isEditing
          ? "Fornecedor atualizado com sucesso!"
          : "Fornecedor registado com sucesso!",
      );
    } catch (error) {
      console.error("❌ Erro no onSubmitForm:", error);
      toast.error("Erro ao salvar fornecedor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateNIF = (nif: string) => {
    // Validação básica de NIF português
    if (nif.length !== 9) return false;

    const weights = [9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;

    for (let i = 0; i < 8; i++) {
      sum += parseInt(nif[i]) * weights[i];
    }

    const remainder = sum % 11;
    const checkDigit = remainder === 0 || remainder === 1 ? 0 : 11 - remainder;

    return parseInt(nif[8]) === checkDigit;
  };

  const handleNIFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nif = e.target.value.replace(/\D/g, "");
    setValue("nif", nif);

    if (nif.length === 9) {
      if (validateNIF(nif)) {
        toast.success("NIF válido!");
      } else {
        toast.error("NIF inválido!");
      }
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmitForm)}
      className="space-y-6"
    >
      {/* Header do Formulário */}
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600">
          <Building className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Editar Fornecedor" : "Novo Fornecedor"}
          </h3>
          <p className="text-sm text-gray-600">
            {isEditing
              ? "Atualize as informações do fornecedor"
              : "Registe um novo fornecedor"}
          </p>
        </div>
      </div>

      {/* Informações Empresariais */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2 text-cyan-600" />
          Informações Empresariais
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome da Empresa */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Empresa *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register("nome")}
                type="text"
                placeholder="Nome da empresa"
                className={`input pl-10 ${errors.nome ? "border-danger-500" : ""}`}
              />
            </div>
            {errors.nome && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.nome.message}
              </p>
            )}
          </div>

          {/* NIF */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NIF *
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register("nif")}
                type="text"
                placeholder="123456789"
                maxLength={9}
                onChange={handleNIFChange}
                className={`input pl-10 ${errors.nif ? "border-danger-500" : ""}`}
              />
            </div>
            {errors.nif && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.nif.message}
              </p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select
              {...register("estado")}
              className={`select ${errors.estado ? "border-danger-500" : ""}`}
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            {errors.estado && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.estado.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Informações de Contacto */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-cyan-600" />
          Informações de Contacto
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome do Contacto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Contacto *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register("contacto")}
                type="text"
                placeholder="Nome do contacto principal"
                className={`input pl-10 ${errors.contacto ? "border-danger-500" : ""}`}
              />
            </div>
            {errors.contacto && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.contacto.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register("email")}
                type="email"
                placeholder="contacto@empresa.pt"
                className={`input pl-10 ${errors.email ? "border-danger-500" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register("telefone")}
                type="tel"
                placeholder="+351 123 456 789"
                className={`input pl-10 ${errors.telefone ? "border-danger-500" : ""}`}
              />
            </div>
            {errors.telefone && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.telefone.message}
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register("website")}
                type="url"
                placeholder="https://www.empresa.pt"
                className="input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Morada */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-cyan-600" />
          Morada
        </h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Morada Completa *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <textarea
              {...register("morada")}
              placeholder="Rua, número, andar, código postal, localidade"
              rows={3}
              className={`textarea pl-10 ${errors.morada ? "border-danger-500" : ""}`}
            />
          </div>
          {errors.morada && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.morada.message}
            </p>
          )}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-cyan-600" />
          Informações Adicionais
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certificações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificações
            </label>
            <textarea
              {...register("certificacoes")}
              placeholder="ISO 9001, ISO 14001, etc."
              rows={3}
              className="textarea"
            />
          </div>

          {/* Produtos/Serviços */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produtos/Serviços
            </label>
            <textarea
              {...register("produtos_servicos")}
              placeholder="Principais produtos ou serviços fornecidos"
              rows={3}
              className="textarea"
            />
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-cyan-600" />
          Observações
        </h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações Adicionais
          </label>
          <textarea
            {...register("observacoes")}
            placeholder="Observações, notas ou comentários adicionais sobre o fornecedor"
            rows={4}
            className="textarea"
          />
        </div>
      </div>

      {/* Avaliações do Fornecedor */}
      <div className="bg-white rounded-xl p-6 mt-8 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-500" />
          Avaliações do Fornecedor
        </h4>
        {/* Listagem de avaliações (mock) */}
        <div className="space-y-4 mb-4">
          {/* Aqui será listado cada avaliação (mock) */}
          {avaliacoes.map((avaliacao) => (
            <div
              key={avaliacao.id}
              className="p-4 bg-gray-50 rounded flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="font-medium text-gray-800">
                  Nota Global:{" "}
                  <span className="text-yellow-600 font-bold">
                    {avaliacao.nota}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Por: {avaliacao.avaliador} em{" "}
                  {new Date(avaliacao.data).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  Qualidade: {avaliacao.criterios.qualidade} | Prazo:{" "}
                  {avaliacao.criterios.prazo} | Preço:{" "}
                  {avaliacao.criterios.preco} | Atendimento:{" "}
                  {avaliacao.criterios.atendimento}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  "{avaliacao.comentarios}"
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowAvaliacaoModal(true)}
        >
          + Nova Avaliação
        </button>
        {/* Modal de avaliação será implementado depois */}
      </div>

      {/* Modal de Avaliação */}
      {showAvaliacaoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-500" />
                  Nova Avaliação
                </h3>
                <button
                  onClick={() => setShowAvaliacaoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const novaAvaliacao = {
                    id: Date.now().toString(),
                    fornecedor_id: "mock-id", // Será substituído pelo ID real quando integrado com backend
                    data: new Date().toISOString(),
                    avaliador: formData.get("avaliador") as string,
                    nota: parseInt(formData.get("nota") as string),
                    criterios: {
                      qualidade: parseInt(formData.get("qualidade") as string),
                      prazo: parseInt(formData.get("prazo") as string),
                      preco: parseInt(formData.get("preco") as string),
                      atendimento: parseInt(
                        formData.get("atendimento") as string,
                      ),
                    },
                    comentarios: formData.get("comentarios") as string,
                  };
                  setAvaliacoes([...avaliacoes, novaAvaliacao]);
                  setShowAvaliacaoModal(false);
                  toast.success("Avaliação registada com sucesso!");
                }}
              >
                <div className="space-y-4">
                  {/* Avaliador */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avaliador
                    </label>
                    <input
                      name="avaliador"
                      type="text"
                      required
                      placeholder="Nome do avaliador"
                      className="input"
                    />
                  </div>

                  {/* Nota Global */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nota Global
                    </label>
                    <select name="nota" required className="input">
                      <option value="">Selecionar nota</option>
                      <option value="1">1 - Muito Mau</option>
                      <option value="2">2 - Mau</option>
                      <option value="3">3 - Regular</option>
                      <option value="4">4 - Bom</option>
                      <option value="5">5 - Excelente</option>
                    </select>
                  </div>

                  {/* Critérios */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Critérios de Avaliação
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Qualidade
                        </label>
                        <select
                          name="qualidade"
                          required
                          className="input text-sm"
                        >
                          <option value="">-</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Prazo
                        </label>
                        <select name="prazo" required className="input text-sm">
                          <option value="">-</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Preço
                        </label>
                        <select name="preco" required className="input text-sm">
                          <option value="">-</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Atendimento
                        </label>
                        <select
                          name="atendimento"
                          required
                          className="input text-sm"
                        >
                          <option value="">-</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Comentários */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentários
                    </label>
                    <textarea
                      name="comentarios"
                      rows={3}
                      placeholder="Observações sobre a avaliação..."
                      className="textarea"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAvaliacaoModal(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    Guardar Avaliação
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Upload de Ficheiros */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Documentos (Relatórios, PDFs, Imagens, etc.)
        </label>
        <DocumentUpload
          recordId={(initialData as any)?.id || 'new'}
          recordType="fornecedor"
          onDocumentsChange={setDocuments}
          existingDocuments={(initialData as any)?.documents || []}
          maxFiles={10}
          maxSizeMB={10}
          allowedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png']}
        />
      </div>

      {/* Preview do Resultado */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Pré-visualização:
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Estado:</span>
            <span
              className={`badge ${statusOptions.find((s) => s.value === watchedEstado)?.color}`}
            >
              {statusOptions.find((s) => s.value === watchedEstado)?.label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">NIF:</span>
            <span className="badge bg-gray-100 text-gray-700">
              {watch("nif")}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Contacto:</span>
            <span className="badge bg-cyan-100 text-cyan-700">
              {watch("contacto")}
            </span>
          </div>
          {watchedWebsite && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Website:</span>
              <span className="badge bg-blue-100 text-blue-700">
                {watchedWebsite}
              </span>
            </div>
          )}
          {watchedCertificacoes && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Certificações:</span>
              <span className="badge bg-purple-100 text-purple-700">
                {watchedCertificacoes}
              </span>
            </div>
          )}
          {watchedProdutosServicos && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Produtos/Serviços:</span>
              <span className="badge bg-green-100 text-green-700">
                {watchedProdutosServicos}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline btn-md"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-md"
          disabled={isSubmitting || !isValid}
          onClick={(e) => {
            console.log("🚀 CLIQUE NO BOTÃO FORNECEDOR DETECTADO!");
            console.log("📁 isValid:", isValid);
            console.log("📁 isSubmitting:", isSubmitting);
            console.log("📁 errors:", errors);
            
            // Forçar submissão se o formulário não estiver válido
            if (!isValid) {
              e.preventDefault();
              console.log("🚀 Forçando submissão do formulário...");
              handleSubmit(onSubmitForm)();
            }
          }}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Salvando...
            </>
          ) : (
            <>{isEditing ? "Atualizar" : "Registar"} Fornecedor</>
          )}
        </button>
      </div>
    </motion.form>
  );
}
