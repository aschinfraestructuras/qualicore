import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import { RFI } from '../../types'
import { HelpCircle, AlertCircle, Upload, X, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import DocumentUpload from "../DocumentUpload";

const rfiSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  solicitante: z.string().min(1, "Solicitante é obrigatório"),
  destinatario: z.string().min(1, "Destinatário é obrigatório"),
  data_solicitacao: z.string().min(1, "Data de solicitação é obrigatória"),
  prioridade: z.enum(["baixa", "media", "alta", "urgente"]),
  status: z.enum(["pendente", "em_analise", "respondido", "fechado"]),
  resposta: z.string().optional(),
  impacto_custo: z.number().default(0),
  impacto_prazo: z.number().default(0),
  observacoes: z.string().optional(),
  anexos: z.array(z.any()).optional(),
});

type RFIFormData = z.infer<typeof rfiSchema>;

interface RFIFormProps {
  initialData?: Partial<RFIFormData> & { id?: string; documents?: any[] };
  onSubmit: (data: RFIFormData) => void;
  onCancel: () => void;
}

const prioridades = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
  { value: "urgente", label: "Urgente" },
];

const statusOptions = [
  { value: "pendente", label: "Pendente" },
  { value: "em_analise", label: "Em Análise" },
  { value: "respondido", label: "Respondido" },
  { value: "fechado", label: "Fechado" },
];

const generateCodigo = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `RFI-${year}-${month}${day}-${random}`;
};

export default function RFIForm({
  initialData,
  onSubmit,
  onCancel,
}: RFIFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<any[]>(initialData?.documents || []);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<RFIFormData & { codigo: string }>({
    resolver: zodResolver(rfiSchema),
    defaultValues: {
      prioridade: "media",
      status: "pendente",
      impacto_custo: 0,
      impacto_prazo: 0,
      ...initialData,
      codigo: initialData?.codigo || generateCodigo(),
    },
  });

  // Garante que sempre há um código gerado
  useEffect(() => {
    if (!watch("codigo")) {
      setValue("codigo", generateCodigo());
    }
  }, []);

  // Atualizar documentos quando initialData mudar
  useEffect(() => {
    if (initialData?.documents) {
      setDocuments(initialData.documents);
    }
  }, [initialData?.documents]);

  const onSubmitForm = async (data: RFIFormData) => {
    console.log("🚀 onSubmitForm chamado!");
    setIsSubmitting(true);
    try {
      console.log("🚀 Formulário RFI submetido!");
      console.log("📁 Documents do DocumentUpload:", documents);

      const processedData = {
        ...data,
        documents: documents, // Usar documents do DocumentUpload
      };

      console.log("📁 Dados processados:", processedData);
      console.log("📁 Documents:", processedData.documents);
      console.log("📁 Documents length:", processedData.documents?.length);

      await new Promise((resolve) => setTimeout(resolve, 500));
      // Garante que o campo 'codigo' está presente
      if (!data.codigo) {
        setValue("codigo", generateCodigo());
        data.codigo = generateCodigo();
      }
      console.log("🚀 Chamando onSubmit com dados:", processedData);
      onSubmit(processedData);
      toast.success("RFI salvo com sucesso!");
    } catch (error) {
      console.error("❌ Erro no onSubmitForm:", error);
      toast.error("Erro ao salvar RFI");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <form 
      onSubmit={handleSubmit(onSubmitForm)} 
      className="space-y-6"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-blue-900">
          {initialData ? "Editar RFI" : "Novo RFI"}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código *
          </label>
          <div className="flex gap-2">
            <input
              {...register("codigo")}
              type="text"
              className="input"
              placeholder="RFI-2024-001"
            />
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setValue("codigo", generateCodigo())}
            >
              Gerar Código
            </button>
          </div>
          {errors.codigo && (
            <p className="text-xs text-danger-600 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.codigo.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número *
          </label>
          <input
            {...register("numero")}
            type="text"
            className="input"
            placeholder="RFI-2024-001"
          />
          {errors.numero && (
            <p className="text-xs text-danger-600 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.numero.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            {...register("titulo")}
            type="text"
            className="input"
            placeholder="Assunto do pedido"
          />
          {errors.titulo && (
            <p className="text-xs text-danger-600 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.titulo.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Solicitante *
          </label>
          <input
            {...register("solicitante")}
            type="text"
            className="input"
            placeholder="Nome do solicitante"
          />
          {errors.solicitante && (
            <p className="text-xs text-danger-600 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.solicitante.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destinatário *
          </label>
          <input
            {...register("destinatario")}
            type="text"
            className="input"
            placeholder="Nome do destinatário"
          />
          {errors.destinatario && (
            <p className="text-xs text-danger-600 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.destinatario.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Solicitação *
          </label>
          <input
            {...register("data_solicitacao")}
            type="date"
            className="input"
          />
          {errors.data_solicitacao && (
            <p className="text-xs text-danger-600 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.data_solicitacao.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridade *
          </label>
          <select {...register("prioridade")} className="select">
            {prioridades.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select {...register("status")} className="select">
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Impacto no Custo (€)
          </label>
          <input
            {...register("impacto_custo", { valueAsNumber: true })}
            type="number"
            className="input"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Impacto no Prazo (dias)
          </label>
          <input
            {...register("impacto_prazo", { valueAsNumber: true })}
            type="number"
            className="input"
            placeholder="0"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição *
        </label>
        <textarea
          {...register("descricao")}
          rows={3}
          className="textarea"
          placeholder="Descreva a dúvida ou pedido de informação..."
        />
        {errors.descricao && (
          <p className="text-xs text-danger-600 mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.descricao.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resposta
        </label>
        <textarea
          {...register("resposta")}
          rows={2}
          className="textarea"
          placeholder="Resposta ao pedido (se aplicável)..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea
          {...register("observacoes")}
          rows={2}
          className="textarea"
          placeholder="Observações adicionais..."
        />
      </div>
      
      {/* Anexos - DocumentUpload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anexos (Documentos)
        </label>
        <DocumentUpload
          recordId={initialData?.id || 'new'}
          recordType="ensaio"
          onDocumentsChange={setDocuments}
          existingDocuments={initialData?.documents || []}
          maxFiles={10}
          maxSizeMB={10}
          allowedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png']}
        />
      </div>
      
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isValid || isSubmitting}

        >
          {isSubmitting ? "Guardando..." : "Salvar RFI"}
        </button>
        

      </div>
    </form>
  );
}
