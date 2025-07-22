-- Verificar estrutura atual da tabela ensaios
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'ensaios' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar se a tabela tem as colunas necessárias
-- Se não tiver, vamos adicionar as que faltam

-- Adicionar coluna seguimento se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'ensaios' 
        AND column_name = 'seguimento'
    ) THEN
        ALTER TABLE ensaios ADD COLUMN seguimento JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Coluna seguimento adicionada';
    ELSE
        RAISE NOTICE 'Coluna seguimento já existe';
    END IF;
END $$;

-- Adicionar coluna contextoAdicional se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'ensaios' 
        AND column_name = 'contextoAdicional'
    ) THEN
        ALTER TABLE ensaios ADD COLUMN "contextoAdicional" JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Coluna contextoAdicional adicionada';
    ELSE
        RAISE NOTICE 'Coluna contextoAdicional já existe';
    END IF;
END $$;

-- Adicionar coluna documents se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'ensaios' 
        AND column_name = 'documents'
    ) THEN
        ALTER TABLE ensaios ADD COLUMN documents JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Coluna documents adicionada';
    ELSE
        RAISE NOTICE 'Coluna documents já existe';
    END IF;
END $$;

-- Verificar estrutura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'ensaios' 
AND table_schema = 'public'
ORDER BY ordinal_position; 