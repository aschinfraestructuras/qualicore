SELECT 'Bucket documents existe:' as info,
       EXISTS (SELECT FROM storage.buckets WHERE name = 'documents') as resultado;

SELECT name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE name = 'documents'; 