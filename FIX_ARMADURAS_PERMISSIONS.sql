-- Script para corrigir permissões e inserir dados mock na tabela armaduras
-- Resolve os erros 403 (Forbidden) e cria dados para testar o dashboard

-- 1. Desabilitar temporariamente RLS para inserir dados
ALTER TABLE armaduras DISABLE ROW LEVEL SECURITY;

-- 2. Limpar dados existentes (opcional - comentar se quiser manter)
-- DELETE FROM armaduras;

-- 3. Inserir dados mock completos
INSERT INTO armaduras (
    codigo, 
    tipo, 
    diametro, 
    comprimento, 
    quantidade, 
    peso_unitario, 
    peso_total,
    numero_colada, 
    numero_guia_remessa, 
    fabricante, 
    fornecedor_aco_obra,
    local_aplicacao, 
    zona_aplicacao, 
    lote_aplicacao,
    zona, 
    estado, 
    data_rececao, 
    responsavel, 
    user_id,
    observacoes,
    certificado_qualidade,
    data_instalacao
) VALUES 
-- Armadura 1 - Feixe para Fundações
(
    'ARM-2024-0001', 
    'feixe', 
    12.0, 
    6.0, 
    50, 
    0.888, 
    266.4,
    'COL-2024-001', 
    'GR-2024-001', 
    'Aços Portugal', 
    'Metalurgica Silva',
    'Pilar P1', 
    'Zona A - Fundações', 
    'LOTE-001',
    'Fundações', 
    'aprovado', 
    '2024-01-15', 
    'João Silva', 
    '00000000-0000-0000-0000-000000000000',
    'Armadura de alta qualidade para fundações principais',
    'CERT-2024-001',
    '2024-01-20'
),
-- Armadura 2 - Estribo para Estrutura
(
    'ARM-2024-0002', 
    'estribo', 
    8.0, 
    0.5, 
    200, 
    0.395, 
    39.5,
    'COL-2024-002', 
    'GR-2024-002', 
    'Ferro & Aço', 
    'Construções Lda',
    'Viga V1', 
    'Zona B - Estrutura', 
    'LOTE-002',
    'Estrutura', 
    'pendente', 
    '2024-01-20', 
    'Maria Santos', 
    '00000000-0000-0000-0000-000000000000',
    'Estribos para vigas principais',
    'CERT-2024-002',
    NULL
),
-- Armadura 3 - Armadura Positiva para Cobertura
(
    'ARM-2024-0003', 
    'armadura_positiva', 
    16.0, 
    8.0, 
    30, 
    1.579, 
    378.96,
    'COL-2024-003', 
    'GR-2024-003', 
    'Aços do Norte', 
    'Metalurgica Costa',
    'Laje L1', 
    'Zona C - Cobertura', 
    'LOTE-003',
    'Cobertura', 
    'em_analise', 
    '2024-01-25', 
    'Pedro Costa', 
    '00000000-0000-0000-0000-000000000000',
    'Armadura positiva para laje de cobertura',
    'CERT-2024-003',
    NULL
),
-- Armadura 4 - Cintas para Piso 1
(
    'ARM-2024-0004', 
    'cintas', 
    10.0, 
    1.2, 
    100, 
    0.617, 
    74.04,
    'COL-2024-004', 
    'GR-2024-004', 
    'Aços do Sul', 
    'Construções Rápidas',
    'Pilar P2', 
    'Zona D - Piso 1', 
    'LOTE-004',
    'Piso 1', 
    'instalado', 
    '2024-01-30', 
    'Ana Ferreira', 
    '00000000-0000-0000-0000-000000000000',
    'Cintas para pilares do piso 1',
    'CERT-2024-004',
    '2024-02-05'
),
-- Armadura 5 - Armadura Negativa para Piso 2
(
    'ARM-2024-0005', 
    'armadura_negativa', 
    14.0, 
    7.0, 
    40, 
    1.208, 
    338.24,
    'COL-2024-005', 
    'GR-2024-005', 
    'Metalurgica Central', 
    'Aços Express',
    'Laje L2', 
    'Zona E - Piso 2', 
    'LOTE-005',
    'Piso 2', 
    'concluido', 
    '2024-02-05', 
    'Carlos Oliveira', 
    '00000000-0000-0000-0000-000000000000',
    'Armadura negativa para laje do piso 2',
    'CERT-2024-005',
    '2024-02-10'
),
-- Armadura 6 - Feixe para Fundações Secundárias
(
    'ARM-2024-0006', 
    'feixe', 
    10.0, 
    5.0, 
    75, 
    0.617, 
    231.375,
    'COL-2024-006', 
    'GR-2024-006', 
    'Aços Portugal', 
    'Metalurgica Silva',
    'Pilar P3', 
    'Zona A - Fundações', 
    'LOTE-006',
    'Fundações', 
    'aprovado', 
    '2024-02-10', 
    'João Silva', 
    '00000000-0000-0000-0000-000000000000',
    'Feixes para fundações secundárias',
    'CERT-2024-006',
    '2024-02-15'
),
-- Armadura 7 - Estribo para Estrutura Secundária
(
    'ARM-2024-0007', 
    'estribo', 
    6.0, 
    0.4, 
    150, 
    0.222, 
    13.32,
    'COL-2024-007', 
    'GR-2024-007', 
    'Ferro & Aço', 
    'Construções Lda',
    'Viga V2', 
    'Zona B - Estrutura', 
    'LOTE-007',
    'Estrutura', 
    'pendente', 
    '2024-02-15', 
    'Maria Santos', 
    '00000000-0000-0000-0000-000000000000',
    'Estribos para vigas secundárias',
    'CERT-2024-007',
    NULL
),
-- Armadura 8 - Outro tipo
(
    'ARM-2024-0008', 
    'outro', 
    20.0, 
    10.0, 
    25, 
    2.466, 
    616.5,
    'COL-2024-008', 
    'GR-2024-008', 
    'Aços do Norte', 
    'Metalurgica Costa',
    'Pilar Especial', 
    'Zona F - Especial', 
    'LOTE-008',
    'Especial', 
    'reprovado', 
    '2024-02-20', 
    'Pedro Costa', 
    '00000000-0000-0000-0000-000000000000',
    'Armadura especial para pilar de carga elevada',
    'CERT-2024-008',
    NULL
)
ON CONFLICT (codigo) DO NOTHING;

