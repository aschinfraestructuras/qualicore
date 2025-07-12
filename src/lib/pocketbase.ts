import PocketBase from 'pocketbase'
import { 
  localEnsaiosAPI, 
  localDocumentosAPI, 
  localChecklistsAPI, 
  localMateriaisAPI, 
  localFornecedoresAPI, 
  localNaoConformidadesAPI 
} from './storage'

// Configuração para PocketBase online no Render
const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://qualicore-pocketbase.onrender.com'

export const pb = new PocketBase(POCKETBASE_URL)

// Configurar autenticação automática
pb.authStore.onChange(() => {
  // Salvar token no localStorage para persistir sessão
  if (pb.authStore.isValid) {
    localStorage.setItem('pocketbase_auth', JSON.stringify({
      token: pb.authStore.token,
      model: pb.authStore.model
    }))
  } else {
    localStorage.removeItem('pocketbase_auth')
  }
})

// Restaurar sessão ao carregar a página
const savedAuth = localStorage.getItem('pocketbase_auth')
if (savedAuth) {
  try {
    const { token, model } = JSON.parse(savedAuth)
    pb.authStore.save(token, model)
  } catch (error) {
    console.error('Erro ao restaurar sessão:', error)
    localStorage.removeItem('pocketbase_auth')
  }
}

export default pb

// Função para verificar se o PocketBase está disponível
const isPocketBaseAvailable = async (): Promise<boolean> => {
  try {
    await pb.health.check()
    return true
  } catch (error) {
    console.log('PocketBase não disponível, usando localStorage')
    return false
  }
}

// Tipos para as coleções do PocketBase
export interface DocumentoRecord {
  id: string
  codigo: string
  tipo: string
  versao: string
  data_validade?: string
  fornecedor_id?: string
  responsavel: string
  zona: string
  estado: string
  observacoes?: string
  anexos?: string[]
  created: string
  updated: string
}

export interface EnsaioRecord {
  id: string
  codigo: string
  tipo: string
  material_id: string
  resultado: string
  valor_obtido: number
  valor_esperado: number
  unidade: string
  laboratorio: string
  data_ensaio: string
  conforme: boolean
  responsavel: string
  zona: string
  estado: string
  observacoes?: string
  anexos?: string[]
  created: string
  updated: string
}

export interface ChecklistRecord {
  id: string
  codigo: string
  tipo: string
  itens: any
  percentual_conformidade: number
  data_inspecao: string
  inspetor: string
  responsavel: string
  zona: string
  estado: string
  observacoes?: string
  anexos?: string[]
  created: string
  updated: string
}

export interface MaterialRecord {
  id: string
  codigo: string
  nome: string
  tipo: string
  fornecedor_id: string
  certificado_id?: string
  data_rececao: string
  quantidade: number
  unidade: string
  lote: string
  responsavel: string
  zona: string
  estado: string
  observacoes?: string
  anexos?: string[]
  created: string
  updated: string
}

export interface FornecedorRecord {
  id: string
  nome: string
  nif: string
  morada: string
  telefone: string
  email: string
  contacto: string
  estado: string
  created: string
  updated: string
}

export interface NaoConformidadeRecord {
  id: string
  codigo: string
  tipo: string
  severidade: string
  data_deteccao: string
  data_resolucao?: string
  acao_corretiva?: string
  responsavel_resolucao?: string
  custo_estimado?: number
  relacionado_ensaio_id?: string
  relacionado_material_id?: string
  responsavel: string
  zona: string
  estado: string
  observacoes?: string
  anexos?: string[]
  created: string
  updated: string
}

