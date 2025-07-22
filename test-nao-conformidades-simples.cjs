const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testNaoConformidadesSimples() {
  console.log('🧪 Teste Simples de Não Conformidades...\n');

  try {
    // 1. Fazer login
    console.log('1️⃣ Fazendo login...');
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@qualicore.com',
      password: 'admin123'
    });

    if (authError || !user) {
      console.error('❌ Erro no login:', authError?.message);
      return;
    }

    console.log('✅ Login realizado com sucesso');
    console.log('👤 User ID:', user.id);

    // 2. Verificar estrutura da tabela
    console.log('\n2️⃣ Verificando estrutura da tabela...');
    
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'nao_conformidades')
      .eq('table_schema', 'public')
      .order('ordinal_position');

    if (columnsError) {
      console.error('❌ Erro ao verificar estrutura:', columnsError);
    } else {
      console.log('📋 Colunas da tabela:');
      columns.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable})`);
      });
    }

    // 3. Tentar criar uma não conformidade simples
    console.log('\n3️⃣ Criando não conformidade simples...');
    
    const novaNC = {
      codigo: 'NC-SIMPLE-001',
      tipo: 'material',
      severidade: 'media',
      categoria: 'inspecao',
      data_deteccao: new Date().toISOString().split('T')[0],
      descricao: 'Teste simples de não conformidade',
      impacto: 'medio',
      area_afetada: 'Área de teste',
      responsavel_deteccao: 'Teste'
    };

    console.log('📤 Dados a enviar:', novaNC);

    const { data: ncCriada, error: createError } = await supabase
      .from('nao_conformidades')
      .insert([novaNC])
      .select()
      .single();

    if (createError) {
      console.error('❌ Erro ao criar não conformidade:', createError);
      console.error('🔍 Detalhes do erro:', {
        message: createError.message,
        details: createError.details,
        hint: createError.hint,
        code: createError.code
      });
      return;
    }

    console.log('✅ Não conformidade criada com sucesso!');
    console.log('🆔 ID:', ncCriada.id);
    console.log('📋 Código:', ncCriada.codigo);
    console.log('📝 Descrição:', ncCriada.descricao);

    // 4. Buscar a não conformidade criada
    console.log('\n4️⃣ Buscando não conformidade criada...');
    
    const { data: ncBuscada, error: getError } = await supabase
      .from('nao_conformidades')
      .select('*')
      .eq('id', ncCriada.id)
      .single();

    if (getError) {
      console.error('❌ Erro ao buscar não conformidade:', getError);
      return;
    }

    console.log('✅ Não conformidade encontrada');
    console.log('📋 Dados completos:', JSON.stringify(ncBuscada, null, 2));

    // 5. Listar todas as não conformidades
    console.log('\n5️⃣ Listando todas as não conformidades...');
    
    const { data: todasNCs, error: listError } = await supabase
      .from('nao_conformidades')
      .select('id, codigo, descricao, created_at')
      .order('created_at', { ascending: false });

    if (listError) {
      console.error('❌ Erro ao listar não conformidades:', listError);
      return;
    }

    console.log(`✅ Encontradas ${todasNCs.length} não conformidades`);
    todasNCs.forEach((nc, index) => {
      console.log(`   ${index + 1}. ${nc.codigo} - ${nc.descricao}`);
    });

    // 6. Limpar dados de teste
    console.log('\n6️⃣ Limpando dados de teste...');
    
    const { error: deleteError } = await supabase
      .from('nao_conformidades')
      .delete()
      .eq('codigo', 'NC-SIMPLE-001');

    if (deleteError) {
      console.error('❌ Erro ao limpar dados de teste:', deleteError);
    } else {
      console.log('✅ Dados de teste removidos');
    }

    console.log('\n🎉 Teste concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testNaoConformidadesSimples(); 