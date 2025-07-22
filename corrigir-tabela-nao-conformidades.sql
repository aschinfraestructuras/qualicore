-- =====================================================
-- CORREÇÃO DA TABELA NAO_CONFORMIDADES
-- =====================================================

-- 1. Verificar estrutura atual da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se os campos de anexos existem
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades' 
AND table_schema = 'public'
AND column_name IN ('anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'timeline');

-- 3. Adicionar campos de anexos se não existirem
DO $$
BEGIN
    -- Adicionar campo anexos_evidencia se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_evidencia'
    ) THEN
        ALTER TABLE nao_conformidades 
        ADD COLUMN anexos_evidencia TEXT[] DEFAULT '{}';
        RAISE NOTICE 'Campo anexos_evidencia adicionado';
    ELSE
        RAISE NOTICE 'Campo anexos_evidencia já existe';
    END IF;

    -- Adicionar campo anexos_corretiva se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_corretiva'
    ) THEN
        ALTER TABLE nao_conformidades 
        ADD COLUMN anexos_corretiva TEXT[] DEFAULT '{}';
        RAISE NOTICE 'Campo anexos_corretiva adicionado';
    ELSE
        RAISE NOTICE 'Campo anexos_corretiva já existe';
    END IF;

    -- Adicionar campo anexos_verificacao se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_verificacao'
    ) THEN
        ALTER TABLE nao_conformidades 
        ADD COLUMN anexos_verificacao TEXT[] DEFAULT '{}';
        RAISE NOTICE 'Campo anexos_verificacao adicionado';
    ELSE
        RAISE NOTICE 'Campo anexos_verificacao já existe';
    END IF;

    -- Adicionar campo timeline se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'timeline'
    ) THEN
        ALTER TABLE nao_conformidades 
        ADD COLUMN timeline JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Campo timeline adicionado';
    ELSE
        RAISE NOTICE 'Campo timeline já existe';
    END IF;
END $$;

-- 4. Verificar se RLS está ativo
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'nao_conformidades';

-- 5. Ativar RLS se não estiver ativo
ALTER TABLE nao_conformidades ENABLE ROW LEVEL SECURITY;

-- 6. Verificar políticas RLS existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'nao_conformidades';

-- 7. Criar políticas RLS se não existirem
DO $$
BEGIN
    -- Política para SELECT
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'nao_conformidades' 
        AND policyname = 'nao_conformidades_select_policy'
    ) THEN
        CREATE POLICY nao_conformidades_select_policy ON nao_conformidades
        FOR SELECT USING (auth.uid() = user_id);
        RAISE NOTICE 'Política SELECT criada';
    ELSE
        RAISE NOTICE 'Política SELECT já existe';
    END IF;

    -- Política para INSERT
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'nao_conformidades' 
        AND policyname = 'nao_conformidades_insert_policy'
    ) THEN
        CREATE POLICY nao_conformidades_insert_policy ON nao_conformidades
        FOR INSERT WITH CHECK (auth.uid() = user_id);
        RAISE NOTICE 'Política INSERT criada';
    ELSE
        RAISE NOTICE 'Política INSERT já existe';
    END IF;

    -- Política para UPDATE
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'nao_conformidades' 
        AND policyname = 'nao_conformidades_update_policy'
    ) THEN
        CREATE POLICY nao_conformidades_update_policy ON nao_conformidades
        FOR UPDATE USING (auth.uid() = user_id);
        RAISE NOTICE 'Política UPDATE criada';
    ELSE
        RAISE NOTICE 'Política UPDATE já existe';
    END IF;

    -- Política para DELETE
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'nao_conformidades' 
        AND policyname = 'nao_conformidades_delete_policy'
    ) THEN
        CREATE POLICY nao_conformidades_delete_policy ON nao_conformidades
        FOR DELETE USING (auth.uid() = user_id);
        RAISE NOTICE 'Política DELETE criada';
    ELSE
        RAISE NOTICE 'Política DELETE já existe';
    END IF;
END $$;

-- 8. Verificar estrutura final da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 9. Testar inserção de dados
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
    'NC-TEST-001',
    'material',
    'media',
    'inspecao',
    CURRENT_DATE,
    'Teste de não conformidade',
    'medio',
    'Área de teste',
    'Teste',
    ARRAY['evidencia1.pdf', 'evidencia2.jpg'],
    ARRAY['corretiva1.pdf'],
    ARRAY['verificacao1.pdf'],
    '[{"id": "1", "data": "2024-01-01T00:00:00Z", "tipo": "deteccao", "responsavel": "Teste", "descricao": "Deteção inicial"}]'::jsonb,
    auth.uid()
) ON CONFLICT (codigo, user_id) DO NOTHING;

-- 10. Verificar se a inserção funcionou
SELECT 
    id,
    codigo,
    descricao,
    anexos_evidencia,
    anexos_corretiva,
    anexos_verificacao,
    timeline
FROM nao_conformidades 
WHERE codigo = 'NC-TEST-001'
ORDER BY created_at DESC
LIMIT 1;

-- 11. Limpar dados de teste
DELETE FROM nao_conformidades WHERE codigo = 'NC-TEST-001';

-- 12. Verificar contagem final
SELECT COUNT(*) as total_nao_conformidades FROM nao_conformidades; 