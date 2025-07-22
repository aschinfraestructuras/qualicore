-- =====================================================
-- TESTE: Campo documents na tabela RFI
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- 1. VERIFICAR SE O CAMPO documents EXISTE
-- =====================================================
SELECT 
    'VERIFICAÇÃO CAMPO' as teste,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'rfis' 
AND column_name = 'documents';

-- 2. VERIFICAR RFIs EXISTENTES
-- =====================================================
SELECT 
    'RFIs EXISTENTES' as teste,
    id,
    codigo,
    titulo,
    documents,
    CASE 
        WHEN documents IS NULL THEN '❌ NULL'
        WHEN documents = '[]'::jsonb THEN '❌ VAZIO'
        WHEN jsonb_array_length(documents) > 0 THEN '✅ COM DOCUMENTOS'
        ELSE '❓ INVÁLIDO'
    END as status_documents
FROM rfis 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. CRIAR RFI DE TESTE COM DOCUMENTOS
-- =====================================================
INSERT INTO rfis (
    codigo,
    numero,
    titulo,
    descricao,
    solicitante,
    destinatario,
    data_solicitacao,
    prioridade,
    status,
    documents
) VALUES (
    'RFI-TESTE-001',
    'RFI-TESTE-001',
    'RFI de Teste com Documentos',
    'Este é um RFI de teste para verificar se o campo documents funciona',
    'Teste',
    'Teste',
    '2025-01-27',
    'media',
    'pendente',
    '[
        {
            "id": "teste/documento1.pdf",
            "name": "documento1.pdf",
            "url": "https://mjgvjpqcdsmvervcxjig.supabase.co/storage/v1/object/public/documents/teste/documento1.pdf",
            "type": "application/pdf",
            "size": 1024,
            "uploaded_at": "2025-01-27T10:00:00Z"
        },
        {
            "id": "teste/documento2.jpg",
            "name": "documento2.jpg",
            "url": "https://mjgvjpqcdsmvervcxjig.supabase.co/storage/v1/object/public/documents/teste/documento2.jpg",
            "type": "image/jpeg",
            "size": 2048,
            "uploaded_at": "2025-01-27T10:01:00Z"
        }
    ]'::jsonb
)
ON CONFLICT (codigo) DO UPDATE SET
    documents = EXCLUDED.documents,
    updated_at = NOW();

-- 4. VERIFICAR SE O RFI DE TESTE FOI CRIADO
-- =====================================================
SELECT 
    'RFI TESTE CRIADO' as teste,
    id,
    codigo,
    titulo,
    documents,
    jsonb_array_length(documents) as num_documents,
    CASE 
        WHEN jsonb_array_length(documents) > 0 THEN '✅ SUCESSO'
        ELSE '❌ FALHOU'
    END as resultado
FROM rfis 
WHERE codigo = 'RFI-TESTE-001';

-- 5. MENSAGEM DE SUCESSO
-- =====================================================
SELECT 
    '🎉 TESTE CONCLUÍDO!' as resultado,
    'Verifique se o RFI de teste aparece na aplicação' as proximo_passo,
    'Teste o botão olho no RFI-TESTE-001' as acao
FROM (SELECT 1) as dummy; 