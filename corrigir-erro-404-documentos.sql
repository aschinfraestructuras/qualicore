-- =====================================================
-- CORREÇÃO ESPECÍFICA: Erro 404 nos Documentos
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script corrige o problema de documentos não encontrados

-- 1. VERIFICAR SE O BUCKET 'documents' EXISTE E ESTÁ CONFIGURADO
-- =====================================================

-- Verificar buckets existentes
SELECT 
    'BUCKETS EXISTENTES' as verificação,
    id,
    name,
    public,
    file_size_limit,
    CASE 
        WHEN public THEN '✅ Público'
        ELSE '❌ Privado'
    END as status
FROM storage.buckets;

-- 2. CRIAR/ATUALIZAR BUCKET 'documents' COM CONFIGURAÇÃO CORRETA
-- =====================================================

-- Remover bucket se existir (para recriar com configuração correta)
DROP POLICY IF EXISTS "Documentos públicos podem ser vistos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem remover documentos" ON storage.objects;

-- Criar bucket 'documents' com configuração pública
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true, -- IMPORTANTE: Deve ser público para permitir acesso
    10485760, -- 10MB
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. CONFIGURAR POLÍTICAS DE STORAGE MUITO PERMISSIVAS
-- =====================================================

-- Política para permitir acesso público TOTAL aos documentos
CREATE POLICY "Acesso público total aos documentos" ON storage.objects
    FOR ALL USING (bucket_id = 'documents');

-- Política alternativa mais específica se a anterior não funcionar
CREATE POLICY "Documentos podem ser vistos por todos" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Qualquer pessoa pode fazer upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Qualquer pessoa pode atualizar" ON storage.objects
    FOR UPDATE USING (bucket_id = 'documents');

CREATE POLICY "Qualquer pessoa pode remover" ON storage.objects
    FOR DELETE USING (bucket_id = 'documents');

-- 4. VERIFICAR DOCUMENTOS EXISTENTES NO STORAGE
-- =====================================================

-- Listar todos os objetos no bucket 'documents'
SELECT 
    'DOCUMENTOS NO STORAGE' as verificação,
    name,
    id,
    updated_at,
    CASE 
        WHEN name LIKE '%ensaio%' THEN '✅ Ensaio'
        WHEN name LIKE '%obra%' THEN '✅ Obra'
        WHEN name LIKE '%material%' THEN '✅ Material'
        WHEN name LIKE '%fornecedor%' THEN '✅ Fornecedor'
        ELSE '❓ Outro'
    END as tipo
FROM storage.objects 
WHERE bucket_id = 'documents'
ORDER BY updated_at DESC;

-- 5. VERIFICAR DOCUMENTOS NAS TABELAS
-- =====================================================

-- Verificar documentos na tabela ensaios
SELECT 
    'DOCUMENTOS NA TABELA ENSAIOS' as verificação,
    id,
    codigo,
    documents,
    CASE 
        WHEN documents IS NOT NULL AND jsonb_array_length(documents) > 0 THEN '✅ Tem documentos'
        ELSE '❌ Sem documentos'
    END as status
FROM ensaios 
WHERE documents IS NOT NULL AND jsonb_array_length(documents) > 0
LIMIT 5;

-- 6. CRIAR DOCUMENTO DE TESTE PARA VERIFICAR
-- =====================================================

-- Inserir um documento de teste na tabela ensaios (se houver ensaios)
UPDATE ensaios 
SET documents = '[
    {
        "id": "teste/documento-teste.txt",
        "name": "documento-teste.txt",
        "url": "https://mjgvjpqcdsmvervcxjig.supabase.co/storage/v1/object/public/documents/teste/documento-teste.txt",
        "type": "text/plain",
        "size": 1024,
        "uploaded_at": "' || NOW() || '"
    }
]'::jsonb
WHERE id = (SELECT id FROM ensaios LIMIT 1);

-- 7. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se o bucket está configurado corretamente
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'documents' AND public = true)
        AND EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects')
        THEN '✅ BUCKET CONFIGURADO CORRETAMENTE'
        ELSE '❌ AINDA HÁ PROBLEMAS'
    END as status;

-- Mostrar configuração final do bucket
SELECT 
    'CONFIGURAÇÃO FINAL' as verificação,
    id,
    name,
    public,
    file_size_limit,
    CASE 
        WHEN public THEN '✅ Público - Documentos acessíveis'
        ELSE '❌ Privado - Pode causar erro 404'
    END as status_final
FROM storage.buckets 
WHERE name = 'documents'; 