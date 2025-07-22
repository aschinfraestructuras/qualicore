const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testNaoConformidades() {
  console.log('🔍 Testando módulo Não Conformidades...\n');

  try {
    // 1. Verificar se o usuário está autenticado
    console.log('1. Verificando autenticação...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('❌ Usuário não autenticado. Faça login primeiro.');
      return;
    }
    
    console.log('✅ Usuário autenticado:', user.email);
    console.log('   User ID:', user.id);

    // 2. Verificar estrutura da tabela nao_conformidades
    console.log('\n2. Verificando estrutura da tabela nao_conformidades...');
    try {
      const { data: structure, error } = await supabase
        .from('nao_conformidades')
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('❌ Erro ao verificar estrutura:', error.message);
        console.log('   Detalhes:', error.details);
        console.log('   Hint:', error.hint);
      } else {
        console.log('✅ Estrutura da tabela nao_conformidades: OK');
        if (structure && structure.length > 0) {
          console.log('   Campos disponíveis:', Object.keys(structure[0]));
        }
      }
    } catch (err) {
      console.log('❌ Erro ao verificar estrutura:', err.message);
    }

    // 3. Testar inserção de não conformidade
    console.log('\n3. Testando inserção de não conformidade...');
    const testNC = {
      codigo: 'TEST-NC-001',
      tipo: 'material',
      severidade: 'media',
      categoria: 'inspecao',
      data_deteccao: '2024-01-01',
      descricao: 'Teste de não conformidade',
      impacto: 'medio',
      area_afetada: 'Área de teste',
      responsavel_deteccao: 'Responsável Teste',
      observacoes: 'Teste para verificar funcionamento',
      user_id: user.id
    };

    const { data: insertedNC, error: insertError } = await supabase
      .from('nao_conformidades')
      .insert([testNC])
      .select()
      .single();

    if (insertError) {
      console.log('❌ Erro ao inserir não conformidade:', insertError.message);
      console.log('   Detalhes:', insertError.details);
      console.log('   Hint:', insertError.hint);
      console.log('   Código:', insertError.code);
      
      // Verificar se é problema de RLS
      if (insertError.message.includes('permission') || insertError.message.includes('RLS')) {
        console.log('\n🔧 Possível problema de RLS detectado!');
        console.log('   Verifique se as políticas RLS estão configuradas corretamente.');
      }
      
      // Verificar se é problema de estrutura
      if (insertError.message.includes('column') || insertError.message.includes('field')) {
        console.log('\n🔧 Possível problema de estrutura detectado!');
        console.log('   Verifique se todos os campos obrigatórios estão presentes.');
      }
      
      return;
    }

    console.log('✅ Não conformidade inserida com sucesso:', insertedNC.id);
    console.log('   Código:', insertedNC.codigo);
    console.log('   Descrição:', insertedNC.descricao);

    // 4. Testar leitura
    console.log('\n4. Testando leitura...');
    const { data: readNC, error: readError } = await supabase
      .from('nao_conformidades')
      .select('*')
      .eq('id', insertedNC.id)
      .eq('user_id', user.id)
      .single();

    if (readError) {
      console.log('❌ Erro ao ler não conformidade:', readError.message);
    } else {
      console.log('✅ Não conformidade lida com sucesso:', readNC.descricao);
    }

    // 5. Testar atualização
    console.log('\n5. Testando atualização...');
    const { data: updatedNC, error: updateError } = await supabase
      .from('nao_conformidades')
      .update({ descricao: 'Não conformidade de teste atualizada' })
      .eq('id', insertedNC.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.log('❌ Erro ao atualizar não conformidade:', updateError.message);
    } else {
      console.log('✅ Não conformidade atualizada com sucesso:', updatedNC.descricao);
    }

    // 6. Testar listagem
    console.log('\n6. Testando listagem...');
    const { data: allNCs, error: listError } = await supabase
      .from('nao_conformidades')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (listError) {
      console.log('❌ Erro ao listar não conformidades:', listError.message);
    } else {
      console.log(`✅ Listagem bem-sucedida: ${allNCs?.length || 0} não conformidades encontradas`);
    }

    // 7. Limpar dados de teste
    console.log('\n7. Limpando dados de teste...');
    const { error: deleteError } = await supabase
      .from('nao_conformidades')
      .delete()
      .eq('id', insertedNC.id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.log('❌ Erro ao deletar não conformidade de teste:', deleteError.message);
    } else {
      console.log('✅ Dados de teste removidos');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o teste
testNaoConformidades().then(() => {
  console.log('\n🏁 Teste do módulo Não Conformidades concluído');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
}); 