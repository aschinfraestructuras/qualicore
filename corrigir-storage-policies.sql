-- CORRIGIR POLÍTICAS DO BUCKET DOCUMENTS
-- O erro acontece no upload de documentos, não no ensaio

-- 1. Verificar se o bucket existe
SELECT 'Bucket documents existe:' as info,
       EXISTS (SELECT FROM storage.buckets WHERE name = 'documents') as resultado;

-- 2. Verificar políticas existentes do bucket
SELECT 'Políticas existentes:' as info, COUNT(*) as total
FROM storage.policies WHERE bucket_id = 'documents';

-- 3. Remover políticas existentes
DELETE FROM storage.policies WHERE bucket_id = 'documents';

-- 4. Criar bucket se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true,
    10485760, -- 10MB
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 5. Criar políticas permissivas para desenvolvimento
-- Política para inserção (upload)
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow all uploads',
    'documents',
    'INSERT',
    '(true)'
);

-- Política para seleção (download/view)
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow all downloads',
    'documents',
    'SELECT',
    '(true)'
);

-- Política para atualização
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow all updates',
    'documents',
    'UPDATE',
    '(true)'
);

-- Política para remoção
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow all deletes',
    'documents',
    'DELETE',
    '(true)'
);

-- 6. Verificar se as políticas foram criadas
SELECT name, operation, definition FROM storage.policies WHERE bucket_id = 'documents';

-- 7. Verificar bucket final
SELECT name, public, file_size_limit FROM storage.buckets WHERE name = 'documents'; 