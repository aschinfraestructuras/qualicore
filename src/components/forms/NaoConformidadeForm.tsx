import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { naoConformidadesAPI } from "@/lib/supabase-api";
import type { NaoConformidade } from "@/types";
import DocumentUpload from "../DocumentUpload";

// Schema de validação
const naoConformidadeSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  tipo_outro: z.string().optional(),
  severidade: z.string().min(1, "Severidade é obrigatória"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  categoria_outro: z.string().optional(),
  data_deteccao: z.string().min(1, "Data de deteção é obrigatória"),
  data_resolucao: z.string().optional(),
  data_limite_resolucao: z.string().optional(),
  data_verificacao_eficacia: z.string().optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  causa_raiz: z.string().optional(),
  impacto: z.string().min(1, "Impacto é obrigatório"),
  area_afetada: z.string().min(1, "Área afetada é obrigatória"),
  responsavel_deteccao: z.string().min(1, "Responsável pela deteção é obrigatório"),
  responsavel_resolucao: z.string().optional(),
  responsavel_verificacao: z.string().optional(),
  acao_corretiva: z.string().optional(),
  acao_preventiva: z.string().optional(),
  medidas_implementadas: z.array(z.string()).optional(),
  custo_estimado: z.number().optional(),
  custo_real: z.number().optional(),
  custo_preventivo: z.number().optional(),
  observacoes: z.string().optional(),
  relacionado_ensaio_id: z.string().optional(),
  relacionado_ensaio_outro: z.string().optional(),
  relacionado_material_id: z.string().optional(),
  relacionado_material_outro: z.string().optional(),
  relacionado_checklist_id: z.string().optional(),
  relacionado_checklist_outro: z.string().optional(),
  relacionado_documento_id: z.string().optional(),
  relacionado_fornecedor_id: z.string().optional(),
  relacionado_fornecedor_outro: z.string().optional(),
  relacionado_obra_id: z.string().optional(),
  relacionado_obra_outro: z.string().optional(),
  relacionado_zona_id: z.string().optional(),
  relacionado_zona_outro: z.string().optional(),
  auditoria_id: z.string().optional(),
  auditoria_outro: z.string().optional(),
  anexos_evidencia: z.array(z.string()).optional(),
  anexos_corretiva: z.array(z.string()).optional(),
  anexos_verificacao: z.array(z.string()).optional(),
  timeline: z.array(z.any()).optional(),
});

type NaoConformidadeFormData = z.infer<typeof naoConformidadeSchema>;

interface NaoConformidadeFormProps {
  naoConformidade?: NaoConformidade;
  onSubmit: (data: NaoConformidadeFormData) => void;
  onCancel: () => void;
}

