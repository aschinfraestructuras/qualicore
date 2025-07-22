-- =====================================================
-- ADICIONAR CAMPOS DE ANEXOS À TABELA NAO_CONFORMIDADES
-- =====================================================

-- 1. Verificar campos existentes relacionados a anexos
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades' 
AND table_schema = 'public'
AND column_name LIKE '%anexo%' OR column_name LIKE '%document%' OR column_name = 'timeline'
ORDER BY column_name;

-- 2. Adicionar campos de anexos se não existirem
DO $$
BEGIN
    -- Adicionar campo anexos_evidencia
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_evidencia'
    ) THEN
        ALTER TABLE nao_conformidades 
        ADD COLUMN anexos_evidencia TEXT[] DEFAULT '{}';
        RAISE NOTICE '✅ Campo anexos_evidencia adicionado';
    ELSE
        RAISE NOTICE 'ℹ️ Campo anexos_evidencia já existe';
    END IF;

    -- Adicionar campo anexos_corretiva
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_corretiva'
    ) THEN
        ALTER TABLE nao_conformidades 
        ADD COLUMN anexos_corretiva TEXT[] DEFAULT '{}';
        RAISE NOTICE '✅ Campo anexos_corretiva adicionado';
    ELSE
        RAISE NOTICE 'ℹ️ Campo anexos_corretiva já existe';
    END IF;

    -- Adicionar campo anexos_verificacao
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_verificacao'
    ) THEN
        ALTER TABLE nao_conformidades 
        ADD COLUMN anexos_verificacao TEXT[] DEFAULT '{}';
        RAISE NOTICE '✅ Campo anexos_verificacao adicionado';
    ELSE
        RAISE NOTICE 'ℹ️ Campo anexos_verificacao já existe';
    END IF;

    -- Adicionar campo timeline
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'timeline'
    ) THEN
        ALTER TABLE nao_conformidades 
        ADD COLUMN timeline JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE '✅ Campo timeline adicionado';
    ELSE
        RAISE NOTICE 'ℹ️ Campo timeline já existe';
    END IF;
END $$;

-- 3. Verificar estrutura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades' 
AND table_schema = 'public'
AND column_name IN ('anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'timeline', 'documents')
ORDER BY column_name;

-- 4. Testar inserção com os novos campos
INSERT INTO nao_conformidades (
    codigo,
    tipo,
    severidade,
    categoria,
    data_deteccao,
    descricao,
    impacto,
    area_afetada,
    responsavel_deteccao,
    anexos_evidencia,
    anexos_corretiva,
    anexos_verificacao,
    timeline,
    user_id
) VALUES (
    'NC-TEST-ANEXOS-001',
    'material',
    'media',
    'inspecao',
    CURRENT_DATE,
    'Teste com anexos',
    'medio',
    'Área de teste',
    'Teste',
    ARRAY['evidencia1.pdf', 'evidencia2.jpg'],
    ARRAY['corretiva1.pdf'],
    ARRAY['verificacao1.pdf'],
    '[{"id": "1", "data": "2024-01-01T00:00:00Z", "tipo": "deteccao", "responsavel": "Teste", "descricao": "Deteção inicial"}]'::jsonb,
    auth.uid()
);

-- 5. Verificar se a inserção funcionou
SELECT 
    id,
    codigo,
    descricao,
    anexos_evidencia,
    anexos_corretiva,
    anexos_verificacao,
    timeline
FROM nao_conformidades 
WHERE codigo = 'NC-TEST-ANEXOS-001'
ORDER BY created_at DESC
LIMIT 1;

-- 6. Limpar dados de teste
DELETE FROM nao_conformidades WHERE codigo = 'NC-TEST-ANEXOS-001';

-- 7. Verificar contagem final
SELECT COUNT(*) as total_nao_conformidades FROM nao_conformidades; 