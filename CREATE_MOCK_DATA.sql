-- Script para criar dados mock nas tabelas relacionadas
-- Garante que o módulo Armaduras funcione completamente

-- 1. Inserir fornecedores mock
INSERT INTO fornecedores (
    id,
    nome,
    nif,
    morada,
    telefone,
    email,
    contacto_principal,
    tipo_fornecedor,
    estado,
    user_id,
    created_at,
    updated_at
) VALUES 
(
    gen_random_uuid(),
    'Metalurgica Silva',
    '123456789',
    'Rua das Indústrias, 123, Lisboa',
    '+351 213 456 789',
    'info@metalurgicasilva.pt',
    'João Silva',
    'metalurgica',
    'ativo',
    '00000000-0000-0000-0000-000000000000',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Construções Lda',
    '987654321',
    'Avenida da Construção, 456, Porto',
    '+351 225 789 123',
    'geral@construcoes.pt',
    'Maria Santos',
    'construcao',
    'ativo',
    '00000000-0000-0000-0000-000000000000',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Metalurgica Costa',
    '456789123',
    'Rua do Aço, 789, Braga',
    '+351 253 123 456',
    'contacto@metalurgicacosta.pt',
    'Pedro Costa',
    'metalurgica',
    'ativo',
    '00000000-0000-0000-0000-000000000000',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Construções Rápidas',
    '789123456',
    'Avenida da Velocidade, 321, Coimbra',
    '+351 239 456 789',
    'info@construcoesrapidas.pt',
    'Ana Ferreira',
    'construcao',
    'ativo',
    '00000000-0000-0000-0000-000000000000',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Aços Express',
    '321654987',
    'Rua Expressa, 654, Aveiro',
    '+351 234 789 123',
    'geral@acosexpress.pt',
    'Carlos Oliveira',
    'metalurgica',
    'ativo',
    '00000000-0000-0000-0000-000000000000',
    NOW(),
    NOW()
)
ON CONFLICT (nif) DO NOTHING;

-- 2. Inserir obras mock
INSERT INTO obras (
    id,
    nome,
    localizacao,
    cliente,
    data_inicio,
    data_fim_prevista,
    orcamento,
    estado,
    tipo_obra,
    responsavel,
    user_id,
    created_at,
    updated_at
) VALUES 
(
    gen_random_uuid(),
    'Edifício Residencial Lisboa Centro',
    'Lisboa, Portugal',
    'Promotora Lisboa Lda',
    '2024-01-01',
    '2025-06-30',
    2500000.00,
    'em_execucao',
    'residencial',
    'João Silva',
    '00000000-0000-0000-0000-000000000000',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Centro Comercial Porto Norte',
    'Porto, Portugal',
    'Shopping Norte SA',
    '2024-02-01',
    '2025-08-31',
    3500000.00,
    'em_execucao',
    'comercial',
    'Maria Santos',
    '00000000-0000-0000-0000-000000000000',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Ponte Pedonal Braga',
    'Braga, Portugal',
    'Câmara Municipal de Braga',
    '2024-03-01',
    '2024-12-31',
    800000.00,
    'em_execucao',
    'infraestrutura',
    'Pedro Costa',
    '00000000-0000-0000-0000-000000000000',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Hospital Universitário Coimbra',
    'Coimbra, Portugal',
    'Centro Hospitalar de Coimbra',
    '2024-04-01',
    '2026-03-31',
    5000000.00,
    'em_execucao',
    'saude',
    'Ana Ferreira',
    '00000000-0000-0000-0000-000000000000',
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Estação Ferroviária Aveiro',
    'Aveiro, Portugal',
    'Infraestruturas de Portugal',
    '2024-05-01',
    '2025-11-30',
    1200000.00,
    'em_execucao',
    'infraestrutura',
    'Carlos Oliveira',
    '00000000-0000-0000-0000-000000000000',
    NOW(),
    NOW()
)
ON CONFLICT (nome) DO NOTHING;

-- 3. Verificar dados inseridos
SELECT 'Fornecedores:' as tipo, COUNT(*) as total FROM fornecedores
UNION ALL
SELECT 'Obras:' as tipo, COUNT(*) as total FROM obras
UNION ALL
SELECT 'Armaduras:' as tipo, COUNT(*) as total FROM armaduras;

-- 4. Mostrar alguns registos de exemplo
SELECT '=== FORNECEDORES ===' as info;
SELECT nome, nif, tipo_fornecedor, estado FROM fornecedores LIMIT 3;

SELECT '=== OBRAS ===' as info;
SELECT nome, localizacao, estado, orcamento FROM obras LIMIT 3;

SELECT '=== ARMADURAS ===' as info;
SELECT codigo, tipo, fabricante, estado, peso_total FROM armaduras LIMIT 3;