export default function NaoConformidadeForm({
  naoConformidade,
  onSubmit,
  onCancel,
}: NaoConformidadeFormProps) {
  const [obras, setObras] = useState<any[]>([]);
  const [materiais, setMateriais] = useState<any[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [ensaios, setEnsaios] = useState<any[]>([]);
  const [checklists, setChecklists] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [zonas, setZonas] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState({
    evidencia: [] as File[],
    corretiva: [] as File[],
    verificacao: [] as File[],
  });
  const [documents, setDocuments] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NaoConformidadeFormData>({
    resolver: zodResolver(naoConformidadeSchema),
    defaultValues: {
      codigo: naoConformidade?.codigo || `NC-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      tipo: naoConformidade?.tipo || "",
      tipo_outro: naoConformidade?.tipo_outro || "",
      severidade: naoConformidade?.severidade || "",
      categoria: naoConformidade?.categoria || "",
      categoria_outro: naoConformidade?.categoria_outro || "",
      data_deteccao: naoConformidade?.data_deteccao || new Date().toISOString().split('T')[0],
      data_resolucao: naoConformidade?.data_resolucao || "",
      data_limite_resolucao: naoConformidade?.data_limite_resolucao || "",
      data_verificacao_eficacia: naoConformidade?.data_verificacao_eficacia || "",
      descricao: naoConformidade?.descricao || "",
      causa_raiz: naoConformidade?.causa_raiz || "",
      impacto: naoConformidade?.impacto || "",
      area_afetada: naoConformidade?.area_afetada || "",
      responsavel_deteccao: naoConformidade?.responsavel_deteccao || "",
      responsavel_resolucao: naoConformidade?.responsavel_resolucao || "",
      responsavel_verificacao: naoConformidade?.responsavel_verificacao || "",
      acao_corretiva: naoConformidade?.acao_corretiva || "",
      acao_preventiva: naoConformidade?.acao_preventiva || "",
      medidas_implementadas: naoConformidade?.medidas_implementadas || [],
      custo_estimado: naoConformidade?.custo_estimado || 0,
      custo_real: naoConformidade?.custo_real || 0,
      custo_preventivo: naoConformidade?.custo_preventivo || 0,
      observacoes: naoConformidade?.observacoes || "",
      relacionado_ensaio_id: naoConformidade?.relacionado_ensaio_id || "",
      relacionado_ensaio_outro: naoConformidade?.relacionado_ensaio_outro || "",
      relacionado_material_id: naoConformidade?.relacionado_material_id || "",
      relacionado_material_outro: naoConformidade?.relacionado_material_outro || "",
      relacionado_checklist_id: naoConformidade?.relacionado_checklist_id || "",
      relacionado_checklist_outro: naoConformidade?.relacionado_checklist_outro || "",
      relacionado_documento_id: naoConformidade?.relacionado_documento_id || "",
      relacionado_fornecedor_id: naoConformidade?.relacionado_fornecedor_id || "",
      relacionado_fornecedor_outro: naoConformidade?.relacionado_fornecedor_outro || "",
      relacionado_obra_id: naoConformidade?.relacionado_obra_id || "",
      relacionado_obra_outro: naoConformidade?.relacionado_obra_outro || "",
      relacionado_zona_id: naoConformidade?.relacionado_zona_id || "",
      relacionado_zona_outro: naoConformidade?.relacionado_zona_outro || "",
      auditoria_id: naoConformidade?.auditoria_id || "",
      auditoria_outro: naoConformidade?.auditoria_outro || "",
      anexos_evidencia: naoConformidade?.anexos_evidencia?.map((a) => typeof a === 'string' ? a : a.nome) || [],
      anexos_corretiva: naoConformidade?.anexos_corretiva?.map((a) => typeof a === 'string' ? a : a.nome) || [],
      anexos_verificacao: naoConformidade?.anexos_verificacao?.map((a) => typeof a === 'string' ? a : a.nome) || [],
      timeline: naoConformidade?.timeline || [],
    },
  });

  const tipo = watch("tipo");
  const categoria = watch("categoria");

  useEffect(() => {
    const loadObras = () => {
      // Implementar carregamento de obras
    };

    const loadMateriais = () => {
      // Implementar carregamento de materiais
    };

    const loadFornecedores = () => {
      // Implementar carregamento de fornecedores
    };

    const loadEnsaios = () => {
      // Implementar carregamento de ensaios
    };

    const loadChecklists = () => {
      // Implementar carregamento de checklists
    };

    const loadDocumentos = () => {
      // Implementar carregamento de documentos
    };

    const loadZonas = () => {
      // Implementar carregamento de zonas
    };

    loadObras();
    loadMateriais();
    loadFornecedores();
    loadEnsaios();
    loadChecklists();
    loadDocumentos();
    loadZonas();
  }, []);

  const handleFileUpload = (
    type: "evidencia" | "corretiva" | "verificacao",
    files: FileList | null,
  ) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: [...prev[type], ...fileArray],
    }));
  };

  const removeFile = (
    type: "evidencia" | "corretiva" | "verificacao",
    index: number,
  ) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const onFormSubmit = async (data: NaoConformidadeFormData) => {
    try {
      console.log("🚀 NaoConformidadeForm onFormSubmit iniciado");
      console.log("📝 Dados do formulário:", data);
      console.log("📝 Documents:", documents);
      console.log("📝 UploadedFiles:", uploadedFiles);
      
      const processedData = {
        ...data,
        anexos_evidencia: documents, // Use documents from DocumentUpload
        anexos_corretiva: [
          ...(data.anexos_corretiva || []),
          ...uploadedFiles.corretiva.map((f) => f.name),
        ],
        anexos_verificacao: [
          ...(data.anexos_verificacao || []),
          ...uploadedFiles.verificacao.map((f) => f.name),
        ],
      };

      console.log("📝 Dados processados:", processedData);
      console.log("📝 Chamando onSubmit...");

      await onSubmit(processedData);
      console.log("📝 onSubmit concluído com sucesso");
      toast.success("Não conformidade guardada com sucesso!");
    } catch (error) {
      console.error("❌ Erro no formulário:", error);
      toast.error("Erro ao guardar não conformidade");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {naoConformidade
                ? "Editar Não Conformidade"
                : "Nova Não Conformidade"}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código *
              </label>
              <input
                type="text"
                {...register("codigo")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="NC-001"
              />
              {errors.codigo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.codigo.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                {...register("tipo")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="material">Material</option>
                <option value="execucao">Execução</option>
                <option value="documentacao">Documentação</option>
                <option value="seguranca">Segurança</option>
                <option value="ambiente">Ambiente</option>
                <option value="qualidade">Qualidade</option>
                <option value="prazo">Prazo</option>
                <option value="custo">Custo</option>
                <option value="outro">Outro</option>
              </select>
              {tipo === "outro" && (
                <input
                  type="text"
                  {...register("tipo_outro")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  placeholder="Outro tipo"
                />
              )}
              {errors.tipo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tipo.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severidade *
              </label>
              <select
                {...register("severidade")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                {...register("categoria")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="auditoria">Auditoria</option>
                <option value="inspecao">Inspeção</option>
                <option value="reclamacao">Reclamação</option>
                <option value="acidente">Acidente</option>
                <option value="incidente">Incidente</option>
                <option value="desvio">Desvio</option>
                <option value="outro">Outro</option>
              </select>
              {categoria === "outro" && (
                <input
                  type="text"
                  {...register("categoria_outro")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  placeholder="Outra categoria"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Deteção *
              </label>
              <input
                type="date"
                {...register("data_deteccao")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Resolução
              </label>
              <input
                type="date"
                {...register("data_resolucao")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Limite de Resolução
              </label>
              <input
                type="date"
                {...register("data_limite_resolucao")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Verificação de Eficácia
              </label>
              <input
                type="date"
                {...register("data_verificacao_eficacia")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Descrição e Impacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <textarea
                {...register("descricao")}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva a não conformidade..."
              />
              {errors.descricao && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.descricao.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Impacto *
              </label>
              <select
                {...register("impacto")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
                <option value="critico">Crítico</option>
              </select>
            </div>
          </div>

          {/* Área Afetada e Responsáveis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Área Afetada *
              </label>
              <input
                type="text"
                {...register("area_afetada")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Área afetada"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável pela Deteção *
              </label>
              <input
                type="text"
                {...register("responsavel_deteccao")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Responsável"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável pela Resolução
              </label>
              <input
                type="text"
                {...register("responsavel_resolucao")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Responsável"
              />
            </div>
          </div>

          {/* Ações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ação Corretiva
              </label>
              <textarea
                {...register("acao_corretiva")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva a ação corretiva..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ação Preventiva
              </label>
              <textarea
                {...register("acao_preventiva")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva a ação preventiva..."
              />
            </div>
          </div>

          {/* Custos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custo Estimado (€)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("custo_estimado", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custo Real (€)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("custo_real", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custo Preventivo (€)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("custo_preventivo", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              {...register("observacoes")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Anexos - DocumentUpload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evidência da NC (Documentos)
            </label>
            <DocumentUpload
              recordId={naoConformidade?.id || 'new'}
              recordType="nao_conformidade"
              onDocumentsChange={setDocuments}
              existingDocuments={naoConformidade?.anexos_evidencia?.map((anexo: any) => ({
                id: typeof anexo === 'string' ? anexo : anexo.id || anexo.nome,
                name: typeof anexo === 'string' ? anexo : anexo.nome || anexo.name,
                url: typeof anexo === 'string' ? '' : anexo.url || '',
                type: typeof anexo === 'string' ? 'application/octet-stream' : anexo.type || 'application/octet-stream',
                size: typeof anexo === 'string' ? 0 : anexo.tamanho || anexo.size || 0,
                uploaded_at: typeof anexo === 'string' ? new Date().toISOString() : anexo.uploaded_at || new Date().toISOString()
              })) || []}
              maxFiles={10}
              maxSizeMB={10}
              allowedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png']}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "A guardar..." : "Registar Não Conformidade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
