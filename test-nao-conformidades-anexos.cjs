const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testNaoConformidadesAnexos() {
  console.log('🧪 Testando Não Conformidades com Anexos...\n');

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

    // 2. Criar uma não conformidade com anexos
    console.log('\n2️⃣ Criando não conformidade com anexos...');
    
    const novaNC = {
      codigo: 'NC-TEST-001',
      tipo: 'material',
      severidade: 'media',
      categoria: 'inspecao',
      data_deteccao: new Date().toISOString().split('T')[0],
      descricao: 'Teste de não conformidade com anexos',
      impacto: 'medio',
      area_afetada: 'Área de teste',
      responsavel_deteccao: 'Teste',
      anexos_evidencia: ['evidencia1.pdf', 'evidencia2.jpg'],
      anexos_corretiva: ['corretiva1.pdf'],
      anexos_verificacao: ['verificacao1.pdf', 'verificacao2.docx'],
      timeline: [
        {
          id: '1',
          data: new Date().toISOString(),
          tipo: 'deteccao',
          responsavel: 'Teste',
          descricao: 'Deteção inicial',
          anexos: ['anexo1.pdf']
        }
      ]
    };

    const { data: ncCriada, error: createError } = await supabase
      .from('nao_conformidades')
      .insert([novaNC])
      .select()
      .single();

    if (createError) {
      console.error('❌ Erro ao criar não conformidade:', createError);
      return;
    }

    console.log('✅ Não conformidade criada:', ncCriada.id);
    console.log('📎 Anexos de evidência:', ncCriada.anexos_evidencia);
    console.log('📎 Anexos corretiva:', ncCriada.anexos_corretiva);
    console.log('📎 Anexos verificação:', ncCriada.anexos_verificacao);
    console.log('📅 Timeline:', ncCriada.timeline);

    // 3. Buscar a não conformidade criada
    console.log('\n3️⃣ Buscando não conformidade criada...');
    
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
    console.log('📎 Anexos de evidência:', ncBuscada.anexos_evidencia);
    console.log('📎 Anexos corretiva:', ncBuscada.anexos_corretiva);
    console.log('📎 Anexos verificação:', ncBuscada.anexos_verificacao);
    console.log('📅 Timeline:', ncBuscada.timeline);

    // 4. Atualizar a não conformidade com novos anexos
    console.log('\n4️⃣ Atualizando não conformidade com novos anexos...');
    
    const updateData = {
      anexos_evidencia: ['evidencia1.pdf', 'evidencia2.jpg', 'evidencia3.pdf'],
      anexos_corretiva: ['corretiva1.pdf', 'corretiva2.pdf'],
      anexos_verificacao: ['verificacao1.pdf', 'verificacao2.docx', 'verificacao3.pdf'],
      timeline: [
        {
          id: '1',
          data: new Date().toISOString(),
          tipo: 'deteccao',
          responsavel: 'Teste',
          descricao: 'Deteção inicial',
          anexos: ['anexo1.pdf']
        },
        {
          id: '2',
          data: new Date().toISOString(),
          tipo: 'acao_corretiva',
          responsavel: 'Teste',
          descricao: 'Ação corretiva implementada',
          anexos: ['anexo2.pdf']
        }
      ]
    };

    const { data: ncAtualizada, error: updateError } = await supabase
      .from('nao_conformidades')
      .update(updateData)
      .eq('id', ncCriada.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erro ao atualizar não conformidade:', updateError);
      return;
    }

    console.log('✅ Não conformidade atualizada');
    console.log('📎 Anexos de evidência:', ncAtualizada.anexos_evidencia);
    console.log('📎 Anexos corretiva:', ncAtualizada.anexos_corretiva);
    console.log('📎 Anexos verificação:', ncAtualizada.anexos_verificacao);
    console.log('📅 Timeline:', ncAtualizada.timeline);

    // 5. Listar todas as não conformidades
    console.log('\n5️⃣ Listando todas as não conformidades...');
    
    const { data: todasNCs, error: listError } = await supabase
      .from('nao_conformidades')
      .select('*')
      .order('created_at', { ascending: false });

    if (listError) {
      console.error('❌ Erro ao listar não conformidades:', listError);
      return;
    }

    console.log(`✅ Encontradas ${todasNCs.length} não conformidades`);
    
    todasNCs.forEach((nc, index) => {
      console.log(`\n📋 NC ${index + 1}: ${nc.codigo}`);
      console.log(`   Descrição: ${nc.descricao}`);
      console.log(`   Anexos evidência: ${nc.anexos_evidencia?.length || 0}`);
      console.log(`   Anexos corretiva: ${nc.anexos_corretiva?.length || 0}`);
      console.log(`   Anexos verificação: ${nc.anexos_verificacao?.length || 0}`);
      console.log(`   Timeline: ${nc.timeline?.length || 0} eventos`);
    });

    // 6. Limpar dados de teste
    console.log('\n6️⃣ Limpando dados de teste...');
    
    const { error: deleteError } = await supabase
      .from('nao_conformidades')
      .delete()
      .eq('codigo', 'NC-TEST-001');

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

testNaoConformidadesAnexos(); 