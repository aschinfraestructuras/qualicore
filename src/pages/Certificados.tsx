import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Plus,
  Award,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Upload,
  Settings,
  BarChart3,
  Users,
  Building,
  Shield,
  Zap,
  BookOpen,
  FileCheck,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  Info,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { certificadosAPI } from '../lib/supabase-api/certificadosAPI';
import { storageService } from '../lib/supabase-storage';
import CertificadosForms from '../components/CertificadosForms';
import RegistosForms from '../components/RegistosForms';
import TermosForms from '../components/TermosForms';
import RelatoriosForms from '../components/RelatoriosForms';
import RelatorioCertificadosPremium from '../components/RelatorioCertificadosPremium';
import type { 
  Certificado, 
  Registo,
  TermoCondicoes,
  Relatorio,
  FiltrosCertificados,
  EstatisticasCertificados
} from '../types/certificados';
import {
  TIPOS_CERTIFICADO,
  CATEGORIAS_CERTIFICADO,
  STATUS_CERTIFICADO,
  CLASSIFICACOES_CONFIDENCIALIDADE
} from '../types/certificados';

interface CertificadosProps {}

export default function Certificados() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [registos, setRegistos] = useState<Registo[]>([]);
  const [termos, setTermos] = useState<TermoCondicoes[]>([]);
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState<EstatisticasCertificados | null>(null);
  const [filtros, setFiltros] = useState<FiltrosCertificados>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'codigo' | 'titulo' | 'data_emissao' | 'data_validade' | 'status'>('codigo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCertificado, setSelectedCertificado] = useState<Certificado | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'certificados' | 'registos' | 'termos' | 'relatorios'>('certificados');
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [showCertificadosForm, setShowCertificadosForm] = useState(false);
  const [showRegistosForm, setShowRegistosForm] = useState(false);
  const [showTermosForm, setShowTermosForm] = useState(false);
  const [showRelatoriosForm, setShowRelatoriosForm] = useState(false);
  const [editingCertificado, setEditingCertificado] = useState<Certificado | null>(null);
  const [editingRegisto, setEditingRegisto] = useState<Registo | null>(null);
  const [editingTermo, setEditingTermo] = useState<TermoCondicoes | null>(null);
  const [editingRelatorio, setEditingRelatorio] = useState<Relatorio | null>(null);
  const [showRelatorio, setShowRelatorio] = useState(false);
  const [tipoRelatorio, setTipoRelatorio] = useState('filtrado');
  const [certificadosSelecionados, setCertificadosSelecionados] = useState<Certificado[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm || Object.keys(filtros).length > 0) {
      searchCertificados();
    } else {
      loadCertificados();
    }
  }, [searchTerm, filtros]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadCertificados(),
        loadRegistos(),
        loadTermos(),
        loadRelatorios(),
        loadEstatisticas()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const loadCertificados = async () => {
    try {
      const data = await certificadosAPI.certificados.getAll();
      setCertificados(data);
    } catch (error) {
      console.error('Erro ao carregar certificados:', error);
      toast.error('Erro ao carregar certificados');
    }
  };

  const loadRegistos = async () => {
    try {
      const data = await certificadosAPI.registos.getAll();
      setRegistos(data);
    } catch (error) {
      console.error('Erro ao carregar registos:', error);
      toast.error('Erro ao carregar registos');
    }
  };

  const loadTermos = async () => {
    try {
      const data = await certificadosAPI.termos.getAll();
      setTermos(data);
    } catch (error) {
      console.error('Erro ao carregar termos:', error);
      toast.error('Erro ao carregar termos');
    }
  };

  const loadRelatorios = async () => {
    try {
      const data = await certificadosAPI.relatorios.getAll();
      setRelatorios(data);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      toast.error('Erro ao carregar relatórios');
    }
  };

  const loadEstatisticas = async () => {
    try {
      const stats = await certificadosAPI.stats.getCertificadosStats();
      setEstatisticas(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const searchCertificados = async () => {
    try {
      setLoading(true);
      const searchFiltros: FiltrosCertificados = { ...filtros };
      if (searchTerm) {
        searchFiltros.texto_livre = searchTerm;
      }
      const data = await certificadosAPI.certificados.search(searchFiltros);
      setCertificados(data);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      toast.error('Erro na pesquisa');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedCertificados = [...certificados].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];

    if (sortBy === 'data_emissao' || sortBy === 'data_validade') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      if (format === 'csv') {
        const csvContent = await certificadosAPI.export.certificadosToCSV(certificados);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificados_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Exportação CSV concluída');
      } else {
        toast.error('Exportação PDF em desenvolvimento');
      }
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast.error('Erro na exportação');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'text-green-600 bg-green-100';
      case 'suspenso': return 'text-yellow-600 bg-yellow-100';
      case 'cancelado': return 'text-red-600 bg-red-100';
      case 'expirado': return 'text-red-600 bg-red-100';
      case 'em_renovacao': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo': return <CheckCircle className="h-4 w-4" />;
      case 'suspenso': return <Clock className="h-4 w-4" />;
      case 'cancelado': return <X className="h-4 w-4" />;
      case 'expirado': return <AlertTriangle className="h-4 w-4" />;
      case 'em_renovacao': return <RefreshCw className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const isProximoExpiracao = (dataValidade: string) => {
    const hoje = new Date();
    const dataVal = new Date(dataValidade);
    const diffTime = dataVal.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpirado = (dataValidade: string) => {
    return new Date(dataValidade) < new Date();
  };

  const handleDownloadDocumento = async (documento: any) => {
    try {
      if (documento.path) {
        await storageService.downloadFile(
          documento.path,
          documento.nome,
          (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents'
        );
        toast.success(`Download iniciado: ${documento.nome}`);
      } else {
        const link = document.createElement('a');
        link.href = documento.url;
        link.download = documento.nome;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Download iniciado: ${documento.nome}`);
      }
    } catch (error) {
      console.error('Erro no download:', error);
      toast.error(`Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  // Funções para formulários
  const handleNewCertificado = () => {
    setEditingCertificado(null);
    setShowCertificadosForm(true);
  };

  const handleEditCertificado = (certificado: Certificado) => {
    setEditingCertificado(certificado);
    setShowCertificadosForm(true);
  };

  const handleSaveCertificado = (certificado: Certificado) => {
    if (editingCertificado) {
      setCertificados(prev => prev.map(c => c.id === certificado.id ? certificado : c));
    } else {
      setCertificados(prev => [...prev, certificado]);
    }
    setShowCertificadosForm(false);
    setEditingCertificado(null);
  };

  const handleNewRegisto = () => {
    setEditingRegisto(null);
    setShowRegistosForm(true);
  };

  const handleEditRegisto = (registo: Registo) => {
    setEditingRegisto(registo);
    setShowRegistosForm(true);
  };

  const handleSaveRegisto = (registo: Registo) => {
    if (editingRegisto) {
      setRegistos(prev => prev.map(r => r.id === registo.id ? registo : r));
    } else {
      setRegistos(prev => [...prev, registo]);
    }
    setShowRegistosForm(false);
    setEditingRegisto(null);
    loadRegistos();
  };

  const handleNewTermo = () => {
    setEditingTermo(null);
    setShowTermosForm(true);
  };

  const handleEditTermo = (termo: TermoCondicoes) => {
    setEditingTermo(termo);
    setShowTermosForm(true);
  };

  const handleSaveTermo = (termo: TermoCondicoes) => {
    if (editingTermo) {
      setTermos(prev => prev.map(t => t.id === termo.id ? termo : t));
    } else {
      setTermos(prev => [...prev, termo]);
    }
    setShowTermosForm(false);
    setEditingTermo(null);
    loadTermos();
  };

  const handleNewRelatorio = () => {
    setEditingRelatorio(null);
    setShowRelatoriosForm(true);
  };

  const handleEditRelatorio = (relatorio: Relatorio) => {
    setEditingRelatorio(relatorio);
    setShowRelatoriosForm(true);
  };

  const handleSaveRelatorio = (relatorio: Relatorio) => {
    if (editingRelatorio) {
      setRelatorios(prev => prev.map(r => r.id === relatorio.id ? relatorio : r));
    } else {
      setRelatorios(prev => [...prev, relatorio]);
    }
    setShowRelatoriosForm(false);
    setEditingRelatorio(null);
    loadRelatorios();
  };

  // Funções de Delete para todos os subcapítulos
  const handleDeleteCertificado = async (certificado: Certificado) => {
    if (!window.confirm(`Tem certeza que deseja apagar o certificado "${certificado.titulo}"?`)) {
      return;
    }

    try {
      // Apagar documentos anexos do storage
      if (certificado.documentos_anexos && certificado.documentos_anexos.length > 0) {
        for (const doc of certificado.documentos_anexos) {
          if (doc.path) {
            await storageService.deleteFile(
              doc.path,
              (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents'
            );
          }
        }
      }

      await certificadosAPI.certificados.delete(certificado.id);
      setCertificados(prev => prev.filter(c => c.id !== certificado.id));
      toast.success('Certificado apagado com sucesso');
    } catch (error) {
      console.error('Erro ao apagar certificado:', error);
      toast.error('Erro ao apagar certificado');
    }
  };

  const handleDeleteRegisto = async (registo: Registo) => {
    if (!window.confirm(`Tem certeza que deseja apagar o registo "${registo.titulo}"?`)) {
      return;
    }

    try {
      // Apagar documentos anexos do storage
      if (registo.documentos_anexos && registo.documentos_anexos.length > 0) {
        for (const doc of registo.documentos_anexos) {
          if (doc.path) {
            await storageService.deleteFile(
              doc.path,
              (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents'
            );
          }
        }
      }

      // Apagar fotografias do storage
      if (registo.fotografias && registo.fotografias.length > 0) {
        for (const foto of registo.fotografias) {
          if (foto.path) {
            await storageService.deleteFile(
              foto.path,
              (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents'
            );
          }
        }
      }

      await certificadosAPI.registos.delete(registo.id);
      setRegistos(prev => prev.filter(r => r.id !== registo.id));
      toast.success('Registo apagado com sucesso');
    } catch (error) {
      console.error('Erro ao apagar registo:', error);
      toast.error('Erro ao apagar registo');
    }
  };

  const handleDeleteTermo = async (termo: TermoCondicoes) => {
    if (!window.confirm(`Tem certeza que deseja apagar o termo "${termo.titulo}"?`)) {
      return;
    }

    try {
      // Apagar documentos anexos do storage
      if (termo.documentos_anexos && termo.documentos_anexos.length > 0) {
        for (const doc of termo.documentos_anexos) {
          if (doc.path) {
            await storageService.deleteFile(
              doc.path,
              (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents'
            );
          }
        }
      }

      await certificadosAPI.termos.delete(termo.id);
      setTermos(prev => prev.filter(t => t.id !== termo.id));
      toast.success('Termo apagado com sucesso');
    } catch (error) {
      console.error('Erro ao apagar termo:', error);
      toast.error('Erro ao apagar termo');
    }
  };

  const handleDeleteRelatorio = async (relatorio: Relatorio) => {
    if (!window.confirm(`Tem certeza que deseja apagar o relatório "${relatorio.titulo}"?`)) {
      return;
    }

    try {
      // Apagar documentos anexos do storage
      if (relatorio.documentos_anexos && relatorio.documentos_anexos.length > 0) {
        for (const doc of relatorio.documentos_anexos) {
          if (doc.path) {
            await storageService.deleteFile(
              doc.path,
              (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents'
            );
          }
        }
      }

      await certificadosAPI.relatorios.delete(relatorio.id);
      setRelatorios(prev => prev.filter(r => r.id !== relatorio.id));
      toast.success('Relatório apagado com sucesso');
    } catch (error) {
      console.error('Erro ao apagar relatório:', error);
      toast.error('Erro ao apagar relatório');
    }
  };

  // Funções de Download para todos os subcapítulos
  const handleDownloadRegistoDocumento = async (documento: any) => {
    try {
      if (documento.path) {
        await storageService.downloadFile(
          documento.path,
          documento.nome,
          (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents'
        );
        toast.success(`Download iniciado: ${documento.nome}`);
      } else {
        const link = document.createElement('a');
        link.href = documento.url;
        link.download = documento.nome;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Download iniciado: ${documento.nome}`);
      }
    } catch (error) {
      console.error('Erro no download:', error);
      toast.error(`Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const handleDownloadRegistoFoto = async (foto: any) => {
    try {
      if (foto.path) {
        await storageService.downloadFile(
          foto.path,
          foto.nome,
          (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents'
        );
        toast.success(`Download iniciado: ${foto.nome}`);
      } else {
        const link = document.createElement('a');
        link.href = foto.url;
        link.download = foto.nome;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Download iniciado: ${foto.nome}`);
      }
    } catch (error) {
      console.error('Erro no download:', error);
      toast.error(`Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const handleDownloadTermoDocumento = async (documento: any) => {
    try {
      if (documento.path) {
        await storageService.downloadFile(
          documento.path,
          documento.nome,
          (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents'
        );
        toast.success(`Download iniciado: ${documento.nome}`);
      } else {
        const link = document.createElement('a');
        link.href = documento.url;
        link.download = documento.nome;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Download iniciado: ${documento.nome}`);
      }
    } catch (error) {
      console.error('Erro no download:', error);
      toast.error(`Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const handleDownloadRelatorioDocumento = async (documento: any) => {
    try {
      if (documento.path) {
        await storageService.downloadFile(
          documento.path,
          documento.nome,
          (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents'
        );
        toast.success(`Download iniciado: ${documento.nome}`);
      } else {
        const link = document.createElement('a');
        link.href = documento.url;
        link.download = documento.nome;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Download iniciado: ${documento.nome}`);
      }
    } catch (error) {
      console.error('Erro no download:', error);
      toast.error(`Erro ao descarregar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const handleUploadDocumento = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCertificado) return;
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      setUploadingDoc(true);
      if (!storageService.validateFileType(file)) {
        toast.error('Tipo de ficheiro não suportado');
        return;
      }
      if (!storageService.validateFileSize(file, 20)) {
        toast.error('Ficheiro demasiado grande (máx. 20MB)');
        return;
      }

      const folder = `certificados/${selectedCertificado.id}`;
      const result = await storageService.uploadFile(file, folder);
      const newDoc = {
        nome: file.name,
        url: result.url,
        tipo: file.type,
        tamanho: file.size,
        data_upload: new Date().toISOString(),
        path: result.path
      };

      const updatedDocs = [...(selectedCertificado.documentos_anexos || []), newDoc];
      await certificadosAPI.certificados.update(selectedCertificado.id, { documentos_anexos: updatedDocs });

      // Atualizar estado local (lista e selecionado)
      setSelectedCertificado({ ...selectedCertificado, documentos_anexos: updatedDocs });
      setCertificados(prev => prev.map(c => c.id === selectedCertificado.id ? { ...c, documentos_anexos: updatedDocs } : c));
      toast.success('Documento anexado com sucesso');
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao anexar documento');
    } finally {
      setUploadingDoc(false);
      if (event.target) event.target.value = '';
    }
  };

  const handleRemoveDocumento = async (index: number) => {
    if (!selectedCertificado) return;
    try {
      const doc = selectedCertificado.documentos_anexos[index];
      if (doc?.path) {
        await storageService.deleteFile(
          doc.path,
          (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents'
        );
      }
      const updatedDocs = selectedCertificado.documentos_anexos.filter((_, i) => i !== index);
      await certificadosAPI.certificados.update(selectedCertificado.id, { documentos_anexos: updatedDocs });
      setSelectedCertificado({ ...selectedCertificado, documentos_anexos: updatedDocs });
      setCertificados(prev => prev.map(c => c.id === selectedCertificado.id ? { ...c, documentos_anexos: updatedDocs } : c));
      toast.success('Documento removido');
    } catch (error) {
      console.error('Erro a remover documento:', error);
      toast.error('Erro a remover documento');
    }
  };

  const clearFilters = () => {
    setFiltros({});
    setSearchTerm('');
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'certificados': return <Award className="h-5 w-5" />;
      case 'registos': return <ClipboardList className="h-5 w-5" />;
      case 'termos': return <FileCheck className="h-5 w-5" />;
      case 'relatorios': return <FileText className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'certificados': return 'Certificados';
      case 'registos': return 'Registos';
      case 'termos': return 'Termos';
      case 'relatorios': return 'Relatórios';
      default: return 'Certificados';
    }
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'certificados': return certificados.length;
      case 'registos': return registos.length;
      case 'termos': return termos.length;
      case 'relatorios': return relatorios.length;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Certificados e Registos</h1>
                <p className="text-sm text-gray-600">Gestão completa de certificações e documentação</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleExport('csv')}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => {
                  setTipoRelatorio('filtrado');
                  setShowRelatorio(true);
                }}
                className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Relatório</span>
              </button>
              <button 
                onClick={() => {
                  if (activeTab === 'certificados') {
                    handleNewCertificado();
                  } else if (activeTab === 'registos') {
                    handleNewRegisto();
                  } else if (activeTab === 'termos') {
                    handleNewTermo();
                  } else if (activeTab === 'relatorios') {
                    handleNewRelatorio();
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-lg hover:from-green-600 hover:to-blue-600 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Novo {
                  activeTab === 'certificados' ? 'Certificado' : 
                  activeTab === 'registos' ? 'Registo' : 
                  activeTab === 'termos' ? 'Termo' :
                  activeTab === 'relatorios' ? 'Relatório' : 'Item'
                }</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        {estatisticas && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Certificados</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.total_certificados}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Certificados Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{estatisticas.certificados_ativos}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Próximos Expiração</p>
                  <p className="text-2xl font-bold text-yellow-600">{estatisticas.proximos_expiracao}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expirados</p>
                  <p className="text-2xl font-bold text-red-600">{estatisticas.certificados_expirados}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <X className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Tabs de Navegação */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {(['certificados', 'registos', 'termos', 'relatorios'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {getTabIcon(tab)}
                  <span>{getTabLabel(tab)}</span>
                  <span className="bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                    {getTabCount(tab)}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo da Tab Ativa */}
        {activeTab === 'certificados' && (
          <>
            {/* Filtros e Pesquisa */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Pesquisa e Filtros</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filtros Avançados</span>
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {/* Pesquisa Rápida */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por código, título ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Filtros Avançados */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                    <select
                      value={filtros.tipo_certificado || ''}
                      onChange={(e) => setFiltros({ ...filtros, tipo_certificado: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Todos os tipos</option>
                      {Object.entries(TIPOS_CERTIFICADO).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                    <select
                      value={filtros.categoria || ''}
                      onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Todas as categorias</option>
                      {Object.entries(CATEGORIAS_CERTIFICADO).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filtros.status || ''}
                      onChange={(e) => setFiltros({ ...filtros, status: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Todos os status</option>
                      {Object.entries(STATUS_CERTIFICADO).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Entidade</label>
                    <input
                      type="text"
                      placeholder="Nome da entidade..."
                      value={filtros.entidade_certificadora || ''}
                      onChange={(e) => setFiltros({ ...filtros, entidade_certificadora: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </motion.div>
              )}

              {/* Botões de Ação */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {certificados.length} certificado{certificados.length !== 1 ? 's' : ''} encontrado{certificados.length !== 1 ? 's' : ''}
                  </span>
                  {(searchTerm || Object.keys(filtros).length > 0) && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                      <span>Limpar filtros</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tabela de Certificados */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('codigo')}>
                        <div className="flex items-center space-x-1">
                          <span>Código</span>
                          {sortBy === 'codigo' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => handleSort('titulo')}>
                        <div className="flex items-center space-x-1">
                          <span>Título</span>
                          {sortBy === 'titulo' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entidade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('data_validade')}>
                        <div className="flex items-center space-x-1">
                          <span>Validade</span>
                          {sortBy === 'data_validade' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                            <span>Carregando certificados...</span>
                          </div>
                        </td>
                      </tr>
                    ) : certificados.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          Nenhum certificado encontrado
                        </td>
                      </tr>
                    ) : (
                      sortedCertificados.map((certificado) => (
                        <tr key={certificado.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{certificado.codigo}</div>
                            <div className="text-sm text-gray-500">v{certificado.versao}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{certificado.titulo}</div>
                            <div className="text-sm text-gray-500 line-clamp-2">{certificado.descricao}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {TIPOS_CERTIFICADO[certificado.tipo_certificado]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {certificado.entidade_certificadora}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(certificado.status)}`}>
                              {getStatusIcon(certificado.status)}
                              <span className="ml-1">{STATUS_CERTIFICADO[certificado.status]}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <span>{new Date(certificado.data_validade).toLocaleDateString('pt-PT')}</span>
                              {isProximoExpiracao(certificado.data_validade) && (
                                <AlertTriangle className="h-4 w-4 text-yellow-500" title="Próximo da expiração" />
                              )}
                              {isExpirado(certificado.data_validade) && (
                                <X className="h-4 w-4 text-red-500" title="Expirado" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              {certificado.documentos_anexos.length > 0 && (
                                <button
                                  onClick={() => handleDownloadDocumento(certificado.documentos_anexos[0])}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Download documento"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedCertificado(certificado);
                                  setShowDetails(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleEditCertificado(certificado)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteCertificado(certificado)}
                                className="text-red-600 hover:text-red-900"
                                title="Apagar certificado"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Tab de Registos */}
        {activeTab === 'registos' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Registos</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Pesquisar registos..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                          <span>Carregando registos...</span>
                        </div>
                      </td>
                    </tr>
                  ) : registos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Nenhum registo encontrado
                      </td>
                    </tr>
                  ) : (
                    registos.map((registo) => (
                      <tr key={registo.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{registo.codigo}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{registo.titulo}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{registo.descricao}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {registo.tipo_registo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            registo.status === 'concluido' ? 'bg-green-100 text-green-800' :
                            registo.status === 'em_andamento' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {registo.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(registo.data_registo).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {registo.documentos_anexos && registo.documentos_anexos.length > 0 && (
                              <button
                                onClick={() => handleDownloadRegistoDocumento(registo.documentos_anexos[0])}
                                className="text-blue-600 hover:text-blue-900"
                                title="Download documento"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                            {registo.fotografias && registo.fotografias.length > 0 && (
                              <button
                                onClick={() => handleDownloadRegistoFoto(registo.fotografias[0])}
                                className="text-green-600 hover:text-green-900"
                                title="Download fotografia"
                              >
                                <FileText className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEditRegisto(registo)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Editar registo"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteRegisto(registo)}
                              className="text-red-600 hover:text-red-900"
                              title="Apagar registo"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Termos */}
        {activeTab === 'termos' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Termos e Condições</h3>
              <p className="text-sm text-gray-600">Gestão de termos, contratos e acordos</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Criação
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {termos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Nenhum termo encontrado
                      </td>
                    </tr>
                  ) : (
                    termos.map((termo) => (
                      <tr key={termo.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{termo.codigo}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{termo.titulo}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{termo.descricao}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {termo.tipo_termo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            termo.status === 'ativo' ? 'bg-green-100 text-green-800' :
                            termo.status === 'aprovado' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {termo.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(termo.data_criacao).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {termo.documentos_anexos && termo.documentos_anexos.length > 0 && (
                              <button
                                onClick={() => handleDownloadTermoDocumento(termo.documentos_anexos[0])}
                                className="text-blue-600 hover:text-blue-900"
                                title="Download documento"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEditTermo(termo)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Editar termo"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTermo(termo)}
                              className="text-red-600 hover:text-red-900"
                              title="Apagar termo"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Relatórios */}
        {activeTab === 'relatorios' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Relatórios</h3>
              <p className="text-sm text-gray-600">Gestão de relatórios e documentação</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {relatorios.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Nenhum relatório encontrado
                      </td>
                    </tr>
                  ) : (
                    relatorios.map((relatorio) => (
                      <tr key={relatorio.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{relatorio.codigo}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{relatorio.titulo}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{relatorio.descricao}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {relatorio.tipo_relatorio}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            relatorio.status === 'publicado' ? 'bg-green-100 text-green-800' :
                            relatorio.status === 'aprovado' ? 'bg-blue-100 text-blue-800' :
                            relatorio.status === 'em_revisao' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {relatorio.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(relatorio.data_relatorio).toLocaleDateString('pt-PT')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {relatorio.documentos_anexos && relatorio.documentos_anexos.length > 0 && (
                              <button
                                onClick={() => handleDownloadRelatorioDocumento(relatorio.documentos_anexos[0])}
                                className="text-blue-600 hover:text-blue-900"
                                title="Download documento"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEditRelatorio(relatorio)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Editar relatório"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteRelatorio(relatorio)}
                              className="text-red-600 hover:text-red-900"
                              title="Apagar relatório"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {showDetails && selectedCertificado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedCertificado.codigo}</h2>
                    <p className="text-sm text-gray-600">Detalhes do Certificado</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCertificado.titulo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Versão</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCertificado.versao}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {TIPOS_CERTIFICADO[selectedCertificado.tipo_certificado]}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {CATEGORIAS_CERTIFICADO[selectedCertificado.categoria]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Descrição e Escopo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Descrição e Escopo</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCertificado.descricao || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Escopo</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCertificado.escopo}</p>
                  </div>
                </div>
              </div>

              {/* Entidade Certificadora */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Entidade Certificadora</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCertificado.entidade_certificadora}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organismo Acreditação</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCertificado.organismo_acreditacao || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Número Acreditação</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCertificado.numero_acreditacao || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Datas Importantes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Datas Importantes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data Emissão</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedCertificado.data_emissao).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data Validade</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedCertificado.data_validade).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  {selectedCertificado.data_renovacao && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data Renovação</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedCertificado.data_renovacao).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documentos Anexos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Documentos Anexos</h3>
                  <label className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-lg hover:from-green-600 hover:to-blue-600 cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingDoc ? 'A carregar...' : 'Anexar Documento'}
                    <input type="file" className="hidden" onChange={handleUploadDocumento} disabled={uploadingDoc} />
                  </label>
                </div>
                {selectedCertificado.documentos_anexos.length === 0 ? (
                  <p className="text-sm text-gray-500">Sem documentos anexos.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedCertificado.documentos_anexos.map((doc, index) => (
                      <div key={index} className="flex items-center px-3 py-2 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg hover:bg-blue-100 transition-colors">
                        <span className="mr-2">📎</span>
                        <span className="font-medium truncate max-w-48">{doc.nome}</span>
                        <span className="ml-2 text-gray-600 text-xs">
                          {doc.tamanho ? `(${(doc.tamanho / 1024 / 1024).toFixed(2)} MB)` : ''}
                        </span>
                        <button
                          onClick={() => handleDownloadDocumento(doc)}
                          className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded"
                          title="Descarregar documento"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveDocumento(index)}
                          className="ml-1 p-1 text-red-600 hover:text-red-800 hover:bg-red-200 rounded"
                          title="Remover documento"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Observações */}
              {selectedCertificado.observacoes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
                  <p className="text-sm text-gray-900">{selectedCertificado.observacoes}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Formulários */}
      {showCertificadosForm && (
        <CertificadosForms
          certificado={editingCertificado || undefined}
          onClose={() => {
            setShowCertificadosForm(false);
            setEditingCertificado(null);
          }}
          onSave={handleSaveCertificado}
        />
      )}

      {showRegistosForm && (
        <RegistosForms
          registo={editingRegisto || undefined}
          onClose={() => {
            setShowRegistosForm(false);
            setEditingRegisto(null);
          }}
          onSave={handleSaveRegisto}
        />
      )}

      {showTermosForm && (
        <TermosForms
          termo={editingTermo || undefined}
          onClose={() => {
            setShowTermosForm(false);
            setEditingTermo(null);
          }}
          onSave={handleSaveTermo}
        />
      )}

      {showRelatoriosForm && (
        <RelatoriosForms
          relatorio={editingRelatorio || undefined}
          onClose={() => {
            setShowRelatoriosForm(false);
            setEditingRelatorio(null);
          }}
          onSave={handleSaveRelatorio}
        />
      )}

      {/* Modal de Relatórios Premium */}
      {showRelatorio && (
        <RelatorioCertificadosPremium
          certificados={certificados}
          onClose={() => setShowRelatorio(false)}
          onSelecaoChange={setCertificadosSelecionados}
        />
      )}

      {/* Informação sobre seleção */}
      {certificadosSelecionados.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-40">
          <div className="flex items-center space-x-2">
            <span>{certificadosSelecionados.length} certificados selecionados</span>
            <button
              onClick={() => setCertificadosSelecionados([])}
              className="text-white hover:text-blue-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente auxiliar para ícone de refresh
const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