// API para Documentos
export const documentosAPI = {
  getAll: async (): Promise<DocumentoRecord[]> => {
    try {
      const records = await pb.collection('documentos').getFullList<DocumentoRecord>()
      return records
    } catch (error) {
      console.error('Erro ao buscar documentos:', error)
      return []
    }
  },
  
  getById: async (id: string): Promise<DocumentoRecord | null> => {
    try {
      const record = await pb.collection('documentos').getOne<DocumentoRecord>(id)
      return record
    } catch (error) {
      console.error('Erro ao buscar documento:', error)
      return null
    }
  },
  
  create: async (data: Omit<DocumentoRecord, 'id' | 'created' | 'updated'>): Promise<DocumentoRecord | null> => {
    try {
      const record = await pb.collection('documentos').create<DocumentoRecord>(data)
      return record
    } catch (error) {
      console.error('Erro ao criar documento:', error)
      return null
    }
  },
  
  update: async (id: string, data: Partial<DocumentoRecord>): Promise<DocumentoRecord | null> => {
    try {
      const record = await pb.collection('documentos').update<DocumentoRecord>(id, data)
      return record
    } catch (error) {
      console.error('Erro ao atualizar documento:', error)
      return null
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      await pb.collection('documentos').delete(id)
      return true
    } catch (error) {
      console.error('Erro ao deletar documento:', error)
      return false
    }
  }
}

// API para Ensaios
export const ensaiosAPI = {
  getAll: async (): Promise<EnsaioRecord[]> => {
    try {
      const isAvailable = await isPocketBaseAvailable()
      if (isAvailable) {
        const records = await pb.collection('ensaios').getFullList<EnsaioRecord>()
        return records
      } else {
        return await localEnsaiosAPI.getAll()
      }
    } catch (error) {
      console.error('Erro ao buscar ensaios:', error)
      return await localEnsaiosAPI.getAll()
    }
  },
  
  getById: async (id: string): Promise<EnsaioRecord | null> => {
    try {
      const isAvailable = await isPocketBaseAvailable()
      if (isAvailable) {
        const record = await pb.collection('ensaios').getOne<EnsaioRecord>(id)
        return record
      } else {
        return await localEnsaiosAPI.getById(id)
      }
    } catch (error) {
      console.error('Erro ao buscar ensaio:', error)
      return await localEnsaiosAPI.getById(id)
    }
  },
  
  create: async (data: Omit<EnsaioRecord, 'id' | 'created' | 'updated'>): Promise<EnsaioRecord | null> => {
    try {
      const isAvailable = await isPocketBaseAvailable()
      if (isAvailable) {
        const record = await pb.collection('ensaios').create<EnsaioRecord>(data)
        return record
      } else {
        return await localEnsaiosAPI.create(data)
      }
    } catch (error) {
      console.error('Erro ao criar ensaio:', error)
      return await localEnsaiosAPI.create(data)
    }
  },
  
  update: async (id: string, data: Partial<EnsaioRecord>): Promise<EnsaioRecord | null> => {
    try {
      const isAvailable = await isPocketBaseAvailable()
      if (isAvailable) {
        const record = await pb.collection('ensaios').update<EnsaioRecord>(id, data)
        return record
      } else {
        return await localEnsaiosAPI.update(id, data)
      }
    } catch (error) {
      console.error('Erro ao atualizar ensaio:', error)
      return await localEnsaiosAPI.update(id, data)
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      const isAvailable = await isPocketBaseAvailable()
      if (isAvailable) {
        await pb.collection('ensaios').delete(id)
        return true
      } else {
        return await localEnsaiosAPI.delete(id)
      }
    } catch (error) {
      console.error('Erro ao deletar ensaio:', error)
      return await localEnsaiosAPI.delete(id)
    }
  }
}

