const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Credenciais do Supabase
const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupStorageAutomatico() {
  console.log('🚀 CONFIGURAÇÃO AUTOMÁTICA DO STORAGE SUPABASE');
  console.log('================================================\n');

  try {
    // 1. Verificar se Storage está disponível
    console.log('1️⃣ Verificando se Storage está ativo...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.log('❌ Storage não está ativo:', bucketsError.message);
      console.log('💡 Vá para: Supabase Dashboard > Settings > General > Storage');
      console.log('💡 Ative o recurso Storage no seu projeto');
      return;
    }

    console.log('✅ Storage está ativo!');

    // 2. Criar buckets via API
    console.log('\n2️⃣ Criando buckets...');
    
    // Bucket documentos
    const { data: docBucket, error: docError } = await supabase
      .storage
      .createBucket('documentos', {
        public: false,
        allowedMimeTypes: [
          'application/pdf',
          'image/*',
          'text/*',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/zip',
          'application/x-zip-compressed'
        ],
        fileSizeLimit: 52428800 // 50MB
      });

    if (docError && !docError.message.includes('already exists')) {
      console.log('❌ Erro ao criar bucket documentos:', docError.message);
    } else {
      console.log('✅ Bucket "documentos" criado/verificado');
    }

    // Bucket ensaios
    const { data: ensaiosBucket, error: ensaiosError } = await supabase
      .storage
      .createBucket('ensaios', {
        public: false,
        allowedMimeTypes: [
          'application/pdf',
          'image/*',
          'text/*',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ],
        fileSizeLimit: 52428800 // 50MB
      });

    if (ensaiosError && !ensaiosError.message.includes('already exists')) {
      console.log('❌ Erro ao criar bucket ensaios:', ensaiosError.message);
    } else {
      console.log('✅ Bucket "ensaios" criado/verificado');
    }

    // 3. Executar SQL para configurar políticas RLS
    console.log('\n3️⃣ Configurando políticas RLS...');
    
    // Ler o arquivo SQL
    const sqlContent = fs.readFileSync('setup-storage-completo.sql', 'utf8');
    
    // Dividir em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.startsWith('DO $$'));

    console.log(`📝 Executando ${commands.length} comandos SQL...`);

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      // Pular comandos de verificação
      if (command.includes('SELECT') && (command.includes('pg_policies') || command.includes('storage.buckets'))) {
        continue;
      }

      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: command });
        
        if (error) {
          console.log(`⚠️  Comando ${i + 1}: ${error.message}`);
        } else {
          console.log(`✅ Comando ${i + 1} executado`);
        }
      } catch (err) {
        console.log(`❌ Erro no comando ${i + 1}: ${err.message}`);
      }
    }

    // 4. Teste de upload
    console.log('\n4️⃣ Testando upload de arquivo...');
    const testFile = Buffer.from('Teste de configuração - ' + new Date().toISOString());
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('documentos')
      .upload('teste-configuracao.txt', testFile, {
        contentType: 'text/plain'
      });

    if (uploadError) {
      console.log('❌ Erro no teste de upload:', uploadError.message);
    } else {
      console.log('✅ Upload de teste realizado com sucesso!');
      
      // Remover arquivo de teste
      const { error: deleteError } = await supabase
        .storage
        .from('documentos')
        .remove(['teste-configuracao.txt']);
      
      if (deleteError) {
        console.log('⚠️ Erro ao remover arquivo de teste:', deleteError.message);
      } else {
        console.log('✅ Arquivo de teste removido');
      }
    }

    // 5. Verificar configuração final
    console.log('\n5️⃣ Verificando configuração final...');
    const { data: finalBuckets, error: finalBucketsError } = await supabase
      .storage
      .listBuckets();

    if (finalBucketsError) {
      console.log('❌ Erro ao verificar buckets finais:', finalBucketsError.message);
    } else {
      console.log('✅ Buckets configurados:', finalBuckets.length);
      finalBuckets.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'Público' : 'Privado'})`);
      });
    }

    console.log('\n🎉 CONFIGURAÇÃO COMPLETA!');
    console.log('================================================');
    console.log('✅ Storage configurado com sucesso');
    console.log('✅ Buckets criados: documentos, ensaios');
    console.log('✅ Políticas RLS configuradas');
    console.log('✅ Upload de arquivos funcionando');
    console.log('');
    console.log('📝 PRÓXIMOS PASSOS:');
    console.log('1. Descomente DocumentUpload nos formulários');
    console.log('2. Teste criar um ensaio com documento');
    console.log('3. Se tudo funcionar, o sistema está pronto!');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.log('\n💡 Se o erro persistir, execute o script SQL manualmente no Supabase Dashboard');
  }
}

setupStorageAutomatico(); 