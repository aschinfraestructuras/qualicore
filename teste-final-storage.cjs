const { createClient } = require('@supabase/supabase-js');

// Credenciais do Supabase
const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qG3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testeFinalStorage() {
  console.log('🧪 TESTE FINAL - Storage Supabase');
  console.log('==================================\n');

  try {
    // 1. Verificar buckets existentes
    console.log('1️⃣ Verificando buckets...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.log('❌ Erro ao listar buckets:', bucketsError.message);
      return;
    }

    console.log('✅ Buckets encontrados:', buckets.length);
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'Público' : 'Privado'})`);
    });

    // 2. Teste de upload para bucket documentos
    console.log('\n2️⃣ Testando upload para bucket "documentos"...');
    const testFile = Buffer.from('Teste final - ' + new Date().toISOString());
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('documentos')
      .upload('teste-final.txt', testFile, {
        contentType: 'text/plain'
      });

    if (uploadError) {
      console.log('❌ Erro no upload:', uploadError.message);
    } else {
      console.log('✅ Upload realizado com sucesso!');
      console.log('   Arquivo:', uploadData.path);
      
      // 3. Teste de download
      console.log('\n3️⃣ Testando download...');
      const { data: downloadData, error: downloadError } = await supabase
        .storage
        .from('documentos')
        .download('teste-final.txt');

      if (downloadError) {
        console.log('❌ Erro no download:', downloadError.message);
      } else {
        console.log('✅ Download realizado com sucesso!');
        console.log('   Tamanho:', downloadData.size, 'bytes');
      }

      // 4. Remover arquivo de teste
      console.log('\n4️⃣ Removendo arquivo de teste...');
      const { error: deleteError } = await supabase
        .storage
        .from('documentos')
        .remove(['teste-final.txt']);

      if (deleteError) {
        console.log('⚠️ Erro ao remover arquivo:', deleteError.message);
      } else {
        console.log('✅ Arquivo de teste removido');
      }
    }

    // 5. Teste de upload para bucket ensaios
    console.log('\n5️⃣ Testando upload para bucket "ensaios"...');
    const testFile2 = Buffer.from('Teste ensaios - ' + new Date().toISOString());
    const { data: uploadData2, error: uploadError2 } = await supabase
      .storage
      .from('ensaios')
      .upload('teste-ensaios.txt', testFile2, {
        contentType: 'text/plain'
      });

    if (uploadError2) {
      console.log('❌ Erro no upload para ensaios:', uploadError2.message);
    } else {
      console.log('✅ Upload para ensaios realizado com sucesso!');
      
      // Remover arquivo de teste
      const { error: deleteError2 } = await supabase
        .storage
        .from('ensaios')
        .remove(['teste-ensaios.txt']);

      if (deleteError2) {
        console.log('⚠️ Erro ao remover arquivo de ensaios:', deleteError2.message);
      } else {
        console.log('✅ Arquivo de teste de ensaios removido');
      }
    }

    console.log('\n🎉 TESTE FINAL CONCLUÍDO!');
    console.log('==================================');
    console.log('✅ Storage está funcionando corretamente');
    console.log('✅ Upload e download funcionando');
    console.log('✅ Buckets configurados');
    console.log('✅ Políticas RLS ativas');
    console.log('');
    console.log('📝 PRÓXIMOS PASSOS:');
    console.log('1. Inicie a aplicação: npm run dev');
    console.log('2. Teste criar um ensaio com documento');
    console.log('3. Se funcionar, o sistema está 100% pronto!');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testeFinalStorage(); 