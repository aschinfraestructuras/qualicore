-- =====================================================
-- CORREÇÃO: RFI-TESTE-001 com user_id
-- =====================================================

-- 1. VERIFICAR USUÁRIO ATUAL
-- =====================================================

-- Verificar se há usuários na tabela auth.users
SELECT 
    'USUÁRIOS EXISTENTES' as verificação,
    COUNT(*) as total_usuarios
FROM auth.users;

-- Mostrar o primeiro usuário (será usado para o RFI de teste)
SELECT 
    'PRIMEIRO USUÁRIO' as verificação,
    id,
    email,
    created_at
FROM auth.users 
LIMIT 1;

-- 2. REMOVER RFI DE TESTE ANTERIOR
-- =====================================================

DELETE FROM rfis WHERE codigo = 'RFI-TESTE-001';

-- 3. CRIAR RFI DE TESTE COM USER_ID
-- =====================================================

-- Pegar o ID do primeiro usuário
WITH user_info AS (
    SELECT id FROM auth.users LIMIT 1
)
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
    impacto_custo,
    impacto_prazo,
    observacoes,
    documents,
    user_id
) 
SELECT 
    'RFI-TESTE-001',
    'RFI-TESTE-001',
    'RFI de Teste com Documentos',
    'Este é um RFI de teste para verificar se o campo documents funciona corretamente',
    'Teste',
    'Teste',
    '2025-01-27',
    'media',
    'pendente',
    100,
    10,
    'Observações de teste',
    '[
        {
            "id": "ensaio/temp_1706361600000/documento1.pdf",
            "name": "documento1.pdf",
            "url": "https://mjgvjpqcdsmvervcxjig.supabase.co/storage/v1/object/public/documents/ensaio/temp_1706361600000/documento1.pdf",
            "type": "application/pdf",
            "size": 1024,
            "uploaded_at": "2025-01-27T10:00:00Z"
        },
        {
            "id": "ensaio/temp_1706361600000/documento2.jpg",
            "name": "documento2.jpg",
            "url": "https://mjgvjpqcdsmvervcxjig.supabase.co/storage/v1/object/public/documents/ensaio/temp_1706361600000/documento2.jpg",
            "type": "image/jpeg",
            "size": 2048,
            "uploaded_at": "2025-01-27T10:01:00Z"
        }
    ]'::jsonb,
    user_info.id
FROM user_info;

-- 4. VERIFICAR RFI CRIADO
-- =====================================================

SELECT 
    'RFI TESTE CRIADO' as verificação,
    id,
    codigo,
    titulo,
    user_id,
    documents,
    jsonb_array_length(documents) as num_documents,
    CASE 
        WHEN jsonb_array_length(documents) = 2 THEN '✅ PERFEITO - 2 documentos'
        WHEN jsonb_array_length(documents) > 0 THEN '⚠️ OK - Tem documentos'
        ELSE '❌ PROBLEMA - Sem documentos'
    END as resultado
FROM rfis 
WHERE codigo = 'RFI-TESTE-001';

-- 5. VERIFICAR TODOS OS RFIs DO USUÁRIO
-- =====================================================

WITH user_info AS (
    SELECT id FROM auth.users LIMIT 1
)
SELECT 
    'RFIs DO USUÁRIO' as verificação,
    COUNT(*) as total_rfis,
    COUNT(CASE WHEN documents IS NOT NULL AND documents != '[]'::jsonb THEN 1 END) as com_documentos,
    COUNT(CASE WHEN documents IS NULL OR documents = '[]'::jsonb THEN 1 END) as sem_documentos
FROM rfis r, user_info u
WHERE r.user_id = u.id;

-- 6. MENSAGEM FINAL
-- =====================================================

SELECT 
    '🎉 RFI-TESTE-001 CRIADO COM USER_ID!' as resultado,
    'Agora deve aparecer na aplicação' as proximo_passo,
    'Teste o botão olho' as acao
FROM (SELECT 1) as dummy; 