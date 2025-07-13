import { pb } from './pocketbase'
import { 
  Documento, 
  Ensaio, 
  Checklist, 
  Material, 
  Fornecedor, 
  NaoConformidade,
  Obra,
  RFI,
  User
} from '@/types'

// Configurações da API
const API_CONFIG = {
  timeout: 30000, // 30 segundos
  retryAttempts: 3,
  retryDelay: 1000, // 1 segundo
}

// Interface para opções de query
export interface QueryOptions {
  page?: number
  perPage?: number
  sort?: string
  filter?: string
  expand?: string
  fields?: string
}

// Interface para resposta paginada
export interface PaginatedResponse<T> {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: T[]
}

// Classe base para APIs
class BaseAPI {
  protected collection: string

  constructor(collection: string) {
    this.collection = collection
  }

  // Método genérico para fazer requests com retry
  protected async makeRequest<T>(
    requestFn: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: any

    for (let attempt = 1; attempt <= API_CONFIG.retryAttempts; attempt++) {
      try {
        return await requestFn()
      } catch (error: any) {
        lastError = error
        
        // Se é erro de rede, tentar novamente
        if (this.isRetryableError(error) && attempt < API_CONFIG.retryAttempts) {
          await this.delay(API_CONFIG.retryDelay * attempt)
          continue
        }
        
        // Se não é retryable ou última tentativa, lançar erro
        break
      }
    }

    throw new Error(`Failed to make request to ${this.collection} collection: ${lastError.message || lastError}`)
  }

  // Verificar se erro é retryable
  private isRetryableError(error: any): boolean {
    if (!error) return false
    
    // Erros de rede são retryable
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return true
    }
    
    // Timeouts são retryable
    if (error.message?.includes('timeout')) {
      return true
    }
    
    // Erros 5xx são retryable (exceto 501, 502, 503)
    if (error.status >= 500 && error.status !== 501 && error.status !== 502 && error.status !== 503) {
      return true
    }
    
    return false
  }

  // Delay entre tentativas
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Obter todos os registos
  async getAll(options: QueryOptions = {}): Promise<PaginatedResponse<any>> {
    return this.makeRequest(async () => {
      const { page = 1, perPage = 50, sort, filter, expand, fields } = options
      
      const result = await pb.collection(this.collection).getList(page, perPage, {
        sort,
        filter,
        expand,
        fields
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items
      }
    }, 'getAll')
  }

  // Obter por ID
  async getById(id: string, expand?: string): Promise<any> {
    return this.makeRequest(async () => {
      return await pb.collection(this.collection).getOne(id, { expand })
    }, 'getById')
  }

  // Criar registo
  async create(data: any): Promise<any> {
    return this.makeRequest(async () => {
      return await pb.collection(this.collection).create(data)
    }, 'create')
  }

  // Atualizar registo
  async update(id: string, data: any): Promise<any> {
    return this.makeRequest(async () => {
      return await pb.collection(this.collection).update(id, data)
    }, 'update')
  }

  // Eliminar registo
  async delete(id: string): Promise<boolean> {
    return this.makeRequest(async () => {
      await pb.collection(this.collection).delete(id)
      return true
    }, 'delete')
  }

  // Buscar por texto
  async search(query: string, options: QueryOptions = {}): Promise<PaginatedResponse<any>> {
    return this.makeRequest(async () => {
      const { page = 1, perPage = 50, sort, expand, fields } = options
      
      // Criar filtro de busca dinâmico baseado na coleção
      const searchFilter = this.buildSearchFilter(query)
      
      const result = await pb.collection(this.collection).getList(page, perPage, {
        sort,
        filter: searchFilter,
        expand,
        fields
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items
      }
    }, 'search')
  }

  // Construir filtro de busca baseado na coleção
  private buildSearchFilter(query: string): string {
    const searchableFields = this.getSearchableFields()
    const conditions = searchableFields.map(field => `${field} ~ "${query}"`)
    return conditions.join(' || ')
  }

  // Obter campos pesquisáveis (a ser sobrescrito pelas classes filhas)
  protected getSearchableFields(): string[] {
    return ['codigo', 'nome', 'descricao']
  }
}

// API para Documentos
export class DocumentosAPI extends BaseAPI {
  constructor() {
    super('documentos')
  }

  protected getSearchableFields(): string[] {
    return ['codigo', 'nome', 'descricao', 'tipo', 'categoria', 'palavras_chave']
  }

  // Métodos específicos para documentos
  async getByTipo(tipo: string): Promise<PaginatedResponse<Documento>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: `tipo = "${tipo}"`,
        sort: '-data_criacao'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as Documento[]
      }
    }, 'getByTipo')
  }

  async getByEstado(estado: string): Promise<PaginatedResponse<Documento>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: `estado = "${estado}"`,
        sort: '-data_criacao'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as Documento[]
      }
    }, 'getByEstado')
  }

  async aprovar(id: string, aprovador: string): Promise<Documento> {
    return this.makeRequest(async () => {
      return await pb.collection(this.collection).update(id, {
        estado: 'aprovado',
        aprovador,
        data_aprovacao: new Date().toISOString()
      }) as Documento
    }, 'aprovar')
  }

  async rejeitar(id: string, revisor: string, observacoes: string): Promise<Documento> {
    return this.makeRequest(async () => {
      return await pb.collection(this.collection).update(id, {
        estado: 'reprovado',
        revisor,
        data_revisao: new Date().toISOString(),
        observacoes
      }) as Documento
    }, 'rejeitar')
  }
}

