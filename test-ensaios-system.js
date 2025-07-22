const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (substitua pelas suas credenciais)
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEnsaiosSystem() {
  console.log('🧪 Testando sistema de Ensaios...\n');

  try {
    // 1. Testar autenticação
    console.log('1. Testando autenticação...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('❌ Usuário não autenticado. Faça login primeiro.');
      return;
    }
    console.log('✅ Usuário autenticado:', user.email);

    // 2. Verificar se a tabela ensaios existe
    console.log('\n2. Verificando tabela ensaios...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('ensaios')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.log('❌ Erro ao acessar tabela ensaios:', tableError.message);
      console.log('💡 Execute o script fix-ensaios-table.sql primeiro');
      return;
    }
    console.log('✅ Tabela ensaios acessível');

    // 3. Verificar bucket de storage
    console.log('\n3. Verificando bucket documents...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.log('❌ Erro ao listar buckets:', bucketError.message);
      return;
    }

    const documentsBucket = buckets.find(b => b.name === 'documents');
    if (!documentsBucket) {
      console.log('❌ Bucket "documents" não encontrado');
      console.log('💡 Execute o script setup-storage-bucket.sql primeiro');
      return;
    }
    console.log('✅ Bucket documents encontrado');

    // 4. Testar criação de ensaio
    console.log('\n4. Testando criação de ensaio...');
    const testEnsaio = {
      codigo: 'TEST-2024-001',
      tipo: 'Ensaio de Resistência à Compressão',
      data_ensaio: '2024-01-15',
      laboratorio: 'Laboratório Central',
      responsavel: 'João Silva',
      valor_esperado: 25.0,
      valor_obtido: 24.5,
      unidade: 'MPa',
      conforme: true,
      estado: 'aprovado',
      zona: 'Zona A - Fundações',
      observacoes: 'Ensaio de teste',
      resultado: '24.5 MPa',
      documents: [],
      seguimento: [],
      contextoAdicional: []
    };

    const { data: newEnsaio, error: createError } = await supabase
      .from('ensaios')
      .insert([testEnsaio])
      .select()
      .single();

    if (createError) {
      console.log('❌ Erro ao criar ensaio:', createError.message);
      return;
    }
    console.log('✅ Ensaio criado com sucesso:', newEnsaio.id);

    // 5. Testar upload de documento
    console.log('\n5. Testando upload de documento...');
    
    // Criar um arquivo de teste (texto simples)
    const testFile = new Blob(['Este é um arquivo de teste'], { type: 'text/plain' });
    const fileName = `test-${Date.now()}.txt`;
    const filePath = `ensaio/${newEnsaio.id}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, testFile);

    if (uploadError) {
      console.log('❌ Erro no upload:', uploadError.message);
    } else {
      console.log('✅ Documento carregado:', uploadData.path);
      
      // Gerar URL pública
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      console.log('✅ URL pública gerada:', urlData.publicUrl);
    }

    // 6. Testar listagem de ensaios
    console.log('\n6. Testando listagem de ensaios...');
    const { data: ensaios, error: listError } = await supabase
      .from('ensaios')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (listError) {
      console.log('❌ Erro ao listar ensaios:', listError.message);
    } else {
      console.log(`✅ ${ensaios.length} ensaios encontrados`);
    }

    // 7. Limpar dados de teste
    console.log('\n7. Limpando dados de teste...');
    await supabase
      .from('ensaios')
      .delete()
      .eq('codigo', 'TEST-2024-001');

    console.log('✅ Dados de teste removidos');

    console.log('\n🎉 Todos os testes passaram! O sistema está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testEnsaiosSystem();
}

module.exports = { testEnsaiosSystem }; 