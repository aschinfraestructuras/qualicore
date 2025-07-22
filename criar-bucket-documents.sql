-- =====================================================
-- CRIAR E CONFIGURAR BUCKET DOCUMENTS
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- 1. CRIAR BUCKET DOCUMENTS (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true,
    52428800, -- 50MB
    ARRAY['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- 2. CRIAR POLÍTICAS PARA O BUCKET DOCUMENTS

-- Política para permitir upload de arquivos autenticados
CREATE POLICY "Users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'documents' 
    AND auth.role() = 'authenticated'
);

-- Política para permitir visualização de arquivos públicos
CREATE POLICY "Documents are publicly accessible" ON storage.objects
FOR SELECT USING (
    bucket_id = 'documents'
);

-- Política para permitir atualização de arquivos próprios
CREATE POLICY "Users can update own documents" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para permitir exclusão de arquivos próprios
CREATE POLICY "Users can delete own documents" ON storage.objects
FOR DELETE USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. VERIFICAR SE O BUCKET FOI CRIADO
SELECT 
    'BUCKET STATUS' as verificação,
    id,
    name,
    public,
    file_size_limit,
    created_at
FROM storage.buckets 
WHERE name = 'documents';

-- 4. VERIFICAR POLÍTICAS CRIADAS
SELECT 
    'POLÍTICAS CRIADAS' as verificação,
    name,
    definition
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY name;

-- 5. TESTAR UPLOAD SIMPLES
-- Nota: Este é apenas um teste de estrutura, não um upload real
SELECT 
    'TESTE DE ESTRUTURA' as verificação,
    'Bucket documents configurado' as status,
    'Políticas criadas' as politicas,
    'Pronto para upload' as proximo_passo
FROM (SELECT 1) as dummy;

-- 6. MENSAGEM DE SUCESSO
SELECT 
    '🎉 BUCKET CONFIGURADO!' as verificação,
    'Bucket "documents" criado com sucesso' as mensagem,
    'Políticas de acesso configuradas' as politicas,
    'Teste carregar um documento agora' as instrucao
FROM (SELECT 1) as dummy; 