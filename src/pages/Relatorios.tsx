import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Package
} from 'lucide-react'
import { 
  documentosAPI, 
  ensaiosAPI, 
  checklistsAPI, 
  materiaisAPI, 
  fornecedoresAPI, 
  naoConformidadesAPI 
} from '@/lib/pocketbase'

export default function Relatorios() {
  const [stats, setStats] = useState({
    documentos: 0,
    ensaios: 0,
    checklists: 0,
    materiais: 0,
    fornecedores: 0,
    naoConformidades: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const [
        documentos,
        ensaios,
        checklists,
        materiais,
        fornecedores,
        naoConformidades
      ] = await Promise.all([
        documentosAPI.getAll(),
        ensaiosAPI.getAll(),
        checklistsAPI.getAll(),
        materiaisAPI.getAll(),
        fornecedoresAPI.getAll(),
        naoConformidadesAPI.getAll()
      ])

      setStats({
        documentos: documentos.length,
        ensaios: ensaios.length,
        checklists: checklists.length,
        materiais: materiais.length,
        fornecedores: fornecedores.length,
        naoConformidades: naoConformidades.length
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = (type: string) => {
    const date = new Date().toISOString().split('T')[0]
    const filename = `relatorio_${type}_${date}.pdf`
    
    // Simular geração de relatório
    const link = document.createElement('a')
    link.href = '#'
    link.download = filename
    link.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Relatórios e análises do sistema</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documentos</p>
                <p className="text-2xl font-bold text-blue-600">{stats.documentos}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ensaios</p>
                <p className="text-2xl font-bold text-green-600">{stats.ensaios}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checklists</p>
                <p className="text-2xl font-bold text-purple-600">{stats.checklists}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Materiais</p>
                <p className="text-2xl font-bold text-orange-600">{stats.materiais}</p>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fornecedores</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.fornecedores}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Não Conformidades</p>
                <p className="text-2xl font-bold text-red-600">{stats.naoConformidades}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Relatório Geral</h3>
            <p className="card-description">Visão geral de todos os módulos</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total de registos</span>
                <span className="font-medium">
                  {stats.documentos + stats.ensaios + stats.checklists + stats.materiais + stats.fornecedores + stats.naoConformidades}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última atualização</span>
                <span className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-PT')}</span>
              </div>
              <button 
                onClick={() => handleExportReport('geral')}
                className="btn btn-primary btn-sm w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Relatório de Qualidade</h3>
            <p className="card-description">Análise de conformidade e ensaios</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ensaios realizados</span>
                <span className="font-medium">{stats.ensaios}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Checklists</span>
                <span className="font-medium">{stats.checklists}</span>
              </div>
              <button 
                onClick={() => handleExportReport('qualidade')}
                className="btn btn-outline btn-sm w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Relatório de Materiais</h3>
            <p className="card-description">Controlo de stocks e fornecedores</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Materiais</span>
                <span className="font-medium">{stats.materiais}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fornecedores</span>
                <span className="font-medium">{stats.fornecedores}</span>
              </div>
              <button 
                onClick={() => handleExportReport('materiais')}
                className="btn btn-outline btn-sm w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Relatório de Não Conformidades</h3>
            <p className="card-description">Análise de problemas e resoluções</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-medium">{stats.naoConformidades}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Último mês</span>
                <span className="text-sm text-gray-500">-</span>
              </div>
              <button 
                onClick={() => handleExportReport('nao_conformidades')}
                className="btn btn-outline btn-sm w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Relatório Mensal</h3>
            <p className="card-description">Resumo mensal de atividades</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mês atual</span>
                <span className="font-medium">{new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Período</span>
                <span className="text-sm text-gray-500">1-31</span>
              </div>
              <button 
                onClick={() => handleExportReport('mensal')}
                className="btn btn-outline btn-sm w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Relatório Personalizado</h3>
            <p className="card-description">Criar relatório personalizado</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Filtros</span>
                <span className="text-sm text-gray-500">Personalizar</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Formato</span>
                <span className="text-sm text-gray-500">PDF/Excel</span>
              </div>
              <button className="btn btn-outline btn-sm w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Configurar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 