const PocketBase = require('pocketbase')

// Configuração para PocketBase online
const POCKETBASE_URL = 'https://qualicore-pocketbase.onrender.com'
const ADMIN_EMAIL = 'admin@qualicore.pt'
const ADMIN_PASSWORD = 'admin123456' // Mude esta password!

async function setupCollections() {
  const pb = new PocketBase(POCKETBASE_URL)
  
  try {
    console.log('🔐 A fazer login no PocketBase...')
    
    // Login como admin
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
    
    console.log('✅ Login bem-sucedido!')
    console.log('📝 A criar coleções...')
    
    // Criar coleção de utilizadores (se não existir)
    try {
      await pb.collections.create({
        name: 'users',
        type: 'auth',
        schema: [
          {
            name: 'nome',
            type: 'text',
            required: true
          },
          {
            name: 'perfil',
            type: 'select',
            options: {
              values: ['qualidade', 'producao', 'fiscal']
            },
            required: true
          }
        ]
      })
      console.log('✅ Coleção "users" criada')
    } catch (error) {
      console.log('ℹ️ Coleção "users" já existe')
    }
    
    // Criar coleção de ensaios
    try {
      await pb.collections.create({
        name: 'ensaios',
        type: 'base',
        schema: [
          { name: 'codigo', type: 'text', required: true },
          { name: 'tipo', type: 'text', required: true },
          { name: 'material_id', type: 'relation', options: { collectionId: 'materiais' } },
          { name: 'resultado', type: 'text', required: true },
          { name: 'valor_obtido', type: 'number' },
          { name: 'valor_esperado', type: 'number' },
          { name: 'unidade', type: 'text' },
          { name: 'laboratorio', type: 'text' },
          { name: 'data_ensaio', type: 'date' },
          { name: 'conforme', type: 'bool' },
          { name: 'responsavel', type: 'text' },
          { name: 'zona', type: 'text' },
          { name: 'estado', type: 'select', options: { values: ['pendente', 'aprovado', 'reprovado'] } },
          { name: 'observacoes', type: 'editor' }
        ]
      })
      console.log('✅ Coleção "ensaios" criada')
    } catch (error) {
      console.log('ℹ️ Coleção "ensaios" já existe')
    }
    
    // Criar coleção de documentos
    try {
      await pb.collections.create({
        name: 'documentos',
        type: 'base',
        schema: [
          { name: 'titulo', type: 'text', required: true },
          { name: 'tipo', type: 'select', options: { values: ['projeto', 'especificacao', 'relatorio', 'outro'] } },
          { name: 'numero', type: 'text' },
          { name: 'versao', type: 'text' },
          { name: 'data_criacao', type: 'date' },
          { name: 'data_revisao', type: 'date' },
          { name: 'responsavel', type: 'text' },
          { name: 'estado', type: 'select', options: { values: ['rascunho', 'revisao', 'aprovado', 'obsoleto'] } },
          { name: 'descricao', type: 'editor' },
          { name: 'anexos', type: 'file', options: { maxSelect: 10 } }
        ]
      })
      console.log('✅ Coleção "documentos" criada')
    } catch (error) {
      console.log('ℹ️ Coleção "documentos" já existe')
    }
    
    // Criar coleção de RFIs
    try {
      await pb.collections.create({
        name: 'rfis',
        type: 'base',
        schema: [
          { name: 'numero', type: 'text', required: true },
          { name: 'titulo', type: 'text', required: true },
          { name: 'descricao', type: 'editor', required: true },
          { name: 'solicitante', type: 'text', required: true },
          { name: 'prioridade', type: 'select', options: { values: ['baixa', 'media', 'alta', 'urgente'] } },
          { name: 'estado', type: 'select', options: { values: ['pendente', 'em_analise', 'respondido', 'fechado'] } },
          { name: 'impacto_custo', type: 'select', options: { values: ['nenhum', 'baixo', 'medio', 'alto'] } },
          { name: 'impacto_prazo', type: 'select', options: { values: ['nenhum', 'baixo', 'medio', 'alto'] } },
          { name: 'data_limite', type: 'date' },
          { name: 'resposta', type: 'editor' },
          { name: 'anexos', type: 'file', options: { maxSelect: 5 } }
        ]
      })
      console.log('✅ Coleção "rfis" criada')
    } catch (error) {
      console.log('ℹ️ Coleção "rfis" já existe')
    }
    
    // Criar outras coleções...
    const outrasColecoes = [
      { name: 'checklists', schema: [
        { name: 'titulo', type: 'text', required: true },
        { name: 'tipo', type: 'select', options: { values: ['seguranca', 'qualidade', 'producao'] } },
        { name: 'itens', type: 'json' },
        { name: 'estado', type: 'select', options: { values: ['pendente', 'em_progresso', 'concluido'] } }
      ]},
      { name: 'materiais', schema: [
        { name: 'nome', type: 'text', required: true },
        { name: 'tipo', type: 'text' },
        { name: 'especificacoes', type: 'editor' },
        { name: 'fornecedor_id', type: 'relation', options: { collectionId: 'fornecedores' } }
      ]},
      { name: 'fornecedores', schema: [
        { name: 'nome', type: 'text', required: true },
        { name: 'contacto', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'telefone', type: 'text' }
      ]},
      { name: 'nao_conformidades', schema: [
        { name: 'titulo', type: 'text', required: true },
        { name: 'descricao', type: 'editor', required: true },
        { name: 'gravidade', type: 'select', options: { values: ['baixa', 'media', 'alta', 'critica'] } },
        { name: 'estado', type: 'select', options: { values: ['aberta', 'em_analise', 'resolvida', 'fechada'] } },
        { name: 'acoes_corretivas', type: 'editor' }
      ]}
    ]
    
    for (const colecao of outrasColecoes) {
      try {
        await pb.collections.create({
          name: colecao.name,
          type: 'base',
          schema: colecao.schema
        })
        console.log(`✅ Coleção "${colecao.name}" criada`)
      } catch (error) {
        console.log(`ℹ️ Coleção "${colecao.name}" já existe`)
      }
    }
    
    console.log('🎉 Setup concluído com sucesso!')
    console.log(`📊 Aceda ao admin: ${POCKETBASE_URL}/_/`)
    
  } catch (error) {
    console.error('❌ Erro no setup:', error)
    process.exit(1)
  }
}

setupCollections() 