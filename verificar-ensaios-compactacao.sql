SELECT 'Tabela ensaios_compactacao existe:' as info, 
       EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ensaios_compactacao') as resultado;

SELECT 'Colunas da tabela ensaios_compactacao:' as info,
       COUNT(*) as total_colunas
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'ensaios_compactacao';

SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'ensaios_compactacao'
ORDER BY ordinal_position; 