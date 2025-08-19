import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testando conexão com Supabase...');
    
    // Testar se as tabelas existem
    const { data: tables, error: tablesError } = await supabase
      .from('equipamentos')
      .select('count')
      .limit(1);
    
    if (tablesError) {
      console.error('Erro ao acessar tabela equipamentos:', tablesError);
      return;
    }
    
    console.log('✅ Conexão com equipamentos OK');
    
    // Testar a função de estatísticas
    const { data: stats, error: statsError } = await supabase
      .rpc('get_calibracoes_stats');
    
    if (statsError) {
      console.error('❌ Erro ao executar função get_calibracoes_stats:', statsError);
      return;
    }
    
    console.log('✅ Função get_calibracoes_stats executada com sucesso');
    console.log('📊 Dados retornados:', JSON.stringify(stats, null, 2));
    
    // Verificar valores específicos
    if (stats) {
      console.log('💰 Valor total equipamentos:', stats.valor_total_equipamentos);
      console.log('📈 Total equipamentos:', stats.total_equipamentos);
      console.log('✅ Equipamentos ativos:', stats.equipamentos_ativos);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testConnection();
