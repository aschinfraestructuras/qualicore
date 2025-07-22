INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true,
    10485760,
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

DELETE FROM storage.policies WHERE bucket_id = 'documents';

INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to upload documents',
    'documents',
    'INSERT',
    '(auth.role() = ''authenticated'')'
);

INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to view documents',
    'documents',
    'SELECT',
    '(auth.role() = ''authenticated'')'
);

INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to update documents',
    'documents',
    'UPDATE',
    '(auth.role() = ''authenticated'')'
);

INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to delete documents',
    'documents',
    'DELETE',
    '(auth.role() = ''authenticated'')'
);

SELECT name, public, file_size_limit FROM storage.buckets WHERE name = 'documents';

SELECT name, operation, definition FROM storage.policies WHERE bucket_id = 'documents'; 