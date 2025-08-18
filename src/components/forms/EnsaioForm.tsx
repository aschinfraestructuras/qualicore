import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { X, FileText } from "lucide-react";
import { SeguimentoEnsaio, ContextoAdicional } from "@/types";
import type { Ensaio } from "../../types";
import DocumentUpload from "../DocumentUpload";

interface EnsaioFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: Partial<Ensaio>;
  isEditing?: boolean;
}

const statusOptions = [
  {
    value: "pendente",
    label: "Pendente",
    color: "bg-warning-100 text-warning-700",
  },
  {
    value: "em_analise",
    label: "Em Análise",
    color: "bg-info-100 text-info-700",
  },
  {
    value: "aprovado",
    label: "Aprovado",
    color: "bg-success-100 text-success-700",
  },
  {
    value: "reprovado",
    label: "Reprovado",
    color: "bg-danger-100 text-danger-700",
  },
  {
    value: "concluido",
    label: "Concluído",
    color: "bg-gray-100 text-gray-700",
  },
];

const unidades = [
  "MPa",
  "N/mm²",
  "kg/m³",
  "g/cm³",
  "mm",
  "cm",
  "m",
  "kg",
  "ton",
  "%",
  "ºC",
  "h",
  "dias",
];

export default function EnsaioForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: EnsaioFormProps) {
  const [formData, setFormData] = useState({
    codigo: initialData?.codigo || "",
    tipo: initialData?.tipo || "",
    material_id: initialData?.material_id || "",
    resultado: initialData?.resultado || "",
    valor_obtido: initialData?.valor_obtido || 0,
    valor_esperado: initialData?.valor_esperado || 0,
    unidade: initialData?.unidade || "",
    laboratorio: initialData?.laboratorio || "",
    data_ensaio: initialData?.data_ensaio || "",
    conforme: initialData?.conforme || false,
    responsavel: initialData?.responsavel || "",
    zona: initialData?.zona || "",
    estado: initialData?.estado || "pendente",
    observacoes: initialData?.observacoes || "",
  });

  // Seguimento dinâmico
  const [seguimento, setSeguimento] = useState<SeguimentoEnsaio[]>(
    (initialData as any)?.seguimento || [],
  );
  const [anexos, setAnexos] = useState<File[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dropdowns dinâmicos
  const [tiposEnsaio, setTiposEnsaio] = useState([
    "Ensaio de Resistência à Compressão",
    "Ensaio de Resistência à Tração",
    "Ensaio de Flexão",
    "Ensaio de Densidade",
    "Ensaio de Absorção",
    "Ensaio de Permeabilidade",
    "Ensaio de Durabilidade",
    "Ensaio de Consistência",
    "Ensaio de Slump",
    "Ensaio de Temperatura",
    "Ensaio de Umidade",
    "Ensaio de Granulometria",
    "Ensaio de Adensamento",
    "Ensaio de Cisalhamento",
    "Ensaio de Penetração",
    "Outro",
  ]);

  const [laboratorios, setLaboratorios] = useState([
    "Laboratório Central",
    "Laboratório de Obra",
    "Laboratório Externo - CEM",
    "Laboratório Externo - LNEC",
    "Laboratório Externo - IST",
    "Laboratório Externo - FEUP",
    "Laboratório Externo - FCT",
    "Laboratório Externo - UA",
    "Laboratório Externo - UC",
    "Laboratório Externo - UMinho",
    "Laboratório Externo - UPorto",
    "Laboratório Externo - ULisboa",
    "Laboratório Externo - UAlgarve",
    "Laboratório Externo - UÉvora",
    "Laboratório Externo - UCoimbra",
    "Laboratório Externo - UBraga",
    "Laboratório Externo - UAveiro",
    "Laboratório Externo - UBI",
    "Laboratório Externo - UMaia",
    "Outro",
  ]);

  const [zonas, setZonas] = useState([
    "Zona A - Fundações",
    "Zona B - Pilares",
    "Zona C - Lajes",
    "Zona D - Estrutura",
    "Armazém Central",
    "Laboratório",
    "Escritório",
    "Outro",
  ]);

  const [showNovoTipo, setShowNovoTipo] = useState(false);
  const [showNovoLab, setShowNovoLab] = useState(false);
  const [showNovaZona, setShowNovaZona] = useState(false);
  const [novoTipo, setNovoTipo] = useState("");
  const [novoLab, setNovoLab] = useState("");
  const [novaZona, setNovaZona] = useState("");

  // Campos de contexto ricos
  const [contextoAdicional, setContextoAdicional] = useState<
    ContextoAdicional[]
  >((initialData as any)?.contextoAdicional || []);

  // Carregar opções salvas do localStorage
  useEffect(() => {
    const savedTipos = localStorage.getItem("tiposEnsaio");
    const savedLabs = localStorage.getItem("laboratorios");
    const savedZonas = localStorage.getItem("zonas");

    if (savedTipos) {
      setTiposEnsaio((prev) => {
        const saved = JSON.parse(savedTipos);
        return [...new Set([...prev, ...saved])];
      });
    }

    if (savedLabs) {
      setLaboratorios((prev) => {
        const saved = JSON.parse(savedLabs);
        return [...new Set([...prev, ...saved])];
      });
    }

    if (savedZonas) {
      setZonas((prev) => {
        const saved = JSON.parse(savedZonas);
        return [...new Set([...prev, ...saved])];
      });
    }
  }, []);

  const adicionarNovoTipo = () => {
    if (novoTipo.trim()) {
      const novosTipos = [
        ...tiposEnsaio.filter((t) => t !== "Outro"),
        novoTipo.trim(),
        "Outro",
      ];
      setTiposEnsaio(novosTipos);
      setFormData((prev) => ({ ...prev, tipo: novoTipo.trim() }));
      setNovoTipo("");
      setShowNovoTipo(false);

      // Salvar no localStorage
      const saved = JSON.parse(localStorage.getItem("tiposEnsaio") || "[]");
      localStorage.setItem(
        "tiposEnsaio",
        JSON.stringify([...saved, novoTipo.trim()]),
      );
    }
  };

  const adicionarNovoLab = () => {
    if (novoLab.trim()) {
      const novosLabs = [
        ...laboratorios.filter((l) => l !== "Outro"),
        novoLab.trim(),
        "Outro",
      ];
      setLaboratorios(novosLabs);
      setFormData((prev) => ({ ...prev, laboratorio: novoLab.trim() }));
      setNovoLab("");
      setShowNovoLab(false);

      // Salvar no localStorage
      const saved = JSON.parse(localStorage.getItem("laboratorios") || "[]");
      localStorage.setItem(
        "laboratorios",
        JSON.stringify([...saved, novoLab.trim()]),
      );
    }
  };

  const adicionarNovaZona = () => {
    if (novaZona.trim()) {
      const novasZonas = [
        ...zonas.filter((z) => z !== "Outro"),
        novaZona.trim(),
        "Outro",
      ];
      setZonas(novasZonas);
      setFormData((prev) => ({ ...prev, zona: novaZona.trim() }));
      setNovaZona("");
      setShowNovaZona(false);

      // Salvar no localStorage
      const saved = JSON.parse(localStorage.getItem("zonas") || "[]");
      localStorage.setItem(
        "zonas",
        JSON.stringify([...saved, novaZona.trim()]),
      );
    }
  };

  const adicionarCampoContexto = () => {
    setContextoAdicional((prev) => [...prev, { campo: "", valor: "" }]);
  };

  const removerCampoContexto = (index: number) => {
    setContextoAdicional((prev) => prev.filter((_, i) => i !== index));
  };

  const atualizarCampoContexto = (
    index: number,
    campo: string,
    valor: string,
  ) => {
    setContextoAdicional((prev) =>
      prev.map((item, i) => (i === index ? { campo, valor } : item)),
    );
  };

  const addLinhaSeguimento = () => {
    setSeguimento((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        data: "",
        descricao: "",
        responsavel: "",
        resultado: "",
        anexo: null,
      },
    ]);
  };

  const removeLinhaSeguimento = (index: number) => {
    setSeguimento((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLinhaSeguimento = (
    index: number,
    field: keyof SeguimentoEnsaio,
    value: string | File | null,
  ) => {
    setSeguimento((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAnexos((prev) => [...prev, ...files]);
  };

  const removeAnexo = (index: number) => {
    setAnexos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let codigo = formData.codigo;
    if (!codigo) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      codigo = `ENS-${year}-${month}${day}-${random}`;
    }
    const dadosCompletos = {
      ...formData,
      codigo,
      seguimento,
      anexos: anexos as any,
      contextoAdicional: contextoAdicional.filter(
        (c) => c.campo.trim() && c.valor.trim(),
      ),
      documents: documents, // Incluir os documentos carregados
    };
    onSubmit(dadosCompletos);
  };

  const generateCode = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const code = `ENS-${year}-${month}${day}-${random}`;
    setFormData((prev) => ({ ...prev, codigo: code }));
  };

  const calculateConformity = () => {
    if (formData.valor_obtido && formData.valor_esperado) {
      const tolerance = 0.05; // 5% de tolerância
      const minValue = formData.valor_esperado * (1 - tolerance);
      const maxValue = formData.valor_esperado * (1 + tolerance);
      const isConforme =
        formData.valor_obtido >= minValue && formData.valor_obtido <= maxValue;
      setFormData((prev) => ({ ...prev, conforme: isConforme }));
      setFormData((prev) => ({
        ...prev,
        resultado: isConforme ? "Conforme" : "Não Conforme",
      }));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.codigo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, codigo: e.target.value }))
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Código do ensaio"
              required
            />
            <button
              type="button"
              onClick={generateCode}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Gerar
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material ID *
          </label>
          <input
            type="text"
            value={formData.material_id}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, material_id: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ID do material"
            required
          />
        </div>
      </div>

      {/* Tipo de Ensaio e Laboratório */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Ensaio *
          </label>
          <select
            value={formData.tipo}
            onChange={(e) => {
              if (e.target.value === "Outro") {
                setShowNovoTipo(true);
              } else {
                setFormData((prev) => ({ ...prev, tipo: e.target.value }));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione o tipo</option>
            {tiposEnsaio.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>

          {showNovoTipo && (
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              <input
                type="text"
                value={novoTipo}
                onChange={(e) => setNovoTipo(e.target.value)}
                placeholder="Digite o novo tipo de ensaio"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={adicionarNovoTipo}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNovoTipo(false);
                    setNovoTipo("");
                    setFormData((prev) => ({ ...prev, tipo: "" }));
                  }}
                  className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Laboratório *
          </label>
          <select
            value={formData.laboratorio}
            onChange={(e) => {
              if (e.target.value === "Outro") {
                setShowNovoLab(true);
              } else {
                setFormData((prev) => ({
                  ...prev,
                  laboratorio: e.target.value,
                }));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione o laboratório</option>
            {laboratorios.map((lab) => (
              <option key={lab} value={lab}>
                {lab}
              </option>
            ))}
          </select>

          {showNovoLab && (
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              <input
                type="text"
                value={novoLab}
                onChange={(e) => setNovoLab(e.target.value)}
                placeholder="Digite o novo laboratório"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={adicionarNovoLab}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNovoLab(false);
                    setNovoLab("");
                    setFormData((prev) => ({ ...prev, laboratorio: "" }));
                  }}
                  className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Campos de contexto adicionais */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Informações Adicionais do Contexto
          </label>
          <button
            type="button"
            onClick={adicionarCampoContexto}
            className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
          >
            + Adicionar Campo
          </button>
        </div>

        {contextoAdicional.map((campo, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md"
          >
            <input
              type="text"
              value={campo.campo}
              onChange={(e) =>
                atualizarCampoContexto(index, e.target.value, campo.valor)
              }
              placeholder="Ex: Localização, Matrícula Camião, Tipo Betão, Planta, etc."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={campo.valor}
              onChange={(e) =>
                atualizarCampoContexto(index, campo.campo, e.target.value)
              }
              placeholder="Valor"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removerCampoContexto(index)}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      {/* Valores e Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor Obtido *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.valor_obtido}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                valor_obtido: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor Esperado *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.valor_esperado}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                valor_esperado: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unidade *
          </label>
          <select
            value={formData.unidade}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, unidade: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione</option>
            {unidades.map((unidade) => (
              <option key={unidade} value={unidade}>
                {unidade}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conformidade */}
      <div className="flex items-center gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.conforme}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, conforme: e.target.checked }))
            }
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Conforme</span>
        </label>
        <button
          type="button"
          onClick={calculateConformity}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          Calcular Conformidade
        </button>
      </div>

      {/* Resultado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resultado *
        </label>
        <input
          type="text"
          value={formData.resultado}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, resultado: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Resultado do ensaio"
          required
        />
      </div>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data do Ensaio *
          </label>
          <input
            type="date"
            value={formData.data_ensaio}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, data_ensaio: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsável *
          </label>
          <input
            type="text"
            value={formData.responsavel}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, responsavel: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do responsável"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zona *
          </label>
          <select
            value={formData.zona}
            onChange={(e) => {
              if (e.target.value === "Outro") {
                setShowNovaZona(true);
              } else {
                setFormData((prev) => ({ ...prev, zona: e.target.value }));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione a zona</option>
            {zonas.map((zona) => (
              <option key={zona} value={zona}>
                {zona}
              </option>
            ))}
          </select>

          {showNovaZona && (
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              <input
                type="text"
                value={novaZona}
                onChange={(e) => setNovaZona(e.target.value)}
                placeholder="Digite a nova zona"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={adicionarNovaZona}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNovaZona(false);
                    setNovaZona("");
                    setFormData((prev) => ({ ...prev, zona: "" }));
                  }}
                  className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado *
        </label>
        <select
          value={formData.estado}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, estado: e.target.value as any }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Descrição/Resultados */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição/Resultados/Contexto
        </label>
        <textarea
          value={formData.observacoes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, observacoes: e.target.value }))
          }
          rows={4}
          placeholder="Descreva os resultados, observações, condições do dia, localização específica, matrícula do camião, tipo de betão, planta, etc."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Seguimento do Ensaio */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Seguimento do Ensaio (Linha do Tempo)
          </label>
          <button
            type="button"
            onClick={addLinhaSeguimento}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            + Adicionar Linha
          </button>
        </div>

        <div className="space-y-2">
          {seguimento.map((linha, idx) => (
            <div
              key={linha.id}
              className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end border-b pb-2"
            >
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={linha.data}
                onChange={(e) =>
                  updateLinhaSeguimento(idx, "data", e.target.value)
                }
              />
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descrição"
                value={linha.descricao}
                onChange={(e) =>
                  updateLinhaSeguimento(idx, "descricao", e.target.value)
                }
              />
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Responsável"
                value={linha.responsavel}
                onChange={(e) =>
                  updateLinhaSeguimento(idx, "responsavel", e.target.value)
                }
              />
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Resultado"
                value={linha.resultado}
                onChange={(e) =>
                  updateLinhaSeguimento(idx, "resultado", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeLinhaSeguimento(idx)}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Anexos - TEMPORARIAMENTE DESABILITADO */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Documentos (Relatórios, PDFs, Imagens, etc.)
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

      {/* Resumo */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Resumo do Ensaio
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Tipo:</span>
            <span className="font-medium">
              {formData.tipo || "Não definido"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Estado:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${statusOptions.find((s) => s.value === formData.estado)?.color}`}
            >
              {statusOptions.find((s) => s.value === formData.estado)?.label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Conformidade:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${formData.conforme ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {formData.conforme ? "Conforme" : "Não Conforme"}
            </span>
          </div>
        </div>
        {formData.valor_obtido && formData.valor_esperado && (
          <div className="mt-2 text-sm text-gray-600">
            Resultado: {formData.valor_obtido} {formData.unidade} /{" "}
            {formData.valor_esperado} {formData.unidade}
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isEditing ? "Atualizar Ensaio" : "Registar Ensaio"}
        </button>
      </div>
    </motion.form>
  );
}
