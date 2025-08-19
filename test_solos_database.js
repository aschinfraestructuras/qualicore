const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSolosDatabase() {
  console.log('🔍 Testando conexão com a base de dados de solos...\n');

  try {
    // 1. Testar conexão básica
    console.log('1. Testando conexão básica...');
    const { data: testData, error: testError } = await supabase
      .from('caracterizacoes_solos')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erro na conexão:', testError);
      return;
    }
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // 2. Verificar estrutura da tabela
    console.log('2. Verificando estrutura da tabela...');
    const { data: structure, error: structureError } = await supabase
      .from('caracterizacoes_solos')
      .select('*')
      .limit(1);
    
    if (structureError) {
      console.error('❌ Erro ao verificar estrutura:', structureError);
      return;
    }
    
    if (structure && structure.length > 0) {
      console.log('✅ Tabela tem estrutura válida');
      console.log('📋 Campos disponíveis:', Object.keys(structure[0]));
    } else {
      console.log('⚠️  Tabela está vazia');
    }
    console.log('');

    // 3. Contar registos
    console.log('3. Contando registos...');
    const { count, error: countError } = await supabase
      .from('caracterizacoes_solos')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Erro ao contar registos:', countError);
      return;
    }
    
    console.log(`📊 Total de registos: ${count}\n`);

    // 4. Verificar dados de exemplo
    if (count > 0) {
      console.log('4. Verificando dados de exemplo...');
      const { data: sampleData, error: sampleError } = await supabase
        .from('caracterizacoes_solos')
        .select('id, codigo, obra, classificacao, conforme')
        .limit(3);
      
      if (sampleError) {
        console.error('❌ Erro ao buscar dados de exemplo:', sampleError);
        return;
      }
      
      console.log('📋 Dados de exemplo:');
      sampleData.forEach((item, index) => {
        console.log(`   ${index + 1}. ID: ${item.id}`);
        console.log(`      Código: ${item.codigo}`);
        console.log(`      Obra: ${item.obra}`);
        console.log(`      Classificação: ${JSON.stringify(item.classificacao)}`);
        console.log(`      Conforme: ${item.conforme}`);
        console.log('');
      });
    }

    // 5. Testar filtros
    console.log('5. Testando filtros...');
    const { data: filteredData, error: filterError } = await supabase
      .from('caracterizacoes_solos')
      .select('id, codigo, conforme')
      .eq('conforme', true)
      .limit(5);
    
    if (filterError) {
      console.error('❌ Erro ao testar filtros:', filterError);
      return;
    }
    
    console.log(`✅ Filtros funcionando - ${filteredData.length} registos conformes encontrados\n`);

    console.log('🎉 Teste concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar o teste
testSolosDatabase();
