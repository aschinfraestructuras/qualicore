-- SOLUÇÃO SIMPLES PARA BUCKET DOCUMENTS
-- Sem usar storage.policies (que não existe)

-- 1. Verificar se o bucket existe
SELECT 'Bucket documents existe:' as info,
       EXISTS (SELECT FROM storage.buckets WHERE name = 'documents') as resultado;

-- 2. Criar bucket se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true, -- IMPORTANTE: bucket público
    10485760, -- 10MB
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Tornar bucket público (se já existir)
UPDATE storage.buckets 
SET public = true 
WHERE name = 'documents';

-- 4. Verificar configuração final
SELECT name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE name = 'documents';

-- 5. Teste: listar buckets existentes
SELECT name, public FROM storage.buckets; 