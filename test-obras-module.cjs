const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testObrasModule() {
  console.log('🔍 Testando módulo Obras...\n');

  try {
    // 1. Verificar se o usuário está autenticado
    console.log('1. Verificando autenticação...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('❌ Usuário não autenticado. Faça login primeiro.');
      console.log('   Execute: node test-auth.cjs');
      return;
    }
    
    console.log('✅ Usuário autenticado:', user.email);
    console.log('   User ID:', user.id);

    // 2. Verificar estrutura da tabela obras
    console.log('\n2. Verificando estrutura da tabela obras...');
    try {
      const { data: structure, error } = await supabase
        .from('obras')
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('❌ Erro ao verificar estrutura:', error.message);
        console.log('   Detalhes:', error.details);
        console.log('   Hint:', error.hint);
      } else {
        console.log('✅ Estrutura da tabela obras: OK');
        if (structure && structure.length > 0) {
          console.log('   Campos disponíveis:', Object.keys(structure[0]));
        }
      }
    } catch (err) {
      console.log('❌ Erro ao verificar estrutura:', err.message);
    }

    // 3. Testar inserção de obra
    console.log('\n3. Testando inserção de obra...');
    const testObra = {
      codigo: 'TEST-OBR-001',
      nome: 'Obra de Teste',
      cliente: 'Cliente Teste',
      localizacao: 'Localização Teste',
      data_inicio: '2024-01-01',
      data_fim_prevista: '2024-12-31',
      valor_contrato: 100000,
      valor_executado: 50000,
      percentual_execucao: 50,
      status: 'planeamento',
      tipo_obra: 'residencial',
      categoria: 'media',
      responsavel_tecnico: 'Responsável Teste',
      coordenador_obra: 'Coordenador Teste',
      fiscal_obra: 'Fiscal Teste',
      engenheiro_responsavel: 'Engenheiro Teste',
      arquiteto: 'Arquiteto Teste',
      fornecedores_principais: [],
      observacoes: 'Obra de teste para verificar funcionamento',
      user_id: user.id
    };

    const { data: insertedObra, error: insertError } = await supabase
      .from('obras')
      .insert([testObra])
      .select()
      .single();

    if (insertError) {
      console.log('❌ Erro ao inserir obra:', insertError.message);
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

    console.log('✅ Obra inserida com sucesso:', insertedObra.id);
    console.log('   Código:', insertedObra.codigo);
    console.log('   Nome:', insertedObra.nome);

    // 4. Testar leitura
    console.log('\n4. Testando leitura...');
    const { data: readObra, error: readError } = await supabase
      .from('obras')
      .select('*')
      .eq('id', insertedObra.id)
      .eq('user_id', user.id)
      .single();

    if (readError) {
      console.log('❌ Erro ao ler obra:', readError.message);
    } else {
      console.log('✅ Obra lida com sucesso:', readObra.nome);
    }

    // 5. Testar atualização
    console.log('\n5. Testando atualização...');
    const { data: updatedObra, error: updateError } = await supabase
      .from('obras')
      .update({ nome: 'Obra de Teste Atualizada' })
      .eq('id', insertedObra.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.log('❌ Erro ao atualizar obra:', updateError.message);
    } else {
      console.log('✅ Obra atualizada com sucesso:', updatedObra.nome);
    }

    // 6. Testar listagem
    console.log('\n6. Testando listagem...');
    const { data: allObras, error: listError } = await supabase
      .from('obras')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (listError) {
      console.log('❌ Erro ao listar obras:', listError.message);
    } else {
      console.log(`✅ Listagem bem-sucedida: ${allObras?.length || 0} obras encontradas`);
    }

    // 7. Limpar dados de teste
    console.log('\n7. Limpando dados de teste...');
    const { error: deleteError } = await supabase
      .from('obras')
      .delete()
      .eq('id', insertedObra.id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.log('❌ Erro ao deletar obra de teste:', deleteError.message);
    } else {
      console.log('✅ Dados de teste removidos');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o teste
testObrasModule().then(() => {
  console.log('\n🏁 Teste do módulo Obras concluído');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
}); 