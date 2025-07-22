-- Verificar se o bucket 'documents' existe
SELECT name, public FROM storage.buckets WHERE name = 'documents';

-- Se não existir, criar o bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Verificar as políticas do bucket
SELECT * FROM storage.policies WHERE bucket_id = 'documents';

-- Criar políticas para o bucket documents (se não existirem)
-- Política para inserção (upload)
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to upload documents',
    'documents',
    'INSERT',
    '(auth.role() = ''authenticated'')'
) ON CONFLICT (name, bucket_id, operation) DO NOTHING;

-- Política para seleção (download/view)
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to view documents',
    'documents',
    'SELECT',
    '(auth.role() = ''authenticated'')'
) ON CONFLICT (name, bucket_id, operation) DO NOTHING;

-- Política para atualização
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to update documents',
    'documents',
    'UPDATE',
    '(auth.role() = ''authenticated'')'
) ON CONFLICT (name, bucket_id, operation) DO NOTHING;

-- Política para remoção
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to delete documents',
    'documents',
    'DELETE',
    '(auth.role() = ''authenticated'')'
) ON CONFLICT (name, bucket_id, operation) DO NOTHING; 