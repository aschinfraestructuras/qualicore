const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Credenciais do Supabase
const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function configurarStorage() {
  console.log('🔧 Configurando Supabase Storage...\n');

  try {
    // Ler o arquivo SQL
    const sqlContent = fs.readFileSync('configurar-storage-rls.sql', 'utf8');
    
    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`📝 Executando ${commands.length} comandos SQL...\n`);

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      // Pular comandos de verificação por enquanto
      if (command.includes('SELECT') && command.includes('pg_policies')) {
        console.log(`⏭️  Pulando comando de verificação ${i + 1}...`);
        continue;
      }
      
      if (command.includes('SELECT') && command.includes('storage.buckets')) {
        console.log(`⏭️  Pulando comando de verificação ${i + 1}...`);
        continue;
      }

      try {
        console.log(`🔧 Executando comando ${i + 1}...`);
        const { data, error } = await supabase.rpc('exec_sql', { sql: command });
        
        if (error) {
          console.log(`⚠️  Erro no comando ${i + 1}:`, error.message);
        } else {
          console.log(`✅ Comando ${i + 1} executado com sucesso`);
        }
      } catch (err) {
        console.log(`❌ Erro ao executar comando ${i + 1}:`, err.message);
      }
    }

    // Tentar criar bucket diretamente via API
    console.log('\n🪣 Criando bucket de documentos via API...');
    const { data: bucket, error: bucketError } = await supabase
      .storage
      .createBucket('documentos', {
        public: false,
        allowedMimeTypes: ['application/pdf', 'image/*', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        fileSizeLimit: 52428800 // 50MB
      });

    if (bucketError) {
      console.log('❌ Erro ao criar bucket:', bucketError.message);
    } else {
      console.log('✅ Bucket "documentos" criado com sucesso!');
    }

    // Verificar buckets existentes
    console.log('\n📋 Verificando buckets existentes...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.log('❌ Erro ao listar buckets:', bucketsError.message);
    } else {
      console.log('✅ Buckets encontrados:', buckets.length);
      buckets.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'Público' : 'Privado'})`);
      });
    }

    // Teste de upload
    console.log('\n🧪 Testando upload de arquivo...');
    const testFile = Buffer.from('Teste de upload - ' + new Date().toISOString());
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('documentos')
      .upload('teste.txt', testFile, {
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
        .remove(['teste.txt']);
      
      if (deleteError) {
        console.log('⚠️ Erro ao remover arquivo de teste:', deleteError.message);
      } else {
        console.log('✅ Arquivo de teste removido');
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

configurarStorage(); 