// API para Ensaios
export class EnsaiosAPI extends BaseAPI {
  constructor() {
    super('ensaios')
  }

  protected getSearchableFields(): string[] {
    return ['codigo', 'tipo', 'material_id', 'resultado', 'laboratorio']
  }

  // Métodos específicos para ensaios
  async getByMaterial(materialId: string): Promise<PaginatedResponse<Ensaio>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: `material_id = "${materialId}"`,
        sort: '-data_ensaio'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as Ensaio[]
      }
    }, 'getByMaterial')
  }

  async getConformes(conforme: boolean): Promise<PaginatedResponse<Ensaio>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: `conforme = ${conforme}`,
        sort: '-data_ensaio'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as Ensaio[]
      }
    }, 'getConformes')
  }

  async adicionarSeguimento(id: string, seguimento: any): Promise<Ensaio> {
    return this.makeRequest(async () => {
      const ensaio = await pb.collection(this.collection).getOne(id)
      const seguimentos = ensaio.seguimento || []
      seguimentos.push({
        id: Date.now().toString(),
        ...seguimento,
        data: new Date().toISOString()
      })

      return await pb.collection(this.collection).update(id, {
        seguimento: seguimentos
      }) as Ensaio
    }, 'adicionarSeguimento')
  }
}

// API para Checklists
export class ChecklistsAPI extends BaseAPI {
  constructor() {
    super('checklists')
  }

  protected getSearchableFields(): string[] {
    return ['codigo', 'titulo', 'obra', 'status']
  }

  // Métodos específicos para checklists
  async getByObra(obra: string): Promise<PaginatedResponse<Checklist>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: `obra = "${obra}"`,
        sort: '-data_criacao'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as Checklist[]
      }
    }, 'getByObra')
  }

  async getByStatus(status: string): Promise<PaginatedResponse<Checklist>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: `status = "${status}"`,
        sort: '-data_criacao'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as Checklist[]
      }
    }, 'getByStatus')
  }

  async executarPonto(checklistId: string, pontoId: string, resultado: any): Promise<Checklist> {
    return this.makeRequest(async () => {
      const checklist = await pb.collection(this.collection).getOne(checklistId)
      const pontos = checklist.pontos.map((ponto: any) => {
        if (ponto.id === pontoId) {
          return {
            ...ponto,
            status: resultado.status,
            data_inspecao: new Date().toISOString(),
            linha_tempo: [
              ...(ponto.linha_tempo || []),
              {
                id: Date.now().toString(),
                data: new Date().toISOString(),
                acao: 'inspecionado',
                responsavel: resultado.responsavel,
                detalhes: resultado.detalhes
              }
            ]
          }
        }
        return ponto
      })

      return await pb.collection(this.collection).update(checklistId, {
        pontos
      }) as Checklist
    }, 'executarPonto')
  }
}

// API para Materiais
export class MateriaisAPI extends BaseAPI {
  constructor() {
    super('materiais')
  }

  protected getSearchableFields(): string[] {
    return ['codigo', 'nome', 'tipo', 'lote', 'fornecedor_id']
  }

