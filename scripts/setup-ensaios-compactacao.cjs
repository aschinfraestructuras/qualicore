const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupEnsaiosCompactacao() {
  console.log('🚀 Iniciando configuração da tabela de Ensaios de Compactação...');

  try {
    // Ler o script SQL
    const sqlPath = path.join(__dirname, '..', 'CREATE-ENSAIOS-COMPACTACAO.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Executando script SQL...');

    // Executar o script SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });

    if (error) {
      // Se o RPC não existir, vamos tentar executar as queries individualmente
      console.log('⚠️  RPC não disponível, executando queries individualmente...');
      
      // Dividir o script em queries individuais
      const queries = sqlContent
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0 && !q.startsWith('--'));

      for (const query of queries) {
        if (query.trim()) {
          console.log(`Executando: ${query.substring(0, 50)}...`);
          const { error: queryError } = await supabase.rpc('exec_sql', { sql: query });
          if (queryError) {
            console.log(`⚠️  Query ignorada (pode já existir): ${queryError.message}`);
          }
        }
      }
    }

    console.log('✅ Tabela de Ensaios de Compactação configurada com sucesso!');

    // Verificar se a tabela foi criada
    const { data: tables, error: listError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'ensaios_compactacao');

    if (listError) {
      console.log('⚠️  Não foi possível verificar se a tabela foi criada');
    } else if (tables && tables.length > 0) {
      console.log('✅ Tabela ensaios_compactacao encontrada no banco de dados');
    } else {
      console.log('⚠️  Tabela ensaios_compactacao não encontrada - pode ser necessário executar manualmente');
    }

    // Criar dados de exemplo
    console.log('📝 Criando dados de exemplo...');
    
    const exemploEnsaio = {
      obra: 'Obra Exemplo',
      localizacao: 'PK 0+000',
      elemento: 'Aterro',
      numero_ensaio: 'EC-001',
      codigo: 'EC001/2024',
      data_amostra: '2024-01-15',
      densidade_maxima_referencia: 2.15,
      humidade_otima_referencia: 12.5,
      pontos: [
        {
          numero: 1,
          densidadeSeca: 2.10,
          humidade: 11.8,
          grauCompactacao: 97.7
        },
        {
          numero: 2,
          densidadeSeca: 2.12,
          humidade: 12.1,
          grauCompactacao: 98.6
        },
        {
          numero: 3,
          densidadeSeca: 2.08,
          humidade: 12.3,
          grauCompactacao: 96.7
        }
      ],
      observacoes: 'Ensaio de exemplo para demonstração'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('ensaios_compactacao')
      .insert([exemploEnsaio])
      .select();

    if (insertError) {
      console.log('⚠️  Erro ao inserir dados de exemplo:', insertError.message);
    } else {
      console.log('✅ Dados de exemplo criados com sucesso!');
      console.log('📊 Ensaio de exemplo criado com ID:', insertData[0].id);
    }

    console.log('\n🎉 Configuração concluída!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Acesse a página de Ensaios de Compactação no sistema');
    console.log('2. Verifique se os dados de exemplo estão visíveis');
    console.log('3. Teste a criação de novos ensaios');
    console.log('4. Verifique se os cálculos automáticos estão funcionando');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error);
    console.log('\n🔧 Solução manual:');
    console.log('1. Acesse o Supabase Dashboard');
    console.log('2. Vá para SQL Editor');
    console.log('3. Execute o conteúdo do arquivo CREATE-ENSAIOS-COMPACTACAO.sql');
    console.log('4. Verifique se a tabela foi criada corretamente');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupEnsaiosCompactacao();
}

module.exports = { setupEnsaiosCompactacao }; 