-- Verificar estrutura da tabela ensaios
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'ensaios' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar se existe coluna descricao
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'ensaios' 
AND table_schema = 'public'
AND column_name = 'descricao';

-- Verificar dados de exemplo
SELECT * FROM ensaios LIMIT 1; 