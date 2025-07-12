// Script para criar as coleções do Qualicore no PocketBase
// Uso: node scripts/setup-pocketbase.js

const PocketBase = require('pocketbase/cjs')

const PB_URL = 'http://127.0.0.1:8090'
const ADMIN_EMAIL = 'sitecore.quality@gmail.com'
const ADMIN_PASSWORD = 'Hercules2.1'

const collections = [
  {
    name: 'documentos',
    type: 'base',
    schema: [
      { name: 'codigo', type: 'text', required: true },
      { name: 'tipo', type: 'select', required: true, options: { values: ['projeto','especificacao','relatorio','certificado','outro'] } },
      { name: 'versao', type: 'text', required: true },
      { name: 'data_validade', type: 'date' },
      { name: 'fornecedor_id', type: 'relation', options: { collectionId: null, collectionName: 'fornecedores' } },
      { name: 'responsavel', type: 'text', required: true },
      { name: 'zona', type: 'text', required: true },
      { name: 'estado', type: 'select', required: true, options: { values: ['pendente','em_analise','aprovado','reprovado','concluido'] } },
      { name: 'observacoes', type: 'text' },
      { name: 'anexos', type: 'file', options: { maxSelect: 10 } },
    ]
  },
  {
    name: 'ensaios',
    type: 'base',
    schema: [
      { name: 'codigo', type: 'text', required: true },
      { name: 'tipo', type: 'select', required: true, options: { values: ['resistencia','densidade','absorcao','durabilidade','outro'] } },
      { name: 'material_id', type: 'relation', options: { collectionId: null, collectionName: 'materiais' } },
      { name: 'resultado', type: 'text', required: true },
      { name: 'valor_obtido', type: 'number', required: true },
      { name: 'valor_esperado', type: 'number', required: true },
      { name: 'unidade', type: 'text', required: true },
      { name: 'laboratorio', type: 'text', required: true },
      { name: 'data_ensaio', type: 'date', required: true },
      { name: 'conforme', type: 'bool', required: true },
      { name: 'responsavel', type: 'text', required: true },
      { name: 'zona', type: 'text', required: true },
      { name: 'estado', type: 'select', required: true, options: { values: ['pendente','em_analise','aprovado','reprovado','concluido'] } },
      { name: 'observacoes', type: 'text' },
      { name: 'anexos', type: 'file', options: { maxSelect: 10 } },
    ]
  },
  {
    name: 'checklists',
    type: 'base',
    schema: [
      { name: 'codigo', type: 'text', required: true },
      { name: 'tipo', type: 'select', required: true, options: { values: ['inspecao','verificacao','aceitacao','outro'] } },
      { name: 'itens', type: 'json' },
      { name: 'percentual_conformidade', type: 'number', required: true },
      { name: 'data_inspecao', type: 'date', required: true },
      { name: 'inspetor', type: 'text', required: true },
      { name: 'responsavel', type: 'text', required: true },
      { name: 'zona', type: 'text', required: true },
      { name: 'estado', type: 'select', required: true, options: { values: ['pendente','em_analise','aprovado','reprovado','concluido'] } },
      { name: 'observacoes', type: 'text' },
      { name: 'anexos', type: 'file', options: { maxSelect: 10 } },
    ]
  },
  {
    name: 'materiais',
    type: 'base',
    schema: [
      { name: 'codigo', type: 'text', required: true },
      { name: 'nome', type: 'text', required: true },
      { name: 'tipo', type: 'select', required: true, options: { values: ['betao','aco','agregado','cimento','outro'] } },
      { name: 'fornecedor_id', type: 'relation', options: { collectionId: null, collectionName: 'fornecedores' } },
      { name: 'certificado_id', type: 'text' },
      { name: 'data_rececao', type: 'date', required: true },
      { name: 'quantidade', type: 'number', required: true },
      { name: 'unidade', type: 'text', required: true },
      { name: 'lote', type: 'text', required: true },
      { name: 'responsavel', type: 'text', required: true },
      { name: 'zona', type: 'text', required: true },
      { name: 'estado', type: 'select', required: true, options: { values: ['pendente','em_analise','aprovado','reprovado','concluido'] } },
      { name: 'observacoes', type: 'text' },
      { name: 'anexos', type: 'file', options: { maxSelect: 10 } },
    ]
  },
  {
    name: 'fornecedores',
    type: 'base',
    schema: [
      { name: 'nome', type: 'text', required: true },
      { name: 'nif', type: 'text', required: true },
      { name: 'morada', type: 'text', required: true },
      { name: 'telefone', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'contacto', type: 'text', required: true },
      { name: 'estado', type: 'select', required: true, options: { values: ['ativo','inativo'] } },
    ]
  },
  {
    name: 'nao_conformidades',
    type: 'base',
    schema: [
      { name: 'codigo', type: 'text', required: true },
      { name: 'tipo', type: 'select', required: true, options: { values: ['material','execucao','documentacao','seguranca','outro'] } },
      { name: 'severidade', type: 'select', required: true, options: { values: ['baixa','media','alta','critica'] } },
      { name: 'data_deteccao', type: 'date', required: true },
      { name: 'data_resolucao', type: 'date' },
      { name: 'acao_corretiva', type: 'text' },
      { name: 'responsavel_resolucao', type: 'text' },
      { name: 'custo_estimado', type: 'number' },
      { name: 'relacionado_ensaio_id', type: 'relation', options: { collectionId: null, collectionName: 'ensaios' } },
      { name: 'relacionado_material_id', type: 'relation', options: { collectionId: null, collectionName: 'materiais' } },
      { name: 'responsavel', type: 'text', required: true },
      { name: 'zona', type: 'text', required: true },
      { name: 'estado', type: 'select', required: true, options: { values: ['pendente','em_analise','aprovado','reprovado','concluido'] } },
      { name: 'observacoes', type: 'text' },
      { name: 'anexos', type: 'file', options: { maxSelect: 10 } },
    ]
  }
]

async function main() {
  const pb = new PocketBase(PB_URL)
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
  console.log('✅ Login efetuado com sucesso!')

  for (const col of collections) {
    // Verifica se já existe
    const exists = (await pb.collections.getFullList()).find(c => c.name === col.name)
    if (exists) {
      console.log(`Coleção '${col.name}' já existe, pulando...`)
      continue
    }
    // Cria coleção
    await pb.collections.create({
      name: col.name,
      type: col.type,
      schema: col.schema
    })
    console.log(`Coleção '${col.name}' criada!`)
  }
  console.log('✅ Todas as coleções criadas!')
}

main().catch(e => {
  console.error('Erro:', e)
  process.exit(1)
}) 