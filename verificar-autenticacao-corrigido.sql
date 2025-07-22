-- =====================================================
-- VERIFICAR AUTENTICAÇÃO E STORAGE (CORRIGIDO)
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- 1. VERIFICAR USUÁRIOS EXISTENTES
SELECT 
    'USUÁRIOS EXISTENTES' as verificação,
    id,
    email,
    created_at,
    last_sign_in_at,
    role
FROM auth.users 
ORDER BY created_at DESC
LIMIT 5;

-- 2. VERIFICAR SESSÕES ATIVAS
SELECT 
    'SESSÕES ATIVAS' as verificação,
    id,
    user_id,
    created_at,
    not_after
FROM auth.sessions 
WHERE not_after > now()
ORDER BY created_at DESC
LIMIT 5;

-- 3. VERIFICAR BUCKETS DE STORAGE
SELECT 
    'BUCKETS STORAGE' as verificação,
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
ORDER BY name;

-- 4. VERIFICAR DADOS DE NÃO CONFORMIDADES
SELECT 
    'DADOS NÃO CONFORMIDADES' as verificação,
    id,
    codigo,
    user_id,
    created_at,
    anexos_evidencia,
    anexos_corretiva,
    anexos_verificacao
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 3;

-- 5. VERIFICAR SE HÁ DADOS SEM USER_ID
SELECT 
    'DADOS SEM USER_ID' as verificação,
    COUNT(*) as total_registros_sem_user
FROM nao_conformidades 
WHERE user_id IS NULL;

-- 6. VERIFICAR ESTRUTURA DA TABELA NÃO CONFORMIDADES
SELECT 
    'ESTRUTURA TABELA' as verificação,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 7. VERIFICAR SE O BUCKET DOCUMENTS EXISTE
SELECT 
    'BUCKET DOCUMENTS' as verificação,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM storage.buckets WHERE name = 'documents'
        ) THEN '✅ Bucket "documents" existe'
        ELSE '❌ Bucket "documents" NÃO existe'
    END as status_bucket;

-- 8. MENSAGEM DE SUCESSO
SELECT 
    '🔍 VERIFICAÇÃO CONCLUÍDA' as verificação,
    'Verifique os resultados acima' as instrucao,
    'Se houver dados sem user_id, pode ser o problema' as observacao
FROM (SELECT 1) as dummy; 