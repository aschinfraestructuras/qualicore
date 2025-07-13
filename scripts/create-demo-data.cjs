const PocketBase = require('pocketbase').default

const POCKETBASE_URL = 'https://qualicore-pocketbase.onrender.com'
const ADMIN_EMAIL = 'sitecore.quality@gmail.com'
const ADMIN_PASSWORD = 'Hercules2.1'

const demoData = {
  fornecedores: [
    { nome: 'Fornecedor Demo', contacto: 'João Fornecedor', email: 'fornecedor@demo.pt', telefone: '912345678' }
  ],
  materiais: [
    { nome: 'Betão C25/30', tipo: 'Betão', especificacoes: 'Betão para fundações', fornecedor_id: null }
  ],
  ensaios: [
    { codigo: 'ENS-001', tipo: 'resistencia', resultado: 'Conforme', valor_obtido: 35.2, valor_esperado: 30.0, unidade: 'MPa', laboratorio: 'LabTec', data_ensaio: '2024-01-18', conforme: true, responsavel: 'João Silva', zona: 'Zona A', estado: 'aprovado', observacoes: 'Ensaio de resistência à compressão' }
  ],
  documentos: [
    { titulo: 'Projeto Estrutural', tipo: 'projeto', numero: 'DOC-001', versao: '1.0', data_criacao: '2024-01-01', responsavel: 'Eng. Silva', estado: 'aprovado', descricao: 'Projeto estrutural do edifício.' }
  ],
  rfis: [
    { numero: 'RFI-001', titulo: 'Dúvida sobre fundações', descricao: 'Qual a profundidade das sapatas?', solicitante: 'Eng. João', prioridade: 'media', estado: 'pendente', impacto_custo: 'baixo', impacto_prazo: 'nenhum' }
  ],
  checklists: [
    { titulo: 'Checklist de Segurança', tipo: 'seguranca', itens: [{ item: 'Capacete', ok: true }], estado: 'pendente' }
  ],
  nao_conformidades: [
    { titulo: 'NC Demo', descricao: 'Fissura na viga', gravidade: 'media', estado: 'aberta', acoes_corretivas: 'Reparar viga' }
  ]
}

async function createDemoData() {
  const pb = new PocketBase(POCKETBASE_URL)
  try {
    console.log('🔐 A fazer login como admin...')
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
    console.log('✅ Login bem-sucedido!')

    // Criar fornecedores primeiro e guardar o id para materiais
    let fornecedorId = null
    for (const fornecedor of demoData.fornecedores) {
      try {
        const created = await pb.collection('fornecedores').create(fornecedor)
        fornecedorId = created.id
        console.log('✅ Fornecedor demo criado!')
      } catch (error) {
        console.log('ℹ️ Fornecedor demo já existe ou erro:', error.message)
      }
    }

    // Criar materiais (com fornecedor_id se existir)
    for (const material of demoData.materiais) {
      if (fornecedorId) material.fornecedor_id = fornecedorId
      try {
        await pb.collection('materiais').create(material)
        console.log('✅ Material demo criado!')
      } catch (error) {
        console.log('ℹ️ Material demo já existe ou erro:', error.message)
      }
    }

    // Criar restantes coleções
    for (const [colecao, registos] of Object.entries(demoData)) {
      if (colecao === 'fornecedores' || colecao === 'materiais') continue
      for (const registo of registos) {
        try {
          await pb.collection(colecao).create(registo)
          console.log(`✅ Registo demo criado em ${colecao}!`)
        } catch (error) {
          console.log(`ℹ️ Registo demo já existe ou erro em ${colecao}:`, error.message)
        }
      }
    }
    console.log('🎉 Dados demo criados em todas as coleções!')
  } catch (error) {
    console.error('❌ Erro ao criar dados demo:', error)
  }
}

createDemoData() 