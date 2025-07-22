-- =====================================================
-- VERIFICAR E CORRIGIR: Campo documents em Fornecedores
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- 1. VERIFICAR ESTRUTURA ATUAL DA TABELA FORNECEDORES
-- =====================================================

SELECT 
    'ESTRUTURA TABELA FORNECEDORES' as verificação,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'fornecedores'
ORDER BY ordinal_position;

-- 2. VERIFICAR SE O CAMPO documents EXISTE
-- =====================================================

SELECT 
    'VERIFICAÇÃO CAMPO DOCUMENTS' as verificação,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'fornecedores' AND column_name = 'documents'
        ) THEN '✅ Campo documents existe'
        ELSE '❌ Campo documents NÃO existe'
    END as status;

-- 3. ADICIONAR CAMPO documents SE NÃO EXISTIR
-- =====================================================

ALTER TABLE fornecedores ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- 4. VERIFICAR SE FOI ADICIONADO
-- =====================================================

SELECT 
    'CONFIRMAÇÃO ADIÇÃO' as verificação,
    column_name,
    data_type,
    column_default,
    CASE 
        WHEN data_type = 'jsonb' THEN '✅ Campo documents adicionado corretamente'
        ELSE '❌ Erro na adição do campo'
    END as status
FROM information_schema.columns 
WHERE table_name = 'fornecedores' AND column_name = 'documents';

-- 5. VERIFICAR FORNECEDORES EXISTENTES
-- =====================================================

SELECT 
    'FORNECEDORES EXISTENTES' as verificação,
    id,
    nome,
    nif,
    documents,
    CASE 
        WHEN documents IS NULL THEN '❌ NULL'
        WHEN documents = '[]'::jsonb THEN '❌ VAZIO'
        WHEN jsonb_array_length(documents) > 0 THEN '✅ COM DOCUMENTOS'
        ELSE '❓ INVÁLIDO'
    END as status_documents
FROM fornecedores 
ORDER BY created_at DESC 
LIMIT 5;

-- 6. LIMPAR DADOS INVÁLIDOS
-- =====================================================

UPDATE fornecedores 
SET documents = '[]'::jsonb 
WHERE documents IS NULL OR documents = 'null'::jsonb;

-- 7. CRIAR FORNECEDOR DE TESTE COM DOCUMENTOS
-- =====================================================

-- Remover fornecedor de teste anterior se existir
DELETE FROM fornecedores WHERE codigo = 'FORN-TESTE-001';

-- Criar fornecedor de teste com documentos válidos
WITH user_info AS (
    SELECT id FROM auth.users LIMIT 1
)
INSERT INTO fornecedores (
    nome,
    nif,
    morada,
    telefone,
    email,
    contacto,
    estado,
    website,
    certificacoes,
    produtos_servicos,
    observacoes,
    documents,
    user_id
) 
SELECT 
    'Fornecedor Teste Documentos',
    '123456789',
    'Rua Teste, 123',
    '+351 123 456 789',
    'teste@fornecedor.pt',
    'João Teste',
    'ativo',
    'www.testefornecedor.pt',
    'ISO 9001',
    'Materiais de construção',
    'Fornecedor de teste para verificar upload de documentos',
    '[{"id": "fornecedor/temp_1706361600000/documento1.pdf", "name": "documento1.pdf", "url": "https://mjgvjpqcdsmvervcxjig.supabase.co/storage/v1/object/public/documents/fornecedor/temp_1706361600000/documento1.pdf", "type": "application/pdf", "size": 1024, "uploaded_at": "2025-01-27T10:00:00Z"}, {"id": "fornecedor/temp_1706361600000/documento2.jpg", "name": "documento2.jpg", "url": "https://mjgvjpqcdsmvervcxjig.supabase.co/storage/v1/object/public/documents/fornecedor/temp_1706361600000/documento2.jpg", "type": "image/jpeg", "size": 2048, "uploaded_at": "2025-01-27T10:01:00Z"}]'::jsonb,
    user_info.id 
FROM user_info
ON CONFLICT (nif) DO NOTHING;

-- 8. VERIFICAR FORNECEDOR CRIADO
-- =====================================================

SELECT 
    'FORNECEDOR DE TESTE' as verificação,
    id,
    nome,
    nif,
    documents,
    jsonb_array_length(documents) as num_documents
FROM fornecedores 
WHERE nif = '123456789';

-- 9. MENSAGEM FINAL
-- =====================================================

SELECT '✅ VERIFICAÇÃO E CORREÇÃO CONCLUÍDA!' as status; 