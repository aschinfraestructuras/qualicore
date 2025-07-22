const { createClient } = require('@supabase/supabase-js');

// Usar as credenciais do arquivo supabase.ts
const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

console.log('🔍 Testando configuração do Supabase Storage...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey.substring(0, 20) + '...\n');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStorage() {
  try {
    // Teste 1: Verificar se storage está disponível
    console.log('1️⃣ Verificando se storage está disponível...');
    const { data: storageCheck, error: storageError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'storage')
      .eq('table_name', 'buckets');

    if (storageError) {
      console.log('❌ Erro ao verificar storage:', storageError.message);
    } else if (storageCheck && storageCheck.length > 0) {
      console.log('✅ Storage está disponível!');
    } else {
      console.log('❌ Storage não está disponível ou não configurado');
    }

    // Teste 2: Verificar buckets existentes
    console.log('\n2️⃣ Verificando buckets existentes...');
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

    // Teste 3: Tentar criar um bucket de teste
    console.log('\n3️⃣ Testando criação de bucket...');
    const testBucketName = 'test-bucket-' + Date.now();
    const { data: newBucket, error: createError } = await supabase
      .storage
      .createBucket(testBucketName, {
        public: false
      });

    if (createError) {
      console.log('❌ Erro ao criar bucket:', createError.message);
    } else {
      console.log('✅ Bucket criado com sucesso:', testBucketName);
      
      // Remover bucket de teste
      const { error: deleteError } = await supabase
        .storage
        .deleteBucket(testBucketName);
      
      if (deleteError) {
        console.log('⚠️ Erro ao remover bucket de teste:', deleteError.message);
      } else {
        console.log('✅ Bucket de teste removido');
      }
    }

    // Teste 4: Verificar políticas RLS
    console.log('\n4️⃣ Verificando políticas RLS...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('schemaname', 'storage');

    if (policiesError) {
      console.log('❌ Erro ao verificar políticas:', policiesError.message);
    } else {
      console.log('✅ Políticas encontradas:', policies.length);
      policies.forEach(policy => {
        console.log(`   - ${policy.policyname} (${policy.tablename})`);
      });
    }

    // Teste 5: Verificar se existe bucket para documentos
    console.log('\n5️⃣ Verificando bucket de documentos...');
    const { data: docBucket, error: docBucketError } = await supabase
      .storage
      .getBucket('documentos');

    if (docBucketError) {
      console.log('❌ Bucket "documentos" não encontrado:', docBucketError.message);
      console.log('💡 Vamos criar o bucket de documentos...');
      
      const { data: newDocBucket, error: createDocError } = await supabase
        .storage
        .createBucket('documentos', {
          public: false,
          allowedMimeTypes: ['application/pdf', 'image/*', 'text/*'],
          fileSizeLimit: 52428800 // 50MB
        });

      if (createDocError) {
        console.log('❌ Erro ao criar bucket documentos:', createDocError.message);
      } else {
        console.log('✅ Bucket "documentos" criado com sucesso!');
      }
    } else {
      console.log('✅ Bucket "documentos" já existe!');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testStorage(); 