-- 4. Reabilitar RLS com políticas corretas
ALTER TABLE armaduras ENABLE ROW LEVEL SECURITY;

-- 5. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view their own armaduras" ON armaduras;
DROP POLICY IF EXISTS "Users can create armaduras" ON armaduras;
DROP POLICY IF EXISTS "Users can update their own armaduras" ON armaduras;
DROP POLICY IF EXISTS "Users can delete their own armaduras" ON armaduras;

-- 6. Criar políticas mais permissivas para desenvolvimento
-- Política para permitir leitura de todos os registos
CREATE POLICY "Allow read access to all armaduras" ON armaduras
    FOR SELECT USING (true);

-- Política para permitir inserção
CREATE POLICY "Allow insert access to armaduras" ON armaduras
    FOR INSERT WITH CHECK (true);

-- Política para permitir atualização
CREATE POLICY "Allow update access to armaduras" ON armaduras
    FOR UPDATE USING (true);

-- Política para permitir eliminação
CREATE POLICY "Allow delete access to armaduras" ON armaduras
    FOR DELETE USING (true);

-- 7. Verificar se os dados foram inseridos
SELECT 
    codigo,
    tipo,
    diametro,
    peso_total,
    estado,
    fabricante,
    numero_colada
FROM armaduras 
ORDER BY created_at;

-- 8. Verificar estatísticas
SELECT * FROM armaduras_stats;

-- 9. Testar função de estatísticas detalhadas
SELECT * FROM get_armaduras_detailed_stats();
