-- Criar bucket 'documents' se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true,
    10485760, -- 10MB
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Remover políticas existentes (se houver)
DELETE FROM storage.policies WHERE bucket_id = 'documents';

-- Criar políticas para o bucket documents
-- Política para inserção (upload)
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to upload documents',
    'documents',
    'INSERT',
    '(auth.role() = ''authenticated'')'
);

-- Política para seleção (download/view)
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to view documents',
    'documents',
    'SELECT',
    '(auth.role() = ''authenticated'')'
);

-- Política para atualização
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to update documents',
    'documents',
    'UPDATE',
    '(auth.role() = ''authenticated'')'
);

-- Política para remoção
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to delete documents',
    'documents',
    'DELETE',
    '(auth.role() = ''authenticated'')'
);

-- Verificar se o bucket foi criado
SELECT name, public, file_size_limit FROM storage.buckets WHERE name = 'documents';

-- Verificar as políticas criadas
SELECT name, operation, definition FROM storage.policies WHERE bucket_id = 'documents'; 