import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  X,
  FileText,
  Calendar,
  User,
  MapPin,
  Building,
  AlertCircle,
  Upload,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DocumentUpload from "../DocumentUpload";

const documentoSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  tipo: z.enum([
    "projeto",
    "especificacao",
    "relatorio",
    "certificado",
    "rfi",
    "procedimento",
    "plano_ensaio",
    "plano_qualidade",
    "manual",
    "instrucao_trabalho",
    "formulario",
    "registro",
    "outro",
  ]),
  versao: z.string().min(1, "Versão é obrigatória"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  zona: z.string().min(1, "Zona é obrigatória"),
  estado: z.enum([
    "pendente",
    "em_analise",
    "aprovado",
    "reprovado",
    "concluido",
  ]),
  classificacao_confidencialidade: z
    .enum(["publico", "interno", "confidencial", "restrito"])
    .optional(),
  documents: z.array(z.any()).optional(),
}).passthrough(); // Permite campos adicionais

type DocumentoFormData = z.infer<typeof documentoSchema>;

interface DocumentoFormProps {
  onSubmit: (data: DocumentoFormData) => void;
  onCancel: () => void;
  initialData?: Partial<DocumentoFormData> & { documents?: any[]; id?: string };
  isEditing?: boolean;
}

const documentTypes = [
  {
    value: "projeto",
    label: "Projeto",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    value: "especificacao",
    label: "Especificação",
    icon: FileText,
    color: "text-green-600",
  },
  {
    value: "relatorio",
    label: "Relatório",
    icon: FileText,
    color: "text-purple-600",
  },
  {
    value: "certificado",
    label: "Certificado",
    icon: FileText,
    color: "text-yellow-600",
  },
  {
    value: "rfi",
    label: "RFI",
    icon: FileText,
    color: "text-red-600",
  },
  {
    value: "procedimento",
    label: "Procedimento",
    icon: FileText,
    color: "text-indigo-600",
  },
  {
    value: "plano_ensaio",
    label: "Plano de Ensaio",
    icon: FileText,
    color: "text-pink-600",
  },
  {
    value: "plano_qualidade",
    label: "Plano de Qualidade",
    icon: FileText,
    color: "text-orange-600",
  },
  {
    value: "manual",
    label: "Manual",
    icon: FileText,
    color: "text-teal-600",
  },
  {
    value: "instrucao_trabalho",
    label: "Instrução de Trabalho",
    icon: FileText,
    color: "text-cyan-600",
  },
  {
    value: "formulario",
    label: "Formulário",
    icon: FileText,
    color: "text-lime-600",
  },
  {
    value: "registro",
    label: "Registro",
    icon: FileText,
    color: "text-emerald-600",
  },
  {
    value: "outro",
    label: "Outro",
    icon: FileText,
    color: "text-gray-600",
  },
];

const statusOptions = [
  {
    value: "pendente",
    label: "Pendente",
    color: "badge-warning",
  },
  {
    value: "em_analise",
    label: "Em Análise",
    color: "badge-info",
  },
  {
    value: "aprovado",
    label: "Aprovado",
    color: "badge-success",
  },
  {
    value: "reprovado",
    label: "Reprovado",
    color: "badge-error",
  },
  {
    value: "concluido",
    label: "Concluído",
    color: "badge-primary",
  },
];

const categorias = [
  { value: "tecnico", label: "Técnico" },
  { value: "administrativo", label: "Administrativo" },
  { value: "seguranca", label: "Segurança" },
  { value: "ambiente", label: "Ambiente" },
  { value: "qualidade", label: "Qualidade" },
  { value: "comercial", label: "Comercial" },
  { value: "outro", label: "Outro" },
];

const classificacoes = [
  { value: "publico", label: "Público" },
  { value: "interno", label: "Interno" },
  { value: "confidencial", label: "Confidencial" },
  { value: "restrito", label: "Restrito" },
];

