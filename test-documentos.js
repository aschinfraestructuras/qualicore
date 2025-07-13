const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://mjgvjpqcdsmvervcxjig.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDocumentos() {
  console.log('🔍 Testando API de Documentos...')
  
  try {
    // 1. Verificar se há usuário autenticado
    console.log('\n1. Verificando autenticação...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('❌ Erro de autenticação:', authError.message)
      return
    }
    
    if (!user) {
      console.log('❌ Nenhum usuário autenticado')
      return
    }
    
    console.log('✅ Usuário autenticado:', user.email)
    
    // 2. Listar documentos existentes
    console.log('\n2. Listando documentos existentes...')
    const { data: documentos, error: listError } = await supabase
      .from('documentos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (listError) {
      console.log('❌ Erro ao listar documentos:', listError.message)
      return
    }
    
    console.log(`✅ Encontrados ${documentos.length} documentos`)
    documentos.forEach(doc => {
      console.log(`   - ${doc.codigo}: ${doc.tipo} (${doc.estado})`)
    })
    
    // 3. Criar um documento de teste
    console.log('\n3. Criando documento de teste...')
    const testDocument = {
      codigo: `TEST-${Date.now()}`,
      tipo: 'projeto',
      versao: '1.0',
      responsavel: 'Teste Automático',
      zona: 'Zona Teste',
      estado: 'pendente',
      user_id: user.id
    }
    
    const { data: newDoc, error: createError } = await supabase
      .from('documentos')
      .insert([testDocument])
      .select()
      .single()
    
    if (createError) {
      console.log('❌ Erro ao criar documento:', createError.message)
      console.log('Detalhes do erro:', createError)
      return
    }
    
    console.log('✅ Documento criado com sucesso:', newDoc.codigo)
    
    // 4. Verificar se o documento aparece na lista
    console.log('\n4. Verificando se o documento aparece na lista...')
    const { data: updatedList, error: updatedListError } = await supabase
      .from('documentos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (updatedListError) {
      console.log('❌ Erro ao listar documentos atualizados:', updatedListError.message)
      return
    }
    
    console.log(`✅ Lista atualizada: ${updatedList.length} documentos`)
    const foundDoc = updatedList.find(doc => doc.codigo === newDoc.codigo)
    
    if (foundDoc) {
      console.log('✅ Documento encontrado na lista atualizada')
    } else {
      console.log('❌ Documento NÃO encontrado na lista atualizada')
    }
    
    // 5. Limpar documento de teste
    console.log('\n5. Removendo documento de teste...')
    const { error: deleteError } = await supabase
      .from('documentos')
      .delete()
      .eq('id', newDoc.id)
    
    if (deleteError) {
      console.log('❌ Erro ao remover documento de teste:', deleteError.message)
    } else {
      console.log('✅ Documento de teste removido')
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message)
  }
}

testDocumentos() 