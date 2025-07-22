SELECT 'Tabela ensaios existe:' as info, 
       EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ensaios') as resultado;

SELECT 'Bucket documents existe:' as info,
       EXISTS (SELECT FROM storage.buckets WHERE name = 'documents') as resultado;

SELECT 'Politicas de storage configuradas:' as info,
       COUNT(*) as total_politicas
FROM storage.policies WHERE bucket_id = 'documents';

SELECT 'Colunas da tabela ensaios:' as info,
       COUNT(*) as total_colunas
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'ensaios'; 