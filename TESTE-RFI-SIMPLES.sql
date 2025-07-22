-- =====================================================
-- TESTE SIMPLES: RFI sem documentos
-- =====================================================

-- 1. REMOVER RFI DE TESTE ANTERIOR
-- =====================================================

DELETE FROM rfis WHERE codigo = 'RFI-TESTE-001';

-- 2. CRIAR RFI SIMPLES SEM DOCUMENTOS
-- =====================================================

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
    'RFI de Teste SIMPLES',
    'Este é um RFI de teste simples sem documentos',
    'Teste',
    'Teste',
    '2025-01-27',
    'media',
    'pendente',
    100,
    10,
    'Observações de teste simples',
    '[]'::jsonb,  -- Array vazio = sem documentos
    user_info.id
FROM user_info;

-- 3. VERIFICAR RFI CRIADO
-- =====================================================

SELECT 
    'RFI TESTE SIMPLES' as verificação,
    id,
    codigo,
    titulo,
    user_id,
    documents,
    jsonb_array_length(documents) as num_documents,
    CASE 
        WHEN jsonb_array_length(documents) = 0 THEN '✅ PERFEITO - Sem documentos (como esperado)'
        ELSE '⚠️ Tem documentos (inesperado)'
    END as resultado
FROM rfis 
WHERE codigo = 'RFI-TESTE-001';

-- 4. MENSAGEM FINAL
-- =====================================================

SELECT 
    '🎉 RFI-TESTE-001 CRIADO SEM DOCUMENTOS!' as resultado,
    'Agora teste na aplicação' as proximo_passo,
    'Depois testamos upload real' as acao
FROM (SELECT 1) as dummy; 