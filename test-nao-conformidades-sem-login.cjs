const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEstruturaTabela() {
  console.log('🧪 Testando Estrutura da Tabela Não Conformidades...\n');

  try {
    // 1. Verificar estrutura da tabela
    console.log('1️⃣ Verificando estrutura da tabela...');
    
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'nao_conformidades')
      .eq('table_schema', 'public')
      .order('ordinal_position');

    if (columnsError) {
      console.error('❌ Erro ao verificar estrutura:', columnsError);
      return;
    }

    console.log(`📋 Tabela tem ${columns.length} colunas:`);
    
    // Verificar se os campos de anexos existem
    const camposAnexos = ['anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'timeline'];
    const camposEncontrados = [];
    
    columns.forEach(col => {
      if (camposAnexos.includes(col.column_name)) {
        camposEncontrados.push(col.column_name);
        console.log(`   ✅ ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
      }
    });

    console.log('\n📊 Resumo dos campos de anexos:');
    camposAnexos.forEach(campo => {
      if (camposEncontrados.includes(campo)) {
        console.log(`   ✅ ${campo} - EXISTE`);
      } else {
        console.log(`   ❌ ${campo} - NÃO EXISTE`);
      }
    });

    // 2. Verificar se a tabela tem dados
    console.log('\n2️⃣ Verificando se a tabela tem dados...');
    
    const { count, error: countError } = await supabase
      .from('nao_conformidades')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Erro ao contar registros:', countError);
    } else {
      console.log(`📊 Total de registros na tabela: ${count}`);
    }

    // 3. Verificar políticas RLS
    console.log('\n3️⃣ Verificando políticas RLS...');
    
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('policyname, cmd')
      .eq('tablename', 'nao_conformidades');

    if (policiesError) {
      console.error('❌ Erro ao verificar políticas:', policiesError);
    } else {
      console.log(`📋 Políticas RLS encontradas: ${policies.length}`);
      policies.forEach(policy => {
        console.log(`   - ${policy.policyname}: ${policy.cmd}`);
      });
    }

    console.log('\n🎉 Verificação concluída!');
    console.log('\n📝 PRÓXIMOS PASSOS:');
    console.log('1. Teste no frontend criando uma nova Não Conformidade');
    console.log('2. Verifique se os anexos são salvos corretamente');
    console.log('3. Teste editar uma NC existente');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testEstruturaTabela(); 