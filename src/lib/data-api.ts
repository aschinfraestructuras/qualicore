// API simples que funciona com localStorage para testes imediatos

export interface Ensaio {
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
  created: string
  updated: string
}

const STORAGE_KEY = 'qualicore_ensaios'

// Dados iniciais
const initialEnsaios: Ensaio[] = [
  {
    id: '1',
    codigo: 'ENS-001',
    tipo: 'resistencia',
    material_id: '1',
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
    observacoes: 'Ensaio de resistência à compressão',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  }
]

// Funções de armazenamento
const getEnsaios = (): Ensaio[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    // Inicializar com dados padrão
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEnsaios))
    return initialEnsaios
  } catch (error) {
    console.error('Erro ao carregar ensaios:', error)
    return initialEnsaios
  }
}

const saveEnsaios = (ensaios: Ensaio[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ensaios))
  } catch (error) {
    console.error('Erro ao salvar ensaios:', error)
  }
}

// API para ensaios
export const ensaiosAPI = {
  getAll: async (): Promise<Ensaio[]> => {
    return getEnsaios()
  },
  
  getById: async (id: string): Promise<Ensaio | null> => {
    const ensaios = getEnsaios()
    return ensaios.find(e => e.id === id) || null
  },
  
  create: async (data: Omit<Ensaio, 'id' | 'created' | 'updated'>): Promise<Ensaio | null> => {
    const ensaios = getEnsaios()
    const newEnsaio: Ensaio = {
      ...data,
      id: Date.now().toString(),
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
    
    ensaios.push(newEnsaio)
    saveEnsaios(ensaios)
    return newEnsaio
  },
  
  update: async (id: string, data: Partial<Ensaio>): Promise<Ensaio | null> => {
    const ensaios = getEnsaios()
    const index = ensaios.findIndex(e => e.id === id)
    
    if (index === -1) return null
    
    ensaios[index] = {
      ...ensaios[index],
      ...data,
      updated: new Date().toISOString()
    }
    
    saveEnsaios(ensaios)
    return ensaios[index]
  },
  
  delete: async (id: string): Promise<boolean> => {
    const ensaios = getEnsaios()
    const filtered = ensaios.filter(e => e.id !== id)
    
    if (filtered.length === ensaios.length) return false
    
    saveEnsaios(filtered)
    return true
  }
}

// API para documentos (similar)
export interface Documento {
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
  created: string
  updated: string
}

const DOCS_STORAGE_KEY = 'qualicore_documentos'

const initialDocumentos: Documento[] = [
  {
    id: '1',
    codigo: 'DOC-001',
    tipo: 'projeto',
    versao: '1.0',
    data_validade: '2024-12-31',
    fornecedor_id: '1',
    responsavel: 'João Silva',
    zona: 'Zona A - Fundações',
    estado: 'aprovado',
    observacoes: 'Documento de projeto estrutural aprovado',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  }
]

const getDocumentos = (): Documento[] => {
  try {
    const stored = localStorage.getItem(DOCS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(initialDocumentos))
    return initialDocumentos
  } catch (error) {
    console.error('Erro ao carregar documentos:', error)
    return initialDocumentos
  }
}

const saveDocumentos = (documentos: Documento[]): void => {
  try {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(documentos))
  } catch (error) {
    console.error('Erro ao salvar documentos:', error)
  }
}

export const documentosAPI = {
  getAll: async (): Promise<Documento[]> => {
    return getDocumentos()
  },
  
  getById: async (id: string): Promise<Documento | null> => {
    const documentos = getDocumentos()
    return documentos.find(d => d.id === id) || null
  },
  
  create: async (data: Omit<Documento, 'id' | 'created' | 'updated'>): Promise<Documento | null> => {
    const documentos = getDocumentos()
    const newDocumento: Documento = {
      ...data,
      id: Date.now().toString(),
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
    
    documentos.push(newDocumento)
    saveDocumentos(documentos)
    return newDocumento
  },
  
  update: async (id: string, data: Partial<Documento>): Promise<Documento | null> => {
    const documentos = getDocumentos()
    const index = documentos.findIndex(d => d.id === id)
    
    if (index === -1) return null
    
    documentos[index] = {
      ...documentos[index],
      ...data,
      updated: new Date().toISOString()
    }
    
    saveDocumentos(documentos)
    return documentos[index]
  },
  
  delete: async (id: string): Promise<boolean> => {
    const documentos = getDocumentos()
    const filtered = documentos.filter(d => d.id !== id)
    
    if (filtered.length === documentos.length) return false
    
    saveDocumentos(filtered)
    return true
  }
} 