  // Métodos específicos para materiais
  async getByFornecedor(fornecedorId: string): Promise<PaginatedResponse<Material>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: `fornecedor_id = "${fornecedorId}"`,
        sort: '-data_rececao'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as Material[]
      }
    }, 'getByFornecedor')
  }

  async getByTipo(tipo: string): Promise<PaginatedResponse<Material>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: `tipo = "${tipo}"`,
        sort: '-data_rececao'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as Material[]
      }
    }, 'getByTipo')
  }
}

// API para Fornecedores
export class FornecedoresAPI extends BaseAPI {
  constructor() {
    super('fornecedores')
  }

  protected getSearchableFields(): string[] {
    return ['nome', 'nif', 'email', 'contacto']
  }

  // Métodos específicos para fornecedores
  async getAtivos(): Promise<PaginatedResponse<Fornecedor>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: 'estado = "ativo"',
        sort: 'nome'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as Fornecedor[]
      }
    }, 'getAtivos')
  }

  async avaliar(id: string, avaliacao: any): Promise<Fornecedor> {
    return this.makeRequest(async () => {
      const fornecedor = await pb.collection(this.collection).getOne(id)
      const avaliacoes = fornecedor.avaliacoes || []
      avaliacoes.push({
        id: Date.now().toString(),
        ...avaliacao,
        data: new Date().toISOString()
      })

      return await pb.collection(this.collection).update(id, {
        avaliacoes
      }) as Fornecedor
    }, 'avaliar')
  }
}

// API para Não Conformidades
export class NaoConformidadesAPI extends BaseAPI {
  constructor() {
    super('nao_conformidades')
  }

  protected getSearchableFields(): string[] {
    return ['codigo', 'tipo', 'descricao', 'severidade', 'categoria']
  }

  // Métodos específicos para não conformidades
  async getBySeveridade(severidade: string): Promise<PaginatedResponse<NaoConformidade>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: `severidade = "${severidade}"`,
        sort: '-data_deteccao'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as NaoConformidade[]
      }
    }, 'getBySeveridade')
  }

  async getPendentes(): Promise<PaginatedResponse<NaoConformidade>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: 'data_resolucao = ""',
        sort: '-data_deteccao'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as NaoConformidade[]
      }
    }, 'getPendentes')
  }

  async resolver(id: string, resolucao: any): Promise<NaoConformidade> {
    return this.makeRequest(async () => {
      const nc = await pb.collection(this.collection).getOne(id)
      const timeline = nc.timeline || []
      timeline.push({
        id: Date.now().toString(),
        data: new Date().toISOString(),
        tipo: 'resolucao',
        responsavel: resolucao.responsavel,
        descricao: 'Não conformidade resolvida',
        detalhes: resolucao.detalhes
      })

      return await pb.collection(this.collection).update(id, {
        estado: 'concluido',
        data_resolucao: new Date().toISOString(),
        responsavel_resolucao: resolucao.responsavel,
        acao_corretiva: resolucao.acao_corretiva,
        timeline
      }) as NaoConformidade
    }, 'resolver')
  }
}

// API para Obras
export class ObrasAPI extends BaseAPI {
  constructor() {
    super('obras')
  }

  protected getSearchableFields(): string[] {
    return ['codigo', 'nome', 'cliente', 'localizacao', 'tipo_obra']
  }

  // Métodos específicos para obras
  async getByStatus(status: string): Promise<PaginatedResponse<Obra>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: `status = "${status}"`,
        sort: '-data_inicio'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as Obra[]
      }
    }, 'getByStatus')
  }

  async getByTipo(tipo: string): Promise<PaginatedResponse<Obra>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: `tipo_obra = "${tipo}"`,
        sort: '-data_inicio'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as Obra[]
      }
    }, 'getByTipo')
  }
}

// API para RFIs
export class RFIsAPI extends BaseAPI {
  constructor() {
    super('rfis')
  }

  protected getSearchableFields(): string[] {
    return ['numero', 'titulo', 'descricao', 'solicitante', 'destinatario']
  }

