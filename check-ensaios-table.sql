-- Verificar se a tabela ensaios existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'ensaios'
) as table_exists;

-- Se existir, mostrar a estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'ensaios'
ORDER BY ordinal_position;

-- Verificar se há dados na tabela
SELECT COUNT(*) as total_ensaios FROM ensaios;

-- Verificar as primeiras linhas (se houver dados)
SELECT * FROM ensaios LIMIT 5; 