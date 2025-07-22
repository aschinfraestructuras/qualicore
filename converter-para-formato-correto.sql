-- =====================================================
-- CONVERTER PARA FORMATO CORRETO - NÃO CONFORMIDADES
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script converte os dados para o formato exato que o frontend espera

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

-- 2. CONVERTER PARA FORMATO CORRETO (nome, url, tamanho)
-- =====================================================

-- Converter anexos_evidencia para formato correto
UPDATE nao_conformidades 
SET anexos_evidencia = CASE 
    WHEN anexos_evidencia IS NULL OR anexos_evidencia = '[]'::jsonb THEN '[]'::jsonb
    WHEN jsonb_typeof(anexos_evidencia) = 'array' THEN 
        CASE 
            WHEN jsonb_array_length(anexos_evidencia) = 0 THEN '[]'::jsonb
            ELSE (
                SELECT jsonb_agg(
                    CASE 
                        WHEN jsonb_typeof(item) = 'string' THEN 
                            jsonb_build_object(
                                'nome', item,
                                'url', '',
                                'tamanho', 0
                            )
                        WHEN jsonb_typeof(item) = 'object' THEN
                            CASE 
                                WHEN item ? 'name' THEN 
                                    jsonb_build_object(
                                        'nome', item->>'name',
                                        'url', COALESCE(item->>'url', ''),
                                        'tamanho', COALESCE((item->>'size')::int, 0)
                                    )
                                WHEN item ? 'nome' THEN item
                                ELSE item
                            END
                        ELSE item
                    END
                )
                FROM jsonb_array_elements(anexos_evidencia) AS item
            )
        END
    ELSE anexos_evidencia
END
WHERE anexos_evidencia IS NOT NULL;

-- Converter anexos_corretiva para formato correto
UPDATE nao_conformidades 
SET anexos_corretiva = CASE 
    WHEN anexos_corretiva IS NULL OR anexos_corretiva = '[]'::jsonb THEN '[]'::jsonb
    WHEN jsonb_typeof(anexos_corretiva) = 'array' THEN 
        CASE 
            WHEN jsonb_array_length(anexos_corretiva) = 0 THEN '[]'::jsonb
            ELSE (
                SELECT jsonb_agg(
                    CASE 
                        WHEN jsonb_typeof(item) = 'string' THEN 
                            jsonb_build_object(
                                'nome', item,
                                'url', '',
                                'tamanho', 0
                            )
                        WHEN jsonb_typeof(item) = 'object' THEN
                            CASE 
                                WHEN item ? 'name' THEN 
                                    jsonb_build_object(
                                        'nome', item->>'name',
                                        'url', COALESCE(item->>'url', ''),
                                        'tamanho', COALESCE((item->>'size')::int, 0)
                                    )
                                WHEN item ? 'nome' THEN item
                                ELSE item
                            END
                        ELSE item
                    END
                )
                FROM jsonb_array_elements(anexos_corretiva) AS item
            )
        END
    ELSE anexos_corretiva
END
WHERE anexos_corretiva IS NOT NULL;

-- Converter anexos_verificacao para formato correto
UPDATE nao_conformidades 
SET anexos_verificacao = CASE 
    WHEN anexos_verificacao IS NULL OR anexos_verificacao = '[]'::jsonb THEN '[]'::jsonb
    WHEN jsonb_typeof(anexos_verificacao) = 'array' THEN 
        CASE 
            WHEN jsonb_array_length(anexos_verificacao) = 0 THEN '[]'::jsonb
            ELSE (
                SELECT jsonb_agg(
                    CASE 
                        WHEN jsonb_typeof(item) = 'string' THEN 
                            jsonb_build_object(
                                'nome', item,
                                'url', '',
                                'tamanho', 0
                            )
                        WHEN jsonb_typeof(item) = 'object' THEN
                            CASE 
                                WHEN item ? 'name' THEN 
                                    jsonb_build_object(
                                        'nome', item->>'name',
                                        'url', COALESCE(item->>'url', ''),
                                        'tamanho', COALESCE((item->>'size')::int, 0)
                                    )
                                WHEN item ? 'nome' THEN item
                                ELSE item
                            END
                        ELSE item
                    END
                )
                FROM jsonb_array_elements(anexos_verificacao) AS item
            )
        END
    ELSE anexos_verificacao
END
WHERE anexos_verificacao IS NOT NULL;

-- 3. VERIFICAR DADOS APÓS CONVERSÃO
-- =====================================================

SELECT 
    'DADOS APÓS CONVERSÃO' as verificação,
    id,
    anexos_evidencia,
    anexos_corretiva,
    anexos_verificacao
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 3;

-- 4. VERIFICAR ESTRUTURA DOS DADOS
-- =====================================================

SELECT 
    'ESTRUTURA DOS DADOS' as verificação,
    id,
    CASE 
        WHEN anexos_evidencia IS NOT NULL AND jsonb_array_length(anexos_evidencia) > 0 THEN 
            'anexos_evidencia: ' || jsonb_array_length(anexos_evidencia) || ' items'
        WHEN anexos_corretiva IS NOT NULL AND jsonb_array_length(anexos_corretiva) > 0 THEN 
            'anexos_corretiva: ' || jsonb_array_length(anexos_corretiva) || ' items'
        WHEN anexos_verificacao IS NOT NULL AND jsonb_array_length(anexos_verificacao) > 0 THEN 
            'anexos_verificacao: ' || jsonb_array_length(anexos_verificacao) || ' items'
        ELSE 'Sem documentos'
    END as info_documentos,
    CASE 
        WHEN anexos_evidencia IS NOT NULL AND jsonb_array_length(anexos_evidencia) > 0 THEN 
            jsonb_pretty(anexos_evidencia)
        WHEN anexos_corretiva IS NOT NULL AND jsonb_array_length(anexos_corretiva) > 0 THEN 
            jsonb_pretty(anexos_corretiva)
        WHEN anexos_verificacao IS NOT NULL AND jsonb_array_length(anexos_verificacao) > 0 THEN 
            jsonb_pretty(anexos_verificacao)
        ELSE '[]'
    END as estrutura_json
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 3;

-- 5. TESTAR ACESSO AOS CAMPOS
-- =====================================================

SELECT 
    'TESTE CAMPOS' as verificação,
    id,
    CASE 
        WHEN anexos_evidencia IS NOT NULL AND jsonb_array_length(anexos_evidencia) > 0 THEN 
            'Primeiro documento: ' || (anexos_evidencia->0->>'nome')
        WHEN anexos_corretiva IS NOT NULL AND jsonb_array_length(anexos_corretiva) > 0 THEN 
            'Primeiro documento: ' || (anexos_corretiva->0->>'nome')
        WHEN anexos_verificacao IS NOT NULL AND jsonb_array_length(anexos_verificacao) > 0 THEN 
            'Primeiro documento: ' || (anexos_verificacao->0->>'nome')
        ELSE 'Sem documentos'
    END as nome_documento
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 3;

-- 6. MENSAGEM DE SUCESSO
-- =====================================================

SELECT 
    '🎉 SUCESSO!' as verificação,
    'Dados convertidos para formato correto (nome, url, tamanho)' as mensagem,
    'Agora os documentos devem aparecer corretamente no frontend' as instrucao,
    'Teste o módulo Não Conformidades' as proximo_passo
FROM (SELECT 1) as dummy; 