-- =====================================================
-- LIMPAR DADOS DAS NÃO CONFORMIDADES
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- 1. VERIFICAR DADOS ATUAIS
SELECT 
    'DADOS ATUAIS' as verificação,
    id,
    codigo,
    anexos_evidencia,
    anexos_corretiva,
    anexos_verificacao
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 3;

-- 2. LIMPAR TODOS OS ANEXOS (DEFINIR COMO ARRAYS VAZIOS)
UPDATE nao_conformidades 
SET 
    anexos_evidencia = '[]'::jsonb,
    anexos_corretiva = '[]'::jsonb,
    anexos_verificacao = '[]'::jsonb
WHERE id IS NOT NULL;

-- 3. VERIFICAR DADOS APÓS LIMPEZA
SELECT 
    'DADOS APÓS LIMPEZA' as verificação,
    id,
    codigo,
    anexos_evidencia,
    anexos_corretiva,
    anexos_verificacao
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 3;

-- 4. MENSAGEM DE SUCESSO
SELECT 
    '🎉 SUCESSO!' as verificação,
    'Todos os anexos foram limpos' as mensagem,
    'Agora pode carregar novos documentos reais' as instrucao,
    'Teste o formulário de Não Conformidades' as proximo_passo
FROM (SELECT 1) as dummy; 