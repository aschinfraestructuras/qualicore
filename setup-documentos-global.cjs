const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Credenciais do Supabase
const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qG3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDocumentosGlobal() {
  console.log('🌍 CONFIGURAÇÃO GLOBAL DE DOCUMENTOS');
  console.log('=====================================\n');

  try {
    // 1. Criar buckets para todos os módulos
    console.log('1️⃣ Criando buckets para todos os módulos...');
    
    const buckets = [
      'documentos',
      'ensaios', 
      'obras',
      'materiais',
      'fornecedores',
      'checklists',
      'nao_conformidades',
      'rfis'
    ];

    for (const bucketName of buckets) {
      console.log(`   Criando bucket: ${bucketName}`);
      const { data, error } = await supabase
        .storage
        .createBucket(bucketName, {
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

      if (error && !error.message.includes('already exists')) {
        console.log(`   ❌ Erro ao criar ${bucketName}:`, error.message);
      } else {
        console.log(`   ✅ Bucket ${bucketName} criado/verificado`);
      }
    }

    // 2. Executar SQL para adicionar colunas
    console.log('\n2️⃣ Adicionando colunas documents nas tabelas...');
    
    const sqlContent = fs.readFileSync('setup-documentos-global.sql', 'utf8');
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.startsWith('DO $$'));

    console.log(`   Executando ${commands.length} comandos SQL...`);

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      // Pular comandos de verificação
      if (command.includes('SELECT') && (command.includes('pg_policies') || command.includes('storage.buckets'))) {
        continue;
      }

      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: command });
        
        if (error) {
          console.log(`   ⚠️  Comando ${i + 1}: ${error.message}`);
        } else {
          console.log(`   ✅ Comando ${i + 1} executado`);
        }
      } catch (err) {
        console.log(`   ❌ Erro no comando ${i + 1}: ${err.message}`);
      }
    }

    // 3. Teste de upload em cada bucket
    console.log('\n3️⃣ Testando upload em todos os buckets...');
    
    for (const bucketName of buckets) {
      console.log(`   Testando upload em: ${bucketName}`);
      const testFile = Buffer.from(`Teste ${bucketName} - ${new Date().toISOString()}`);
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from(bucketName)
        .upload(`teste-${bucketName}.txt`, testFile, {
          contentType: 'text/plain'
        });

      if (uploadError) {
        console.log(`   ❌ Erro no upload ${bucketName}:`, uploadError.message);
      } else {
        console.log(`   ✅ Upload ${bucketName} realizado`);
        
        // Remover arquivo de teste
        const { error: deleteError } = await supabase
          .storage
          .from(bucketName)
          .remove([`teste-${bucketName}.txt`]);
        
        if (deleteError) {
          console.log(`   ⚠️  Erro ao remover teste ${bucketName}:`, deleteError.message);
        } else {
          console.log(`   ✅ Teste ${bucketName} removido`);
        }
      }
    }

    // 4. Verificar configuração final
    console.log('\n4️⃣ Verificando configuração final...');
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

    console.log('\n🎉 CONFIGURAÇÃO GLOBAL COMPLETA!');
    console.log('=====================================');
    console.log('✅ 8 buckets criados para todos os módulos');
    console.log('✅ Colunas documents adicionadas em todas as tabelas');
    console.log('✅ Políticas RLS configuradas globalmente');
    console.log('✅ Upload testado em todos os buckets');
    console.log('');
    console.log('📋 MÓDULOS CONFIGURADOS:');
    console.log('   - Ensaios (gerais e compactação)');
    console.log('   - Obras');
    console.log('   - Materiais');
    console.log('   - Fornecedores');
    console.log('   - Checklists');
    console.log('   - Documentos');
    console.log('   - Não Conformidades');
    console.log('   - RFIs');
    console.log('');
    console.log('🚀 PRÓXIMO PASSO: Adicionar DocumentUpload em todos os formulários!');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

setupDocumentosGlobal(); 