  // Métodos específicos para RFIs
  async getByStatus(status: string): Promise<PaginatedResponse<RFI>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: `status = "${status}"`,
        sort: '-data_solicitacao'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as RFI[]
      }
    }, 'getByStatus')
  }

  async getByPrioridade(prioridade: string): Promise<PaginatedResponse<RFI>> {
    return this.makeRequest(async () => {
      const result = await pb.collection(this.collection).getList(1, 50, {
        filter: `prioridade = "${prioridade}"`,
        sort: '-data_solicitacao'
      })

      return {
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        items: result.items as RFI[]
      }
    }, 'getByPrioridade')
  }

  async responder(id: string, resposta: any): Promise<RFI> {
    return this.makeRequest(async () => {
      const rfi = await pb.collection(this.collection).getOne(id)
      const timeline = rfi.timeline || []
      timeline.push({
        id: Date.now().toString(),
        data: new Date().toISOString(),
        tipo: 'respondido',
        responsavel: resposta.responsavel,
        descricao: 'RFI respondido',
        detalhes: resposta.detalhes
      })

      return await pb.collection(this.collection).update(id, {
        status: 'respondido',
        data_resposta: new Date().toISOString(),
        resposta: resposta.resposta,
        timeline
      }) as RFI
    }, 'responder')
  }
}

// Instâncias das APIs
export const documentosAPI = new DocumentosAPI()
export const ensaiosAPI = new EnsaiosAPI()
export const checklistsAPI = new ChecklistsAPI()
export const materiaisAPI = new MateriaisAPI()
export const fornecedoresAPI = new FornecedoresAPI()
export const naoConformidadesAPI = new NaoConformidadesAPI()
export const obrasAPI = new ObrasAPI()
export const rfisAPI = new RFIsAPI()

// API para métricas e estatísticas
export class MetricsAPI {
  // Obter estatísticas gerais
  async getDashboardStats(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const [
          documentosCount,
          ensaiosCount,
          checklistsCount,
          materiaisCount,
          fornecedoresCount,
          ncCount,
          obrasCount,
          rfisCount
        ] = await Promise.all([
          pb.collection('documentos').getList(1, 1),
          pb.collection('ensaios').getList(1, 1),
          pb.collection('checklists').getList(1, 1),
          pb.collection('materiais').getList(1, 1),
          pb.collection('fornecedores').getList(1, 1),
          pb.collection('nao_conformidades').getList(1, 1),
          pb.collection('obras').getList(1, 1),
          pb.collection('rfis').getList(1, 1)
        ])

        // Obter ensaios conformes
        const ensaiosConformes = await pb.collection('ensaios').getList(1, 1, {
          filter: 'conforme = true'
        })

        // Obter NCs resolvidas
        const ncResolvidas = await pb.collection('nao_conformidades').getList(1, 1, {
          filter: 'data_resolucao != ""'
        })

        resolve({
          totalDocumentos: documentosCount.totalItems,
          totalEnsaios: ensaiosCount.totalItems,
          totalChecklists: checklistsCount.totalItems,
          totalMateriais: materiaisCount.totalItems,
          totalFornecedores: fornecedoresCount.totalItems,
          totalNaoConformidades: ncCount.totalItems,
          totalObras: obrasCount.totalItems,
          totalRFIs: rfisCount.totalItems,
          ensaiosConformes: ensaiosConformes.totalItems,
          percentualConformidade: ensaiosCount.totalItems > 0 
            ? Math.round((ensaiosConformes.totalItems / ensaiosCount.totalItems) * 100)
            : 0,
          ncResolvidas: ncResolvidas.totalItems,
          percentualNCResolvidas: ncCount.totalItems > 0
            ? Math.round((ncResolvidas.totalItems / ncCount.totalItems) * 100)
            : 0
        })
      } catch (error: any) {
        reject(error)
      }
    })
  }

  // Obter estatísticas por período
  async getStatsByPeriod(startDate: string, endDate: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const filter = `data_criacao >= "${startDate}" && data_criacao <= "${endDate}"`
        
        const [
          documentos,
          ensaios,
          checklists,
          materiais,
          nc
        ] = await Promise.all([
          pb.collection('documentos').getList(1, 50, { filter }),
          pb.collection('ensaios').getList(1, 50, { filter }),
          pb.collection('checklists').getList(1, 50, { filter }),
          pb.collection('materiais').getList(1, 50, { filter }),
          pb.collection('nao_conformidades').getList(1, 50, { filter })
        ])

        resolve({
          periodo: { startDate, endDate },
          documentos: documentos.items,
          ensaios: ensaios.items,
          checklists: checklists.items,
          materiais: materiais.items,
          naoConformidades: nc.items
        })
      } catch (error: any) {
        reject(error)
      }
    })
  }
}

export const metricsAPI = new MetricsAPI() 