// API para Checklists
export const checklistsAPI = {
  getAll: async (): Promise<ChecklistRecord[]> => {
    try {
      const records = await pb.collection('checklists').getFullList<ChecklistRecord>()
      return records
    } catch (error) {
      console.error('Erro ao buscar checklists:', error)
      return []
    }
  },
  
  getById: async (id: string): Promise<ChecklistRecord | null> => {
    try {
      const record = await pb.collection('checklists').getOne<ChecklistRecord>(id)
      return record
    } catch (error) {
      console.error('Erro ao buscar checklist:', error)
      return null
    }
  },
  
  create: async (data: Omit<ChecklistRecord, 'id' | 'created' | 'updated'>): Promise<ChecklistRecord | null> => {
    try {
      const record = await pb.collection('checklists').create<ChecklistRecord>(data)
      return record
    } catch (error) {
      console.error('Erro ao criar checklist:', error)
      return null
    }
  },
  
  update: async (id: string, data: Partial<ChecklistRecord>): Promise<ChecklistRecord | null> => {
    try {
      const record = await pb.collection('checklists').update<ChecklistRecord>(id, data)
      return record
    } catch (error) {
      console.error('Erro ao atualizar checklist:', error)
      return null
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      await pb.collection('checklists').delete(id)
      return true
    } catch (error) {
      console.error('Erro ao deletar checklist:', error)
      return false
    }
  }
}

// API para Materiais
export const materiaisAPI = {
  getAll: async (): Promise<MaterialRecord[]> => {
    try {
      const records = await pb.collection('materiais').getFullList<MaterialRecord>()
      return records
    } catch (error) {
      console.error('Erro ao buscar materiais:', error)
      return []
    }
  },
  
  getById: async (id: string): Promise<MaterialRecord | null> => {
    try {
      const record = await pb.collection('materiais').getOne<MaterialRecord>(id)
      return record
    } catch (error) {
      console.error('Erro ao buscar material:', error)
      return null
    }
  },
  
  create: async (data: Omit<MaterialRecord, 'id' | 'created' | 'updated'>): Promise<MaterialRecord | null> => {
    try {
      const record = await pb.collection('materiais').create<MaterialRecord>(data)
      return record
    } catch (error) {
      console.error('Erro ao criar material:', error)
      return null
    }
  },
  
  update: async (id: string, data: Partial<MaterialRecord>): Promise<MaterialRecord | null> => {
    try {
      const record = await pb.collection('materiais').update<MaterialRecord>(id, data)
      return record
    } catch (error) {
      console.error('Erro ao atualizar material:', error)
      return null
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      await pb.collection('materiais').delete(id)
      return true
    } catch (error) {
      console.error('Erro ao deletar material:', error)
      return false
    }
  }
}

// API para Fornecedores
export const fornecedoresAPI = {
  getAll: async (): Promise<FornecedorRecord[]> => {
    try {
      const records = await pb.collection('fornecedores').getFullList<FornecedorRecord>()
      return records
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error)
      return []
    }
  },
  
  getById: async (id: string): Promise<FornecedorRecord | null> => {
    try {
      const record = await pb.collection('fornecedores').getOne<FornecedorRecord>(id)
      return record
    } catch (error) {
      console.error('Erro ao buscar fornecedor:', error)
      return null
    }
  },
  
  create: async (data: Omit<FornecedorRecord, 'id' | 'created' | 'updated'>): Promise<FornecedorRecord | null> => {
    try {
      const record = await pb.collection('fornecedores').create<FornecedorRecord>(data)
      return record
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error)
      return null
    }
  },
  
  update: async (id: string, data: Partial<FornecedorRecord>): Promise<FornecedorRecord | null> => {
    try {
      const record = await pb.collection('fornecedores').update<FornecedorRecord>(id, data)
      return record
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error)
      return null
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      await pb.collection('fornecedores').delete(id)
      return true
    } catch (error) {
      console.error('Erro ao deletar fornecedor:', error)
      return false
    }
  }
}

