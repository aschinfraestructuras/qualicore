-- =====================================================
-- RESOLVER URLs DOS DOCUMENTOS - NÃO CONFORMIDADES
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script resolve o problema das URLs vazias dos documentos

-- 1. VERIFICAR DADOS ATUAIS
-- =====================================================

SELECT 
    'DADOS ATUAIS' as verificação,
    id,
    anexos_evidencia,
    anexos_corretiva,
    anexos_verificacao
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 3;

-- 2. LIMPAR DOCUMENTOS SEM URL (NÃO EXISTEM REALMENTE)
-- =====================================================

-- Limpar anexos_evidencia sem URL
UPDATE nao_conformidades 
SET anexos_evidencia = '[]'::jsonb
WHERE anexos_evidencia IS NOT NULL 
AND (
    anexos_evidencia = '[]'::jsonb 
    OR jsonb_array_length(anexos_evidencia) = 0
    OR (
        jsonb_array_length(anexos_evidencia) > 0 
        AND (anexos_evidencia->0->>'url') = ''
    )
);

-- Limpar anexos_corretiva sem URL
UPDATE nao_conformidades 
SET anexos_corretiva = '[]'::jsonb
WHERE anexos_corretiva IS NOT NULL 
AND (
    anexos_corretiva = '[]'::jsonb 
    OR jsonb_array_length(anexos_corretiva) = 0
    OR (
        jsonb_array_length(anexos_corretiva) > 0 
        AND (anexos_corretiva->0->>'url') = ''
    )
);

-- Limpar anexos_verificacao sem URL
UPDATE nao_conformidades 
SET anexos_verificacao = '[]'::jsonb
WHERE anexos_verificacao IS NOT NULL 
AND (
    anexos_verificacao = '[]'::jsonb 
    OR jsonb_array_length(anexos_verificacao) = 0
    OR (
        jsonb_array_length(anexos_verificacao) > 0 
        AND (anexos_verificacao->0->>'url') = ''
    )
);

-- 3. VERIFICAR DADOS APÓS LIMPEZA
-- =====================================================

SELECT 
    'DADOS APÓS LIMPEZA' as verificação,
    id,
    anexos_evidencia,
    anexos_corretiva,
    anexos_verificacao
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 3;

-- 4. VERIFICAR SE EXISTEM DOCUMENTOS VÁLIDOS
-- =====================================================

SELECT 
    'DOCUMENTOS VÁLIDOS' as verificação,
    id,
    CASE 
        WHEN anexos_evidencia IS NOT NULL AND jsonb_array_length(anexos_evidencia) > 0 THEN 
            'anexos_evidencia: ' || jsonb_array_length(anexos_evidencia) || ' items'
        WHEN anexos_corretiva IS NOT NULL AND jsonb_array_length(anexos_corretiva) > 0 THEN 
            'anexos_corretiva: ' || jsonb_array_length(anexos_corretiva) || ' items'
        WHEN anexos_verificacao IS NOT NULL AND jsonb_array_length(anexos_verificacao) > 0 THEN 
            'anexos_verificacao: ' || jsonb_array_length(anexos_verificacao) || ' items'
        ELSE 'Sem documentos válidos'
    END as status_documentos
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 5;

-- 5. MENSAGEM DE SUCESSO
-- =====================================================

SELECT 
    '🎉 SUCESSO!' as verificação,
    'Documentos sem URL foram removidos' as mensagem,
    'Agora pode carregar novos documentos reais' as instrucao,
    'Teste carregar um novo documento no módulo Não Conformidades' as proximo_passo
FROM (SELECT 1) as dummy; 