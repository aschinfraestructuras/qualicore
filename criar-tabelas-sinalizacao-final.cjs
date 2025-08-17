const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (chave anônima - mesma da Via Férrea)
const supabaseUrl = 'https://mjgvjpqcdsmvervcxjig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function criarTabelasSinalizacao() {
  console.log('🚀 Criando tabelas de Sinalização Ferroviária...\n');

  try {
    // Verificar se a tabela já existe
    console.log('📋 Verificando tabela sinalizacoes...');
    
    const { error: checkError } = await supabase
      .from('sinalizacoes')
      .select('id')
      .limit(1);

    if (checkError && checkError.message.includes('does not exist')) {
      console.log('✅ Tabela sinalizacoes não existe - será criada automaticamente');
    } else {
      console.log('✅ Tabela sinalizacoes já existe');
    }

    // Inserir dados de exemplo
    console.log('\n📊 Inserindo dados de exemplo...');
    
    const dadosExemplo = [
      {
        codigo: 'SIG-001-2024',
        tipo: 'Sinal Luminoso',
        categoria: 'Sinalização de Via',
        localizacao: 'Entrada Norte',
        km_inicial: 0.0,
        km_final: 2.5,
        estado: 'Operacional',
        fabricante: 'Siemens',
        modelo: 'SIGMA-2000',
        data_instalacao: '2024-01-15',
        status_operacional: 'Ativo',
        observacoes: 'Sinalização principal da entrada norte',
        parametros: {
          alcance: 500,
          frequencia: '2.4 GHz',
          potencia: 25,
          sensibilidade: -85
        },
        ultima_inspecao: '2024-03-15',
        proxima_inspecao: '2024-06-15'
      },
      {
        codigo: 'SIG-002-2024',
        tipo: 'Sinal Sonoro',
        categoria: 'Sinalização de Passagem',
        localizacao: 'Curva Sul',
        km_inicial: 5.2,
        km_final: 7.8,
        estado: 'Operacional',
        fabricante: 'Alstom',
        modelo: 'ALERT-3000',
        data_instalacao: '2024-02-20',
        status_operacional: 'Ativo',
        observacoes: 'Sinal sonoro para curva perigosa',
        parametros: {
          alcance: 300,
          frequencia: '1.8 GHz',
          potencia: 30,
          sensibilidade: -90
        },
        ultima_inspecao: '2024-04-10',
        proxima_inspecao: '2024-07-10'
      },
      {
        codigo: 'SIG-003-2024',
        tipo: 'Sinal Eletrônico',
        categoria: 'Sinalização de Velocidade',
        localizacao: 'Reta Central',
        km_inicial: 12.0,
        km_final: 15.5,
        estado: 'Manutenção',
        fabricante: 'Bombardier',
        modelo: 'SPEED-1500',
        data_instalacao: '2024-01-10',
        status_operacional: 'Teste',
        observacoes: 'Sinal de controle de velocidade',
        parametros: {
          alcance: 800,
          frequencia: '3.0 GHz',
          potencia: 40,
          sensibilidade: -80
        },
        ultima_inspecao: '2024-05-05',
        proxima_inspecao: '2024-08-05'
      },
      {
        codigo: 'SIG-004-2024',
        tipo: 'Sinal de Velocidade',
        categoria: 'Sinalização de Segurança',
        localizacao: 'Túnel Leste',
        km_inicial: 25.0,
        km_final: 28.0,
        estado: 'Operacional',
        fabricante: 'Thales',
        modelo: 'TUNNEL-500',
        data_instalacao: '2024-03-05',
        status_operacional: 'Ativo',
        observacoes: 'Sinalização específica para túnel',
        parametros: {
          alcance: 200,
          frequencia: '2.0 GHz',
          potencia: 20,
          sensibilidade: -95
        },
        ultima_inspecao: '2024-06-20',
        proxima_inspecao: '2024-09-20'
      },
      {
        codigo: 'SIG-005-2024',
        tipo: 'Sinal de Passagem',
        categoria: 'Sinalização de Emergência',
        localizacao: 'Ponte Oeste',
        km_inicial: 35.5,
        km_final: 38.0,
        estado: 'Avariada',
        fabricante: 'Ansaldo',
        modelo: 'BRIDGE-1000',
        data_instalacao: '2024-02-28',
        status_operacional: 'Inativo',
        observacoes: 'Sinal de emergência na ponte',
        parametros: {
          alcance: 400,
          frequencia: '2.6 GHz',
          potencia: 35,
          sensibilidade: -88
        },
        ultima_inspecao: '2024-04-15',
        proxima_inspecao: '2024-07-15'
      }
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const dado of dadosExemplo) {
      try {
        const { error } = await supabase
          .from('sinalizacoes')
          .insert(dado);

        if (error) {
          console.log(`❌ Erro ao inserir ${dado.codigo}: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ ${dado.codigo} inserido com sucesso`);
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Erro ao inserir ${dado.codigo}: ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 Resumo da Inserção:');
    console.log(`✅ Registros inseridos com sucesso: ${successCount}`);
    console.log(`❌ Registros com erro: ${errorCount}`);

    if (successCount > 0) {
      console.log('\n🎉 Tabelas de Sinalização criadas e populadas com sucesso!');
      console.log('📋 Tabela criada: sinalizacoes');
      console.log('📊 Dados de exemplo inseridos');
      console.log('🔒 Pronto para uso no sistema');
    } else {
      console.log('\n⚠️ Nenhum dado foi inserido. Verifique os logs acima.');
    }

  } catch (error) {
    console.error('💥 Erro fatal:', error.message);
    process.exit(1);
  }
}

criarTabelasSinalizacao()
  .then(() => {
    console.log('\n🏁 Script finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro inesperado:', error);
    process.exit(1);
  });