// API para Não Conformidades
export const naoConformidadesAPI = {
  getAll: async (): Promise<NaoConformidadeRecord[]> => {
    try {
      const records = await pb.collection('nao_conformidades').getFullList<NaoConformidadeRecord>()
      return records
    } catch (error) {
      console.error('Erro ao buscar não conformidades:', error)
      return []
    }
  },
  
  getById: async (id: string): Promise<NaoConformidadeRecord | null> => {
    try {
      const record = await pb.collection('nao_conformidades').getOne<NaoConformidadeRecord>(id)
      return record
    } catch (error) {
      console.error('Erro ao buscar não conformidade:', error)
      return null
    }
  },
  
  create: async (data: Omit<NaoConformidadeRecord, 'id' | 'created' | 'updated'>): Promise<NaoConformidadeRecord | null> => {
    try {
      const record = await pb.collection('nao_conformidades').create<NaoConformidadeRecord>(data)
      return record
    } catch (error) {
      console.error('Erro ao criar não conformidade:', error)
      return null
    }
  },
  
  update: async (id: string, data: Partial<NaoConformidadeRecord>): Promise<NaoConformidadeRecord | null> => {
    try {
      const record = await pb.collection('nao_conformidades').update<NaoConformidadeRecord>(id, data)
      return record
    } catch (error) {
      console.error('Erro ao atualizar não conformidade:', error)
      return null
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      await pb.collection('nao_conformidades').delete(id)
      return true
    } catch (error) {
      console.error('Erro ao deletar não conformidade:', error)
      return false
    }
  }
}

// Upload de ficheiros
export const uploadFile = async (file: File, collection: string, recordId: string): Promise<string | null> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const record = await pb.collection(collection).update(recordId, formData)
    return record.id
  } catch (error) {
    console.error('Erro ao fazer upload:', error)
    return null
  }
}

// Função para inicializar dados de exemplo
export const initializeSampleData = async () => {
  try {
    // Verificar se já existem dados
    const documentos = await documentosAPI.getAll()
    if (documentos.length > 0) return // Já tem dados
    
    // Criar fornecedores primeiro
    const fornecedor1 = await fornecedoresAPI.create({
      nome: 'Cimentos de Portugal',
      nif: '500123456',
      morada: 'Rua das Indústrias, 123, Lisboa',
      telefone: '213456789',
      email: 'contacto@cimpor.pt',
      contacto: 'Eng. António Costa',
      estado: 'ativo'
    })
    
    // Criar materiais
    const material1 = await materiaisAPI.create({
      codigo: 'MAT-001',
      nome: 'Cimento CEM I 42.5R',
      tipo: 'cimento',
      fornecedor_id: fornecedor1?.id || '',
      certificado_id: 'CERT-001',
      data_rececao: '2024-01-10',
      quantidade: 50,
      unidade: 'toneladas',
      lote: 'LOT-2024-001',
      responsavel: 'João Silva',
      zona: 'Armazém Central',
      estado: 'aprovado',
      observacoes: 'Material conforme especificações'
    })
    
    // Criar documentos
    await documentosAPI.create({
      codigo: 'DOC-001',
      tipo: 'projeto',
      versao: '1.0',
      data_validade: '2024-12-31',
      fornecedor_id: fornecedor1?.id,
      responsavel: 'João Silva',
      zona: 'Zona A - Fundações',
      estado: 'aprovado',
      observacoes: 'Documento de projeto estrutural aprovado'
    })
    
    // Criar ensaios
    await ensaiosAPI.create({
      codigo: 'ENS-001',
      tipo: 'resistencia',
      material_id: material1?.id || '',
      resultado: 'Conforme',
      valor_obtido: 35.2,
      valor_esperado: 30.0,
      unidade: 'MPa',
      laboratorio: 'LabTec',
      data_ensaio: '2024-01-18',
      conforme: true,
      responsavel: 'João Silva',
      zona: 'Zona A - Fundações',
      estado: 'aprovado',
      observacoes: 'Ensaio de resistência à compressão'
    })
    
    console.log('Dados de exemplo criados com sucesso!')
  } catch (error) {
    console.error('Erro ao inicializar dados:', error)
  }
} 