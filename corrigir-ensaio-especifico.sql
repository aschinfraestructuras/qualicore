-- =====================================================
-- CORREÇÃO ESPECÍFICA: Ensaio ENS-2025-0718-620
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script corrige o problema específico do ensaio

-- 1. VERIFICAR SE A COLUNA 'documents' EXISTE NA TABELA ENSAIOS
-- =====================================================

-- Verificar estrutura da tabela ensaios
SELECT 
    'ESTRUTURA TABELA ENSAIOS' as verificação,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'ensaios'
ORDER BY ordinal_position;

-- 2. ADICIONAR COLUNA 'documents' SE NÃO EXISTIR
-- =====================================================

-- Adicionar coluna documents se não existir
ALTER TABLE ensaios ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';

-- Verificar se foi adicionada
SELECT 
    'VERIFICAÇÃO COLUNA DOCUMENTS' as verificação,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'ensaios' 
            AND column_name = 'documents'
        ) THEN '✅ Coluna documents existe'
        ELSE '❌ Coluna documents NÃO existe'
    END as status;

-- 3. VERIFICAR O ENSAIO ESPECÍFICO
-- =====================================================

-- Verificar o ensaio ENS-2025-0718-620
SELECT 
    'VERIFICAR ENSAIO ESPECÍFICO' as verificação,
    id,
    codigo,
    tipo,
    resultado,
    documents,
    CASE 
        WHEN documents IS NOT NULL AND jsonb_array_length(documents) > 0 THEN '✅ Tem documentos'
        ELSE '❌ Sem documentos'
    END as status_documentos
FROM ensaios 
WHERE id = '50c5d440-b91a-45ce-9506-6b59ff390fa7'
OR codigo = 'ENS-2025-0718-620';

-- 4. CRIAR BUCKET 'documents' SE NÃO EXISTIR
-- =====================================================

-- Criar bucket documents público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true, -- IMPORTANTE: Deve ser público
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

-- 5. CONFIGURAR POLÍTICAS DE STORAGE PERMISSIVAS
-- =====================================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Acesso público total aos documentos" ON storage.objects;
DROP POLICY IF EXISTS "Documentos podem ser vistos por todos" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode atualizar" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode remover" ON storage.objects;

-- Criar política muito permissiva
CREATE POLICY "Acesso total aos documentos" ON storage.objects
    FOR ALL USING (bucket_id = 'documents');

-- 6. LIMPAR DOCUMENTOS INVÁLIDOS DO ENSAIO
-- =====================================================

-- Limpar documentos inválidos do ensaio específico
UPDATE ensaios 
SET documents = '[]'::jsonb
WHERE id = '50c5d440-b91a-45ce-9506-6b59ff390fa7'
AND (documents IS NULL OR documents = 'null'::jsonb);

-- 7. VERIFICAR SE HÁ FICHEIROS NO STORAGE
-- =====================================================

-- Listar todos os ficheiros no bucket documents
SELECT 
    'FICHEIROS NO STORAGE' as verificação,
    name,
    id,
    updated_at,
    CASE 
        WHEN name LIKE '%ensaio%' THEN '📋 Ensaio'
        WHEN name LIKE '%obra%' THEN '🏗️ Obra'
        WHEN name LIKE '%material%' THEN '📦 Material'
        WHEN name LIKE '%fornecedor%' THEN '🏢 Fornecedor'
        WHEN name LIKE '%documento%' THEN '📄 Documento'
        ELSE '❓ Outro'
    END as tipo
FROM storage.objects 
WHERE bucket_id = 'documents'
ORDER BY updated_at DESC
LIMIT 10;

-- 8. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se tudo está configurado corretamente
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'documents' AND public = true)
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ensaios' AND column_name = 'documents')
        AND EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects')
        THEN '✅ TUDO CONFIGURADO CORRETAMENTE!'
        ELSE '❌ AINDA HÁ PROBLEMAS'
    END as status_final;

-- Mostrar configuração final
SELECT 
    'CONFIGURAÇÃO FINAL' as verificação,
    'Bucket documents' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'documents' AND public = true)
        THEN '✅ Público e configurado'
        ELSE '❌ Não configurado corretamente'
    END as status
UNION ALL
SELECT 
    'CONFIGURAÇÃO FINAL' as verificação,
    'Coluna documents' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ensaios' AND column_name = 'documents')
        THEN '✅ Existe na tabela ensaios'
        ELSE '❌ Não existe na tabela ensaios'
    END as status
UNION ALL
SELECT 
    'CONFIGURAÇÃO FINAL' as verificação,
    'Políticas storage' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects')
        THEN '✅ Configuradas'
        ELSE '❌ Não configuradas'
    END as status; 