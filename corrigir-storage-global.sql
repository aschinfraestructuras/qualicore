-- =====================================================
-- CORREÇÃO GLOBAL: Storage para Todos os Módulos
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script resolve o problema global de upload de documentos

-- 1. LIMPAR TODAS AS POLÍTICAS EXISTENTES
-- =====================================================

-- Remover todas as políticas de storage.objects
DROP POLICY IF EXISTS "Acesso público total aos documentos" ON storage.objects;
DROP POLICY IF EXISTS "Documentos podem ser vistos por todos" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode atualizar" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode remover" ON storage.objects;
DROP POLICY IF EXISTS "Acesso total aos documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem ver objetos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir objetos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar objetos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar objetos" ON storage.objects;
DROP POLICY IF EXISTS "Allow all uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow all downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow all updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow all deletes" ON storage.objects;

-- 2. CRIAR BUCKET 'documents' PÚBLICO
-- =====================================================

-- Criar bucket documents público (IMPORTANTE: deve ser público)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true, -- CRUCIAL: Deve ser público
    52428800, -- 50MB
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain',
        'application/zip',
        'application/x-zip-compressed'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = true, -- Forçar a ser público
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. CRIAR POLÍTICAS MUITO PERMISSIVAS
-- =====================================================

-- Política para permitir TUDO no bucket documents
CREATE POLICY "Acesso total ao bucket documents" ON storage.objects
    FOR ALL USING (bucket_id = 'documents');

-- 4. VERIFICAR CONFIGURAÇÃO
-- =====================================================

-- Verificar bucket
SELECT 
    'BUCKET STATUS' as verificação,
    id,
    name,
    public,
    CASE 
        WHEN public THEN '✅ PÚBLICO - Documentos acessíveis'
        ELSE '❌ PRIVADO - Pode causar erro 404'
    END as status
FROM storage.buckets 
WHERE name = 'documents';

-- Verificar políticas
SELECT 
    'POLÍTICAS CRIADAS' as verificação,
    COUNT(*) as total_politicas,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Políticas aplicadas'
        ELSE '❌ Nenhuma política encontrada'
    END as status
FROM pg_policies 
WHERE schemaname = 'storage'
AND tablename = 'objects';

-- 5. MENSAGEM DE SUCESSO
-- =====================================================

SELECT 
    '🎉 STORAGE CORRIGIDO!' as verificação,
    'Bucket documents público' as bucket,
    'Políticas permissivas aplicadas' as politicas,
    'Teste agora o upload em qualquer módulo' as proximo_passo
FROM (SELECT 1) as dummy; 