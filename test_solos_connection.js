const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://mjgvjpqcdsmvervcxjig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSolosConnection() {
  console.log('🔍 Testando conexão com a tabela de solos...\n');

  try {
    // 1. Testar se a tabela existe
    console.log('1. Verificando se a tabela caracterizacoes_solos existe...');
    const { data, error } = await supabase
      .from('caracterizacoes_solos')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro ao aceder à tabela:', error.message);
      console.error('Código de erro:', error.code);
      console.error('Detalhes:', error.details);
      return;
    }
    
    console.log('✅ Tabela caracterizacoes_solos existe e é acessível!');
    console.log(`📊 Dados encontrados: ${data ? data.length : 0} registos\n`);

    // 2. Verificar estrutura
    if (data && data.length > 0) {
      console.log('2. Estrutura da tabela:');
      const firstRecord = data[0];
      console.log('Campos disponíveis:', Object.keys(firstRecord));
      console.log('');
      
      // 3. Verificar campo classificacao
      console.log('3. Verificando campo classificacao:');
      if (firstRecord.classificacao) {
        console.log('✅ Campo classificacao existe');
        console.log('Tipo:', typeof firstRecord.classificacao);
        console.log('Valor:', JSON.stringify(firstRecord.classificacao, null, 2));
      } else {
        console.log('⚠️  Campo classificacao não existe ou está vazio');
      }
      console.log('');
    } else {
      console.log('⚠️  Tabela está vazia - não há dados para verificar a estrutura');
    }

    // 4. Tentar inserir um registo de teste
    console.log('4. Testando inserção de um registo de teste...');
    const testData = {
      codigo: 'TESTE-001',
      obra: 'Obra de Teste',
      localizacao: 'Localização de Teste',
      data_colheita: '2024-01-15',
      data_rececao_laboratorio: '2024-01-16',
      data_resultados: '2024-01-20',
      laboratorio: 'Laboratório de Teste',
      responsavel_tecnico: 'Técnico de Teste',
      fiscal_obra: 'Fiscal de Teste',
      profundidade_colheita: 1.5,
      tipo_amostra: 'Disturbada',
      numero_amostra: 'AM-001',
      descricao_visual: 'Descrição de teste',
      conforme: false,
      classificacao: {
        sistema_unificado: 'CL',
        sistema_aashto: 'A-2-4',
        grupo_portugues: 'GP1',
        adequacao: 'MARGINAL'
      }
    };

    const { data: insertData, error: insertError } = await supabase
      .from('caracterizacoes_solos')
      .insert([testData])
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir registo de teste:', insertError.message);
      console.error('Código de erro:', insertError.code);
      console.error('Detalhes:', insertError.details);
    } else {
      console.log('✅ Registo de teste inserido com sucesso!');
      console.log('ID do registo:', insertData[0].id);
      
      // 5. Limpar o registo de teste
      console.log('5. Limpando registo de teste...');
      const { error: deleteError } = await supabase
        .from('caracterizacoes_solos')
        .delete()
        .eq('id', insertData[0].id);
      
      if (deleteError) {
        console.error('⚠️  Erro ao limpar registo de teste:', deleteError.message);
      } else {
        console.log('✅ Registo de teste removido com sucesso!');
      }
    }

    console.log('\n🎉 Teste concluído!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o teste
testSolosConnection();
