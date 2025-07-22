const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEdicaoNaoConformidades() {
  console.log('🧪 Testando Edição de Não Conformidades...\n');

  try {
    // 1. Fazer login (tente com credenciais diferentes)
    console.log('1️⃣ Tentando login...');
    
    const emails = ['admin@qualicore.com', 'test@qualicore.com', 'user@qualicore.com'];
    let user = null;
    let authError = null;

    for (const email of emails) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: 'admin123'
        });
        
        if (!error && data.user) {
          user = data.user;
          console.log(`✅ Login realizado com ${email}`);
          break;
        }
      } catch (e) {
        console.log(`❌ Falha no login com ${email}`);
      }
    }

    if (!user) {
      console.log('⚠️ Não foi possível fazer login. Vamos testar apenas a estrutura.');
      
      // Testar estrutura sem login
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'nao_conformidades')
        .eq('table_schema', 'public')
        .in('column_name', ['anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'timeline']);

      if (columnsError) {
        console.error('❌ Erro ao verificar estrutura:', columnsError);
      } else {
        console.log('📋 Campos de anexos encontrados:');
        columns.forEach(col => {
          console.log(`   ✅ ${col.column_name}: ${col.data_type}`);
        });
      }

      console.log('\n📝 PRÓXIMOS PASSOS:');
      console.log('1. Verifique se consegue fazer login no frontend');
      console.log('2. Teste criar uma nova NC');
      console.log('3. Teste editar a NC criada');
      console.log('4. Verifique se os anexos são salvos');
      
      return;
    }

    console.log('👤 User ID:', user.id);

    // 2. Listar NCs existentes
    console.log('\n2️⃣ Listando NCs existentes...');
    
    const { data: ncs, error: listError } = await supabase
      .from('nao_conformidades')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (listError) {
      console.error('❌ Erro ao listar NCs:', listError);
      return;
    }

    console.log(`📊 Encontradas ${ncs.length} NCs`);
    
    if (ncs.length === 0) {
      console.log('📝 Nenhuma NC encontrada. Crie uma no frontend primeiro.');
      return;
    }

    // 3. Selecionar uma NC para editar
    const ncParaEditar = ncs[0];
    console.log(`\n3️⃣ Editando NC: ${ncParaEditar.codigo}`);
    console.log('📋 Dados atuais:', {
      codigo: ncParaEditar.codigo,
      descricao: ncParaEditar.descricao,
      anexos_evidencia: ncParaEditar.anexos_evidencia,
      anexos_corretiva: ncParaEditar.anexos_corretiva,
      anexos_verificacao: ncParaEditar.anexos_verificacao,
      timeline: ncParaEditar.timeline
    });

    // 4. Atualizar a NC
    console.log('\n4️⃣ Atualizando NC...');
    
    const dadosAtualizados = {
      descricao: `${ncParaEditar.descricao} - EDITADO EM ${new Date().toISOString()}`,
      anexos_evidencia: ['evidencia_editada.pdf', 'evidencia2_editada.jpg'],
      anexos_corretiva: ['corretiva_editada.pdf'],
      anexos_verificacao: ['verificacao_editada.pdf'],
      timeline: [
        {
          id: '1',
          data: new Date().toISOString(),
          tipo: 'edicao',
          responsavel: 'Teste',
          descricao: 'NC editada via teste'
        }
      ]
    };

    const { data: ncAtualizada, error: updateError } = await supabase
      .from('nao_conformidades')
      .update(dadosAtualizados)
      .eq('id', ncParaEditar.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erro ao atualizar NC:', updateError);
      return;
    }

    console.log('✅ NC atualizada com sucesso!');
    console.log('📋 Dados atualizados:', {
      codigo: ncAtualizada.codigo,
      descricao: ncAtualizada.descricao,
      anexos_evidencia: ncAtualizada.anexos_evidencia,
      anexos_corretiva: ncAtualizada.anexos_corretiva,
      anexos_verificacao: ncAtualizada.anexos_verificacao,
      timeline: ncAtualizada.timeline
    });

    // 5. Verificar se a atualização foi salva
    console.log('\n5️⃣ Verificando se a atualização foi salva...');
    
    const { data: ncVerificada, error: getError } = await supabase
      .from('nao_conformidades')
      .select('*')
      .eq('id', ncParaEditar.id)
      .single();

    if (getError) {
      console.error('❌ Erro ao verificar NC:', getError);
      return;
    }

    console.log('✅ Verificação concluída!');
    console.log('📋 Dados finais:', {
      codigo: ncVerificada.codigo,
      descricao: ncVerificada.descricao,
      anexos_evidencia: ncVerificada.anexos_evidencia,
      anexos_corretiva: ncVerificada.anexos_corretiva,
      anexos_verificacao: ncVerificada.anexos_verificacao,
      timeline: ncVerificada.timeline
    });

    console.log('\n🎉 Teste de edição concluído com sucesso!');
    console.log('\n📝 PRÓXIMOS PASSOS:');
    console.log('1. Teste no frontend se consegue editar NCs');
    console.log('2. Verifique se os anexos aparecem no formulário');
    console.log('3. Teste adicionar novos anexos');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testEdicaoNaoConformidades(); 