import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Download,
  Share2,
  History as HistoryIcon,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  Camera,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  MapPin,
  User,
  Tag,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Copy,
  Printer,
  Send,
  Lock,
  Unlock
} from 'lucide-react';
import { PIEService } from '../../services/pieService';
import { PIEInstancia, PIESecao, PIEPonto, PIEResposta, PIEReportData } from '../../types/pie';
import { PDFService } from '../../services/pdfService';
import toast from 'react-hot-toast';

interface PIESectionProps {
  secao: PIESecao;
  pontos: PIEPonto[];
  respostas: PIEResposta[];
  onUpdateSecao: (id: string, updates: Partial<PIESecao>) => void;
  onDeleteSecao: (id: string) => void;
  onAddPonto: (secaoId: string) => void;
  onUpdatePonto: (id: string, updates: Partial<PIEPonto>) => void;
  onDeletePonto: (id: string) => void;
  onUpdateResposta: (pontoId: string, updates: Partial<PIEResposta>) => void;
  onUploadFile: (pontoId: string, file: File) => void;
  onTakePhoto: (pontoId: string) => void;
}

const PIESection: React.FC<PIESectionProps> = ({
  secao,
  pontos,
  respostas,
  onUpdateSecao,
  onDeleteSecao,
  onAddPonto,
  onUpdatePonto,
  onDeletePonto,
  onUpdateResposta,
  onUploadFile,
  onTakePhoto
}) => {
  const [expanded, setExpanded] = useState(true);
  const [editingSecao, setEditingSecao] = useState(false);
  const [secaoData, setSecaoData] = useState(secao);

  const handleSaveSecao = () => {
    onUpdateSecao(secao.id, secaoData);
    setEditingSecao(false);
  };

  const getProgress = () => {
    if (pontos.length === 0) return 0;
    const completed = pontos.filter(ponto => {
      const resposta = respostas.find(r => r.ponto_id === ponto.id);
      return resposta && (resposta.valor || resposta.valor_booleano !== undefined);
    }).length;
    return Math.round((completed / pontos.length) * 100);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm w-full">
      {/* Section Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {editingSecao ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={secaoData.nome}
                  onChange={(e) => setSecaoData({ ...secaoData, nome: e.target.value })}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  value={secaoData.codigo}
                  onChange={(e) => setSecaoData({ ...secaoData, codigo: e.target.value })}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                  placeholder="Código"
                />
                <button
                  onClick={handleSaveSecao}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingSecao(false)}
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">{secao.nome}</h3>
                <span className="text-sm text-gray-500">({secao.codigo})</span>
                <button
                  onClick={() => setEditingSecao(true)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{getProgress()}%</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onAddPonto(secao.id)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                title="Adicionar Ponto"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteSecao(secao.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Eliminar Seção"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {secao.descricao && (
          <p className="mt-2 text-sm text-gray-600">{secao.descricao}</p>
        )}
      </div>

      {/* Section Content */}
      {expanded && (
        <div className="p-4 space-y-4">
          {pontos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-8 w-8 mb-2" />
              <p>Nenhum ponto de inspeção nesta seção</p>
              <button
                onClick={() => onAddPonto(secao.id)}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Adicionar primeiro ponto
              </button>
            </div>
          ) : (
            pontos.map((ponto, index) => {
              const resposta = respostas.find(r => r.ponto_id === ponto.id);
              return (
                <PIEPontoItem
                  key={ponto.id}
                  ponto={ponto}
                  resposta={resposta}
                  index={index + 1}
                  onUpdate={onUpdatePonto}
                  onDelete={onDeletePonto}
                  onUpdateResposta={onUpdateResposta}
                  onUploadFile={onUploadFile}
                  onTakePhoto={onTakePhoto}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

interface PIEPontoItemProps {
  ponto: PIEPonto;
  resposta?: PIEResposta;
  index: number;
  onUpdate: (id: string, updates: Partial<PIEPonto>) => void;
  onDelete: (id: string) => void;
  onUpdateResposta: (pontoId: string, updates: Partial<PIEResposta>) => void;
  onUploadFile: (pontoId: string, file: File) => void;
  onTakePhoto: (pontoId: string) => void;
}

const PIEPontoItem: React.FC<PIEPontoItemProps> = ({
  ponto,
  resposta,
  index,
  onUpdate,
  onDelete,
  onUpdateResposta,
  onUploadFile,
  onTakePhoto
}) => {
  const [editing, setEditing] = useState(false);
  const [pontoData, setPontoData] = useState(ponto);
  const [showFileUpload, setShowFileUpload] = useState(false);

  // Validação sequencial visual (apenas aviso, sem bloqueio)
  const getPontoStatus = (): 'completed' | 'pending' | 'warning' => {
    // Esta função será passada como prop do componente pai
    // Por agora, retornamos um status básico
    if (resposta && (resposta.valor || resposta.valor_booleano !== undefined || resposta.valor_numerico)) {
      return 'completed';
    }
    return 'pending';
  };

  const getStatusColor = () => {
    const status = getPontoStatus();
    switch (status) {
      case 'completed': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusIcon = () => {
    const status = getPontoStatus();
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleSave = () => {
    onUpdate(ponto.id, pontoData);
    setEditing(false);
  };

  const handleRespostaChange = (field: string, value: any) => {
    onUpdateResposta(ponto.id, { [field]: value });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadFile(ponto.id, file);
    }
  };

  const renderInput = () => {
    switch (ponto.tipo) {
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={resposta?.valor_booleano || false}
              onChange={(e) => handleRespostaChange('valor_booleano', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Conforme</span>
          </div>
        );

      case 'text':
        return (
          <textarea
            value={resposta?.valor || ''}
            onChange={(e) => handleRespostaChange('valor', e.target.value)}
            placeholder="Digite a resposta..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={resposta?.valor_numerico || ''}
            onChange={(e) => handleRespostaChange('valor_numerico', parseFloat(e.target.value))}
            placeholder="Digite o valor..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={resposta?.valor_data || ''}
            onChange={(e) => handleRespostaChange('valor_data', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case 'select':
        return (
          <select
            value={resposta?.valor || ''}
            onChange={(e) => handleRespostaChange('valor', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione uma opção</option>
            {ponto.opcoes?.map((opcao: string, i: number) => (
              <option key={i} value={opcao}>{opcao}</option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()} transition-colors duration-200 w-full`}>
      {/* Status indicator */}
      <div className="flex items-center gap-2 mb-3">
        {getStatusIcon()}
        {getPontoStatus() === 'warning' && (
          <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
            Complete os pontos anteriores primeiro
          </span>
        )}
      </div>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
            {index}
          </div>
          
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={pontoData.titulo}
                onChange={(e) => setPontoData({ ...pontoData, titulo: e.target.value })}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <select
                value={pontoData.tipo}
                onChange={(e) => setPontoData({ ...pontoData, tipo: e.target.value as any })}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="checkbox">Checkbox</option>
                <option value="text">Texto</option>
                <option value="number">Número</option>
                <option value="date">Data</option>
                <option value="select">Seleção</option>
                <option value="file">Arquivo</option>
              </select>
              <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                <CheckCircle className="w-4 h-4" />
              </button>
              <button onClick={() => setEditing(false)} className="text-red-600 hover:text-red-700">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{ponto.titulo}</h4>
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                {ponto.tipo}
              </span>
              {ponto.obrigatorio && (
                <span className="text-xs text-red-500">*</span>
              )}
              <button
                onClick={() => setEditing(true)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDelete(ponto.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Eliminar Ponto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {ponto.descricao && (
        <p className="text-sm text-gray-600 mb-3">{ponto.descricao}</p>
      )}

      {/* Input */}
      <div className="mb-3">
        {renderInput()}
      </div>

      {/* File Upload */}
      {ponto.tipo === 'file' && (
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFileUpload(!showFileUpload)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Arquivo
            </button>
            <button
              onClick={() => onTakePhoto(ponto.id)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Camera className="w-4 h-4 mr-2" />
              Tirar Foto
            </button>
          </div>
          
          {showFileUpload && (
            <div className="mt-2">
              <input
                type="file"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          )}

          {/* Files List */}
          {resposta?.arquivos && resposta.arquivos.length > 0 && (
            <div className="mt-2 space-y-1">
              {resposta.arquivos.map((arquivo, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{arquivo.split('/').pop()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Observations */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea
          value={resposta?.observacoes || ''}
          onChange={(e) => handleRespostaChange('observacoes', e.target.value)}
          placeholder="Adicione observações..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={2}
        />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Conforme:</label>
            <select
              value={resposta?.conforme === true ? 'sim' : resposta?.conforme === false ? 'nao' : resposta?.conforme === null ? 'na' : ''}
              onChange={(e) => handleRespostaChange('conforme', e.target.value === 'sim' ? true : e.target.value === 'nao' ? false : e.target.value === 'na' ? null : null)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">Pendente</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="na">N/A</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Responsável:</label>
            <input
              type="text"
              value={resposta?.responsavel || ''}
              onChange={(e) => handleRespostaChange('responsavel', e.target.value)}
              placeholder="Nome do responsável"
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {resposta?.conforme === true && (
            <CheckCircle className="w-5 h-5 text-green-600" />
          )}
          {resposta?.conforme === false && (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
          {resposta?.conforme === null && (
            <Clock className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

const PontosInspecaoEnsaiosEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [pie, setPie] = useState<PIEInstancia | null>(null);
  const [secoes, setSecoes] = useState<PIESecao[]>([]);
  const [pontos, setPontos] = useState<PIEPonto[]>([]);
  const [respostas, setRespostas] = useState<PIEResposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Mock data for demonstration
  const mockPIE: PIEInstancia = {
    id: id || '1',
    codigo: 'PIE-20241201-0001',
    titulo: 'Inspeção de Fundações - Bloco A',
    descricao: 'Inspeção completa das fundações do bloco A da obra',
    status: 'em_andamento',
    prioridade: 'alta',
    data_planeada: '2024-12-15',
    responsavel: 'João Silva',
    zona: 'Bloco A',
    user_id: 'user1',
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z',
    ppi_modelos: { nome: 'Fundações CCG', categoria: 'CCG' },
    obras: { nome: 'Residencial Solar' }
  };

  const mockSecoes: PIESecao[] = [
    {
      id: '1',
      modelo_id: '1',
      codigo: 'CCG-01',
      nome: 'Controlo Geométrico',
      descricao: 'Verificação dos controlos geométricos antes da execução',
      ordem: 1,
      obrigatorio: true,
      ativo: true,
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z'
    },
    {
      id: '2',
      modelo_id: '1',
      codigo: 'CCG-02',
      nome: 'Controlo de Execução',
      descricao: 'Verificação da execução das fundações',
      ordem: 2,
      obrigatorio: true,
      ativo: true,
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z'
    },
    {
      id: '3',
      modelo_id: '1',
      codigo: 'CCM-01',
      nome: 'Controlo de Materiais',
      descricao: 'Verificação dos materiais utilizados',
      ordem: 3,
      obrigatorio: true,
      ativo: true,
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z'
    }
  ];

  const mockPontos: PIEPonto[] = [
    {
      id: '1',
      secao_id: '1',
      codigo: 'P001',
      titulo: 'Verificação da escavação',
      descricao: 'Verificar se a escavação está conforme projeto',
      tipo: 'checkbox',
      obrigatorio: true,
      ordem: 1,
      ativo: true,
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z'
    },
    {
      id: '2',
      secao_id: '1',
      codigo: 'P002',
      titulo: 'Medições da escavação',
      descricao: 'Registar as dimensões da escavação',
      tipo: 'text',
      obrigatorio: true,
      ordem: 2,
      ativo: true,
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z'
    },
    {
      id: '3',
      secao_id: '1',
      codigo: 'P003',
      titulo: 'Verificação do fundo da escavação',
      descricao: 'Verificar se o fundo está limpo e nivelado',
      tipo: 'checkbox',
      obrigatorio: true,
      ordem: 3,
      ativo: true,
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z'
    },
    {
      id: '4',
      secao_id: '2',
      codigo: 'P004',
      titulo: 'Fotografia da execução',
      descricao: 'Registar fotografia da execução',
      tipo: 'file',
      obrigatorio: true,
      ordem: 1,
      ativo: true,
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z'
    },
    {
      id: '5',
      secao_id: '2',
      codigo: 'P005',
      titulo: 'Verificação da armadura',
      descricao: 'Verificar se a armadura está conforme projeto',
      tipo: 'checkbox',
      obrigatorio: true,
      ordem: 2,
      ativo: true,
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z'
    },
    {
      id: '6',
      secao_id: '3',
      codigo: 'P006',
      titulo: 'Verificação do betão',
      descricao: 'Verificar a qualidade do betão',
      tipo: 'select',
      obrigatorio: true,
      ordem: 1,
      opcoes: ['C20/25', 'C25/30', 'C30/37', 'C35/45'],
      ativo: true,
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z'
    }
  ];

  const mockRespostas: PIEResposta[] = [
    {
      id: '1',
      instancia_id: '1',
      ponto_id: '1',
      valor_booleano: true,
      conforme: true,
      responsavel: 'João Silva',
      data_resposta: '2024-12-01T10:00:00Z',
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z'
    },
    {
      id: '2',
      instancia_id: '1',
      ponto_id: '2',
      valor: 'Escavação com dimensões: 15m x 10m x 2.5m. Fundo nivelado e limpo.',
      conforme: true,
      responsavel: 'João Silva',
      data_resposta: '2024-12-01T11:00:00Z',
      created_at: '2024-12-01T11:00:00Z',
      updated_at: '2024-12-01T11:00:00Z'
    },
    {
      id: '3',
      instancia_id: '1',
      ponto_id: '3',
      valor_booleano: true,
      conforme: true,
      responsavel: 'João Silva',
      data_resposta: '2024-12-01T12:00:00Z',
      created_at: '2024-12-01T12:00:00Z',
      updated_at: '2024-12-01T12:00:00Z'
    },
    {
      id: '4',
      instancia_id: '1',
      ponto_id: '4',
      arquivos: ['foto_execucao_001.jpg', 'foto_execucao_002.jpg'],
      conforme: true,
      responsavel: 'Maria Santos',
      data_resposta: '2024-12-01T13:00:00Z',
      created_at: '2024-12-01T13:00:00Z',
      updated_at: '2024-12-01T13:00:00Z'
    },
    {
      id: '5',
      instancia_id: '1',
      ponto_id: '5',
      valor_booleano: false,
      conforme: false,
      observacoes: 'Armadura não está conforme projeto. Faltam 2 varões de 16mm.',
      responsavel: 'Maria Santos',
      data_resposta: '2024-12-01T14:00:00Z',
      created_at: '2024-12-01T14:00:00Z',
      updated_at: '2024-12-01T14:00:00Z'
    },
    {
      id: '6',
      instancia_id: '1',
      ponto_id: '6',
      valor: 'C25/30',
      conforme: true,
      responsavel: 'Pedro Costa',
      data_resposta: '2024-12-01T15:00:00Z',
      created_at: '2024-12-01T15:00:00Z',
      updated_at: '2024-12-01T15:00:00Z'
    }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setPie(mockPIE);
      setSecoes(mockSecoes);
      setPontos(mockPontos);
      setRespostas(mockRespostas);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (pie) {
        // Atualizar PIE no Supabase
        await PIEService.updateInstancia(pie.id, {
          ...pie,
          updated_at: new Date().toISOString()
        });
        
        // Salvar seções
        for (const secao of secoes) {
          if (secao.id.startsWith('secao-')) {
            // Nova seção
            await PIEService.createSecao({
              modelo_id: secao.modelo_id,
              codigo: secao.codigo,
              nome: secao.nome,
              descricao: secao.descricao,
              ordem: secao.ordem,
              obrigatorio: secao.obrigatorio,
              ativo: secao.ativo,
              metadata: secao.metadata
            });
          } else {
            // Seção existente
            await PIEService.updateSecao(secao.id, {
              nome: secao.nome,
              codigo: secao.codigo,
              descricao: secao.descricao,
              ordem: secao.ordem,
              obrigatorio: secao.obrigatorio,
              ativo: secao.ativo,
              metadata: secao.metadata
            });
          }
        }

        // Salvar pontos
        for (const ponto of pontos) {
          if (ponto.id.startsWith('ponto-')) {
            // Novo ponto
            await PIEService.createPonto({
              secao_id: ponto.secao_id,
              codigo: ponto.codigo,
              titulo: ponto.titulo,
              descricao: ponto.descricao,
              tipo: ponto.tipo,
              obrigatorio: ponto.obrigatorio,
              ordem: ponto.ordem,
              opcoes: ponto.opcoes,
              validacao: ponto.validacao,
              dependencias: ponto.dependencias,
              ativo: ponto.ativo,
              metadata: ponto.metadata
            });
          } else {
            // Ponto existente
            await PIEService.updatePonto(ponto.id, {
              titulo: ponto.titulo,
              codigo: ponto.codigo,
              descricao: ponto.descricao,
              tipo: ponto.tipo,
              obrigatorio: ponto.obrigatorio,
              ordem: ponto.ordem,
              opcoes: ponto.opcoes,
              validacao: ponto.validacao,
              dependencias: ponto.dependencias,
              ativo: ponto.ativo,
              metadata: ponto.metadata
            });
          }
        }

        // Salvar respostas
        for (const resposta of respostas) {
          if (resposta.id.startsWith('resposta-')) {
            // Nova resposta
            await PIEService.createResposta({
              instancia_id: resposta.instancia_id,
              ponto_id: resposta.ponto_id,
              valor: resposta.valor,
              valor_numerico: resposta.valor_numerico,
              valor_booleano: resposta.valor_booleano,
              valor_data: resposta.valor_data,
              valor_json: resposta.valor_json,
              arquivos: resposta.arquivos,
              observacoes: resposta.observacoes,
              conforme: resposta.conforme,
              responsavel: resposta.responsavel,
              data_resposta: resposta.data_resposta,
              metadata: resposta.metadata
            });
          } else {
            // Resposta existente
            await PIEService.updateResposta(resposta.id, {
              valor: resposta.valor,
              valor_numerico: resposta.valor_numerico,
              valor_booleano: resposta.valor_booleano,
              valor_data: resposta.valor_data,
              valor_json: resposta.valor_json,
              arquivos: resposta.arquivos,
              observacoes: resposta.observacoes,
              conforme: resposta.conforme,
              responsavel: resposta.responsavel,
              data_resposta: resposta.data_resposta,
              metadata: resposta.metadata
            });
          }
        }

        toast.success('PIE guardado com sucesso!');
      } else {
        // Criar novo PIE
        const novoPIE = await PIEService.createInstancia({
          codigo: await PIEService.gerarCodigoPIE('PIE'),
          titulo: 'Novo PIE',
          descricao: '',
          status: 'rascunho',
          prioridade: 'normal',
          user_id: 'user1' // TODO: Pegar do contexto de autenticação
        });
        
        setPie(novoPIE);
        toast.success('Novo PIE criado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar PIE:', error);
      toast.error('Erro ao salvar PIE. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    if (!pie) {
      toast.error('Nenhum PIE disponível para exportar');
      return;
    }

    try {
      console.log('Iniciando exportação do PIE:', pie);
      
      // Preparar dados para o relatório
      const secoesComPontos = secoes.map(secao => ({
        ...secao,
        pontos: pontos
          .filter(p => p.secao_id === secao.id)
          .map(ponto => ({
            ...ponto,
            resposta: respostas.find(r => r.ponto_id === ponto.id)
          }))
          .sort((a, b) => a.ordem - b.ordem)
      }));

      console.log('Seções com pontos:', secoesComPontos);
      
      const estatisticas = PDFService.calculateStatistics(secoesComPontos);
      console.log('Estatísticas calculadas:', estatisticas);

      const reportData = {
        pie,
        secoes: secoesComPontos,
        estatisticas
      };

      console.log('Dados do relatório:', reportData);

      // Gerar PDF
      console.log('Gerando PDF...');
      const pdfUrl = await PDFService.generatePIEReport(reportData);
      console.log('PDF gerado com URL:', pdfUrl);
      
      // Download do arquivo
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `PIE-${pie.codigo}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar URL
      URL.revokeObjectURL(pdfUrl);
      
      toast.success('Relatório PIE exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PIE:', error);
      toast.error('Erro ao exportar relatório. Tente novamente.');
    }
  };

  const handleShare = () => {
    setShowShare(true);
  };

  const handleShareSubmit = (emails: string[], message: string) => {
    // Simular partilha
    console.log('Partilhando PIE com:', emails);
    console.log('Mensagem:', message);
    
    toast.success(`PIE partilhado com ${emails.length} pessoa(s)!`);
    setShowShare(false);
  };

  const handleAddSecao = () => {
    const novaSecao: PIESecao = {
      id: `secao-${Date.now()}`,
      modelo_id: '1',
      codigo: `SEC-${secoes.length + 1}`,
      nome: 'Nova Seção',
      descricao: '',
      ordem: secoes.length + 1,
      obrigatorio: true,
      ativo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setSecoes([...secoes, novaSecao]);
  };

  const handleUpdateSecao = (id: string, updates: Partial<PIESecao>) => {
    setSecoes(secoes.map(secao => 
      secao.id === id ? { ...secao, ...updates } : secao
    ));
  };

  const handleDeleteSecao = (id: string) => {
    setSecoes(secoes.filter(secao => secao.id !== id));
    setPontos(pontos.filter(ponto => ponto.secao_id !== id));
  };

  const handleAddPonto = (secaoId: string) => {
    const secao = secoes.find(s => s.id === secaoId);
    const pontosSecao = pontos.filter(p => p.secao_id === secaoId);
    
    const novoPonto: PIEPonto = {
      id: `ponto-${Date.now()}`,
      secao_id: secaoId,
      codigo: `${secao?.codigo}-${pontosSecao.length + 1}`,
      titulo: 'Novo Ponto',
      descricao: '',
      tipo: 'checkbox',
      obrigatorio: true,
      ordem: pontosSecao.length + 1,
      ativo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setPontos([...pontos, novoPonto]);
  };

  const handleUpdatePonto = (id: string, updates: Partial<PIEPonto>) => {
    setPontos(pontos.map(ponto => 
      ponto.id === id ? { ...ponto, ...updates } : ponto
    ));
  };

  const handleDeletePonto = (id: string) => {
    setPontos(pontos.filter(ponto => ponto.id !== id));
    setRespostas(respostas.filter(resposta => resposta.ponto_id !== id));
  };

  const handleUpdateResposta = (pontoId: string, updates: Partial<PIEResposta>) => {
    const existingResposta = respostas.find(r => r.ponto_id === pontoId);
    
    if (existingResposta) {
      setRespostas(respostas.map(resposta => 
        resposta.ponto_id === pontoId 
          ? { ...resposta, ...updates, updated_at: new Date().toISOString() }
          : resposta
      ));
    } else {
      const novaResposta: PIEResposta = {
        id: `resposta-${Date.now()}`,
        instancia_id: pie?.id || '',
        ponto_id: pontoId,
        data_resposta: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updates
      };
      setRespostas([...respostas, novaResposta]);
    }
  };

  const handleUploadFile = (pontoId: string, file: File) => {
    console.log('Uploading file for point:', pontoId, file);
    // Implementar upload
  };

  const handleTakePhoto = (pontoId: string) => {
    console.log('Taking photo for point:', pontoId);
    // Implementar captura de foto
  };

  // Colaboradores (array local, adicionar/remover)
  const [colaboradores, setColaboradores] = useState<{ nome: string; email: string }[]>([
    { nome: 'João Silva', email: 'joao@exemplo.com' }
  ]);
  const handleAddColaborador = (colab: { nome: string; email: string }) => {
    setColaboradores([...colaboradores, colab]);
  };
  const handleRemoveColaborador = (email: string) => {
    setColaboradores(colaboradores.filter(c => c.email !== email));
  };

  // Validação sequencial visual (apenas aviso, sem bloqueio)
  const getPontoStatus = (ponto: PIEPonto, index: number) => {
    const pontosAnteriores = pontos.filter(p => p.secao_id === ponto.secao_id && p.ordem < ponto.ordem);
    const pontosAnterioresNaoPreenchidos = pontosAnteriores.filter(p => {
      const resposta = respostas.find(r => r.ponto_id === p.id);
      return !resposta || (!resposta.valor && resposta.valor_booleano === undefined && !resposta.valor_numerico);
    });
    
    if (pontosAnterioresNaoPreenchidos.length > 0) {
      return 'warning'; // Aviso visual
    }
    
    const resposta = respostas.find(r => r.ponto_id === ponto.id);
    if (resposta && (resposta.valor || resposta.valor_booleano !== undefined || resposta.valor_numerico)) {
      return 'completed';
    }
    
    return 'pending';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (!pie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">PIE não encontrado</h3>
          <p className="mt-1 text-gray-600">O PIE que procura não existe ou foi removido.</p>
          <button
            onClick={() => navigate('/pie')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/pie')}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{pie.titulo}</h1>
                  <p className="text-sm text-gray-500">{pie.codigo}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <History className="w-4 h-4 mr-2" />
                  Histórico
                </button>
                
                <button
                  onClick={() => setShowCollaborators(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Colaboradores
                </button>
                
                <button
                  onClick={() => setShowSettings(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </button>
                
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Partilhar
                </button>
                
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* PIE Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Tag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-sm text-gray-900 capitalize">{pie.status.replace('_', ' ')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <User className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Responsável</p>
                <p className="text-sm text-gray-900">{pie.responsavel || 'Não definido'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Data Planeada</p>
                <p className="text-sm text-gray-900">
                  {pie.data_planeada ? new Date(pie.data_planeada).toLocaleDateString('pt-BR') : 'Não definida'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Zona</p>
                <p className="text-sm text-gray-900">{pie.zona || 'Não definida'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Seções de Inspeção</h2>
            <button
              onClick={handleAddSecao}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Seção
            </button>
          </div>

          {secoes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma seção criada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando a primeira seção de inspeção.
              </p>
              <button
                onClick={handleAddSecao}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Seção
              </button>
            </div>
          ) : (
            secoes.map(secao => (
              <PIESection
                key={secao.id}
                secao={secao}
                pontos={pontos.filter(p => p.secao_id === secao.id)}
                respostas={respostas.filter(r => 
                  pontos.some(p => p.id === r.ponto_id && p.secao_id === secao.id)
                )}
                onUpdateSecao={handleUpdateSecao}
                onDeleteSecao={handleDeleteSecao}
                onAddPonto={handleAddPonto}
                onUpdatePonto={handleUpdatePonto}
                onDeletePonto={handleDeletePonto}
                onUpdateResposta={handleUpdateResposta}
                onUploadFile={handleUploadFile}
                onTakePhoto={handleTakePhoto}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Histórico de Alterações</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">PIE criado</p>
                  <p className="text-xs text-gray-500">João Silva • há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Primeira resposta adicionada</p>
                  <p className="text-xs text-gray-500">João Silva • há 1 hora</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Colaboradores (array local, adicionar/remover) */}
      {showCollaborators && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Colaboradores</h3>
              <button
                onClick={() => setShowCollaborators(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3 mb-4">
              {colaboradores.map((colab, idx) => (
                <div key={colab.email} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {colab.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{colab.nome}</p>
                    <p className="text-xs text-gray-500">{colab.email}</p>
                  </div>
                  <button className="text-red-600 hover:text-red-700" onClick={() => handleRemoveColaborador(colab.email)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <AddColaboradorForm onAdd={handleAddColaborador} />
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Configurações</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validação Sequencial
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Forçar preenchimento sequencial
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notificações
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Enviar notificações por email
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Partilha */}
      {showShare && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Partilhar PIE</h3>
              <button
                onClick={() => setShowShare(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <ShareForm 
              onShare={handleShareSubmit}
              colaboradores={colaboradores}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface AddColaboradorFormProps {
  onAdd: (colab: { nome: string; email: string }) => void;
}

const AddColaboradorForm: React.FC<AddColaboradorFormProps> = ({ onAdd }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={e => {
        e.preventDefault();
        if (nome && email) {
          onAdd({ nome, email });
          setNome('');
          setEmail('');
        }
      }}
    >
      <input
        type="text"
        placeholder="Nome do colaborador"
        value={nome}
        onChange={e => setNome(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 text-sm"
        required
      />
      <input
        type="email"
        placeholder="Email do colaborador"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 text-sm"
        required
      />
      <button type="submit" className="mt-2 bg-blue-600 text-white rounded px-3 py-1 text-sm font-medium hover:bg-blue-700">Adicionar</button>
    </form>
  );
};

// Componente ShareForm
interface ShareFormProps {
  onShare: (emails: string[], message: string) => void;
  colaboradores: { nome: string; email: string }[];
}

const ShareForm: React.FC<ShareFormProps> = ({ onShare, colaboradores }) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const addEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail('');
    }
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const addColaborador = (colab: { nome: string; email: string }) => {
    if (!emails.includes(colab.email)) {
      setEmails([...emails, colab.email]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Colaboradores Disponíveis
        </label>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {colaboradores.map(colab => (
            <button
              key={colab.email}
              onClick={() => addColaborador(colab)}
              className="w-full text-left p-2 hover:bg-gray-50 rounded border border-gray-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  {colab.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{colab.nome}</p>
                  <p className="text-xs text-gray-500">{colab.email}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Emails Adicionais
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="email"
            placeholder="Adicionar email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
          />
          <button
            onClick={addEmail}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
          >
            Adicionar
          </button>
        </div>
        <div className="space-y-1">
          {emails.map(email => (
            <div key={email} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">{email}</span>
              <button
                onClick={() => removeEmail(email)}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mensagem (opcional)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Adicione uma mensagem personalizada..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={() => onShare(emails, message)}
          disabled={emails.length === 0}
          className="flex-1 bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4 mr-2" />
          Partilhar
        </button>
      </div>
    </div>
  );
};

export default PontosInspecaoEnsaiosEditor; 