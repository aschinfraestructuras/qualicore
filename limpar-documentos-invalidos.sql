-- =====================================================
-- LIMPAR DOCUMENTOS INVÁLIDOS E PREPARAR PARA NOVOS
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script limpa documentos inválidos e prepara para novos uploads

-- 1. LIMPAR DOCUMENTOS INVÁLIDOS DO ENSAIO ESPECÍFICO
-- =====================================================

-- Limpar documentos do ensaio que está a dar erro 404
UPDATE ensaios 
SET documents = '[]'::jsonb
WHERE id = '50c5d440-b91a-45ce-9506-6b59ff390fa7';

-- Verificar se foi limpo
SELECT 
    'DOCUMENTOS LIMPOS' as verificação,
    id,
    codigo,
    documents,
    CASE 
        WHEN documents IS NULL OR documents = '[]'::jsonb THEN '✅ Limpo'
        ELSE '❌ Ainda tem documentos'
    END as status
FROM ensaios 
WHERE id = '50c5d440-b91a-45ce-9506-6b59ff390fa7';

-- 2. GARANTIR QUE O BUCKET ESTÁ PÚBLICO
-- =====================================================

-- Forçar bucket documents a ser público
UPDATE storage.buckets 
SET public = true
WHERE name = 'documents';

-- Verificar configuração
SELECT 
    'BUCKET PÚBLICO' as verificação,
    id,
    name,
    public,
    CASE 
        WHEN public THEN '✅ Público - Documentos acessíveis'
        ELSE '❌ Privado - Pode causar erro 404'
    END as status
FROM storage.buckets 
WHERE name = 'documents';

-- 3. CONFIGURAR POLÍTICAS MUITO PERMISSIVAS
-- =====================================================

-- Remover todas as políticas antigas
DROP POLICY IF EXISTS "Acesso público total aos documentos" ON storage.objects;
DROP POLICY IF EXISTS "Documentos podem ser vistos por todos" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode atualizar" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode remover" ON storage.objects;
DROP POLICY IF EXISTS "Acesso total aos documentos" ON storage.objects;

-- Criar política muito permissiva
CREATE POLICY "Acesso total aos documentos" ON storage.objects
    FOR ALL USING (bucket_id = 'documents');

-- Verificar políticas
SELECT 
    'POLÍTICAS CONFIGURADAS' as verificação,
    policyname,
    cmd,
    CASE 
        WHEN cmd = 'ALL' THEN '✅ Todas as ações permitidas'
        ELSE '❓ Ação específica'
    END as status
FROM pg_policies 
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND qual LIKE '%documents%';

-- 4. LIMPAR FICHEIROS INVÁLIDOS DO STORAGE
-- =====================================================

-- Listar ficheiros que podem estar causando problemas
SELECT 
    'FICHEIROS PROBLEMÁTICOS' as verificação,
    name,
    id,
    updated_at,
    CASE 
        WHEN name LIKE '%ensaio%' AND name LIKE '%50c5d440%' THEN '⚠️ Ficheiro do ensaio problemático'
        WHEN name LIKE '%Relatorio-Fotografico%' THEN '⚠️ Ficheiro que está a dar erro 404'
        ELSE '📄 Outro ficheiro'
    END as tipo
FROM storage.objects 
WHERE bucket_id = 'documents'
AND (
    name LIKE '%ensaio%' OR
    name LIKE '%50c5d440%' OR
    name LIKE '%Relatorio-Fotografico%'
)
ORDER BY updated_at DESC;

-- 5. PREPARAR PARA NOVO UPLOAD
-- =====================================================

-- Verificar se a coluna documents existe e está configurada
SELECT 
    'PREPARAÇÃO PARA UPLOAD' as verificação,
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name = 'documents' AND data_type = 'jsonb' THEN '✅ Configurada corretamente'
        ELSE '❌ Pode ter problemas'
    END as status
FROM information_schema.columns 
WHERE table_name = 'ensaios'
AND column_name = 'documents';

-- 6. VERIFICAÇÃO FINAL ANTES DE NOVO UPLOAD
-- =====================================================

-- Verificação completa
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Bucket público' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'documents' AND public = true)
        THEN '✅ Sim'
        ELSE '❌ Não'
    END as status
UNION ALL
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Políticas configuradas' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects')
        THEN '✅ Sim'
        ELSE '❌ Não'
    END as status
UNION ALL
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Coluna documents' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ensaios' AND column_name = 'documents')
        THEN '✅ Sim'
        ELSE '❌ Não'
    END as status
UNION ALL
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Ensaio limpo' as item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM ensaios 
            WHERE id = '50c5d440-b91a-45ce-9506-6b59ff390fa7' 
            AND (documents IS NULL OR documents = '[]'::jsonb)
        )
        THEN '✅ Sim'
        ELSE '❌ Não'
    END as status;

-- 7. INSTRUÇÕES PARA NOVO UPLOAD
-- =====================================================

SELECT 
    'INSTRUÇÕES PARA NOVO UPLOAD' as verificação,
    '1. Vá para a aplicação' as passo,
    '2. Abra o ensaio ENS-2025-0718-620' as acao,
    '3. Clique em "Editar"' as proximo,
    '4. Na seção Documentos, carregue um novo ficheiro' as upload,
    '5. Salve o ensaio' as salvar,
    '6. Teste visualizar e descarregar' as testar
FROM (SELECT 1) as dummy; 