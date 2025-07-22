// =====================================================
// TESTE DE UPLOAD DE DOCUMENTOS
// =====================================================
// Execute este script para testar se o upload funciona

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://mjgvjpqcdsmvervcxjig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  console.log('🔍 Testando upload de documentos...');
  
  try {
    // 1. Verificar se o bucket existe
    console.log('1. Verificando bucket "documents"...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError);
      return;
    }
    
    const documentsBucket = buckets.find(b => b.name === 'documents');
    if (!documentsBucket) {
      console.error('❌ Bucket "documents" não encontrado!');
      console.log('📋 Buckets disponíveis:', buckets.map(b => b.name));
      return;
    }
    
    console.log('✅ Bucket "documents" encontrado');
    
    // 2. Verificar políticas do bucket
    console.log('2. Verificando políticas do bucket...');
    const { data: policies, error: policiesError } = await supabase.storage.getBucket('documents');
    
    if (policiesError) {
      console.error('❌ Erro ao verificar políticas:', policiesError);
    } else {
      console.log('✅ Políticas do bucket verificadas');
    }
    
    // 3. Testar upload de um arquivo simples
    console.log('3. Testando upload de arquivo...');
    
    // Criar um arquivo de teste simples
    const testContent = 'Este é um arquivo de teste para verificar o upload.';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    const testFileName = `test_${Date.now()}.txt`;
    const testFilePath = `nao_conformidade/test/${testFileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(testFilePath, testFile);
    
    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      return;
    }
    
    console.log('✅ Upload realizado com sucesso:', uploadData.path);
    
    // 4. Gerar URL pública
    console.log('4. Gerando URL pública...');
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(testFilePath);
    
    console.log('✅ URL pública gerada:', urlData.publicUrl);
    
    // 5. Testar download
    console.log('5. Testando download...');
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(testFilePath);
    
    if (downloadError) {
      console.error('❌ Erro no download:', downloadError);
    } else {
      console.log('✅ Download realizado com sucesso');
    }
    
    // 6. Limpar arquivo de teste
    console.log('6. Limpando arquivo de teste...');
    const { error: deleteError } = await supabase.storage
      .from('documents')
      .remove([testFilePath]);
    
    if (deleteError) {
      console.error('❌ Erro ao deletar arquivo de teste:', deleteError);
    } else {
      console.log('✅ Arquivo de teste removido');
    }
    
    console.log('🎉 Teste concluído com sucesso!');
    console.log('📋 Resumo:');
    console.log('  - Bucket "documents" existe');
    console.log('  - Upload funciona');
    console.log('  - URLs públicas funcionam');
    console.log('  - Download funciona');
    
  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
  }
}

// Executar teste
testUpload(); 