export default function DocumentoForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: DocumentoFormProps) {
  const [documents, setDocuments] = useState<any[]>(initialData?.documents || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Atualizar documentos quando initialData mudar
  useEffect(() => {
    if (initialData?.documents) {
      setDocuments(initialData.documents);
    }
  }, [initialData?.documents]);
  const [obras, setObras] = useState<any[]>([]);

  // Carregar obras do localStorage
  useEffect(() => {
    const loadObras = () => {
      try {
        const stored = localStorage.getItem("qualicore_obras");
        if (stored) {
          const obrasData = JSON.parse(stored);
          setObras(obrasData);
        }
      } catch (error) {
        console.error("Erro ao carregar obras:", error);
      }
    };
    loadObras();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<DocumentoFormData>({
    mode: "onChange",
    resolver: zodResolver(documentoSchema),
    defaultValues: initialData || {
      estado: "pendente",
      tipo: "projeto",
      versao: "1.0",
      responsavel: "",
      zona: "",
      classificacao_confidencialidade: "publico",
    },
  });

  const watchedTipo = watch("tipo");
  const watchedEstado = watch("estado");

  // Log do estado do formulário
  useEffect(() => {
    console.log("🔍 Estado do formulário:", { isValid, errors });
    if (!isValid && Object.keys(errors).length > 0) {
      console.log("❌ ERROS QUE INVALIDAM O FORMULÁRIO:");
      Object.keys(errors).forEach(key => {
        console.log(`  - ${key}:`, errors[key]);
      });
    }
  }, [isValid, errors]);

  // Gerar código automaticamente se não existir
  useEffect(() => {
    if (!initialData?.codigo) {
      generateCode();
    }
  }, []);

  const onSubmitForm = async (data: DocumentoFormData) => {
    console.log("🚀🚀🚀 onSubmitForm CHAMADO!");
    console.log("📁 Dados do formulário:", data);
    console.log("📁 Documents:", documents);
    console.log("📁 isEditing:", isEditing);
    setIsSubmitting(true);
    try {
      // Enviar apenas os campos essenciais
      const docData: any = {
        codigo: data.codigo,
        tipo: data.tipo,
        versao: data.versao,
        responsavel: data.responsavel,
        zona: data.zona,
        estado: data.estado,
        classificacao_confidencialidade: data.classificacao_confidencialidade,
        documents: documents,
        // Incluir todos os outros campos do initialData se existirem
        ...initialData
      };
      console.log("📁 Chamando onSubmit com dados:", docData);
      onSubmit(docData);
      console.log("📁 onSubmit chamado com sucesso!");
      toast.success(
        isEditing
          ? "Documento atualizado com sucesso!"
          : "Documento criado com sucesso!",
      );
    } catch (error) {
      toast.error("Erro ao salvar documento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateCode = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const code = `DOC-${year}-${month}${day}-${random}`;
    setValue("codigo", code);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmitForm)}
      className="space-y-6"
    >
      {/* Código e Tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código
          </label>
          <div className="flex space-x-2">
            <input
              {...register("codigo")}
              type="text"
              placeholder="Código do documento"
              className="input flex-1"
            />
            <button
              type="button"
              onClick={generateCode}
              className="btn btn-secondary btn-sm"
            >
              Gerar
            </button>
          </div>
          {errors.codigo && (
            <p className="text-red-500 text-sm mt-1">{errors.codigo.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>
          <select {...register("tipo")} className="select">
            <option value="">Selecione...</option>
            {documentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.tipo && (
            <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>
          )}
        </div>
      </div>

      {/* Versão e Estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Versão
          </label>
          <input
            {...register("versao")}
            type="text"
            placeholder="1.0"
            className="input"
          />
          {errors.versao && (
            <p className="text-red-500 text-sm mt-1">{errors.versao.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select {...register("estado")} className="select">
            <option value="">Selecione...</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          {errors.estado && (
            <p className="text-red-500 text-sm mt-1">{errors.estado.message}</p>
          )}
        </div>
      </div>

      {/* Responsável e Zona */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsável
          </label>
          <input
            {...register("responsavel")}
            type="text"
            placeholder="Nome do responsável"
            className="input"
          />
          {errors.responsavel && (
            <p className="text-red-500 text-sm mt-1">{errors.responsavel.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zona
          </label>
          <input
            {...register("zona")}
            type="text"
            placeholder="Zona/Área"
            className="input"
          />
          {errors.zona && (
            <p className="text-red-500 text-sm mt-1">{errors.zona.message}</p>
          )}
        </div>
      </div>

      {/* Datas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Validade
          </label>
          <input
            {...register("data_validade")}
            type="date"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Aprovação
          </label>
          <input
            {...register("data_aprovacao")}
            type="date"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Revisão
          </label>
          <input
            {...register("data_revisao")}
            type="date"
            className="input"
          />
        </div>
      </div>

      {/* Aprovador e Revisor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aprovador
          </label>
          <input
            {...register("aprovador")}
            type="text"
            placeholder="Nome do aprovador"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Revisor
          </label>
          <input
            {...register("revisor")}
            type="text"
            placeholder="Nome do revisor"
            className="input"
          />
        </div>
      </div>

      {/* Categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select {...register("categoria")} className="select">
            <option value="">Selecione...</option>
            {categorias.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Classificação de Confidencialidade
          </label>
          <select {...register("classificacao_confidencialidade")} className="select">
            <option value="">Selecione...</option>
            {classificacoes.map((cls) => (
              <option key={cls.value} value={cls.value}>
                {cls.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observações
        </label>
        <textarea
          {...register("observacoes")}
          placeholder="Descrição detalhada do documento..."
          rows={4}
          className="textarea"
        />
      </div>

      {/* Upload de Ficheiros */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anexos
        </label>
        <DocumentUpload
          recordId={initialData?.id || 'new'}
          recordType="documento"
          onDocumentsChange={setDocuments}
          existingDocuments={initialData?.documents || []}
          maxFiles={10}
          maxSizeMB={10}
          allowedTypes={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']}
        />
      </div>

      {/* Preview do Estado */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Pré-visualização:
        </h4>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Tipo:</span>
            <span
              className={`badge ${documentTypes.find((t) => t.value === watchedTipo)?.color}`}
            >
              {documentTypes.find((t) => t.value === watchedTipo)?.label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Estado:</span>
            <span
              className={`badge ${statusOptions.find((s) => s.value === watchedEstado)?.color}`}
            >
              {statusOptions.find((s) => s.value === watchedEstado)?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary btn-md"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          // disabled={!isValid || isSubmitting}
          className="btn btn-primary btn-md"
          onClick={(e) => {
            console.log("🚀 CLIQUE NO BOTÃO DETECTADO!");
            console.log("📁 isValid:", isValid);
            console.log("📁 isSubmitting:", isSubmitting);
            console.log("📁 errors:", errors);
            
            // Forçar submissão
            e.preventDefault();
            console.log("🚀 Forçando submissão do formulário...");
            handleSubmit(onSubmitForm)();
          }}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="loading-spinner h-4 w-4"></div>
              <span>Guardando...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>{isEditing ? "Atualizar" : "Criar"} Documento</span>
            </div>
          )}
        </button>
      </div>
    </motion.form>
  );
}
