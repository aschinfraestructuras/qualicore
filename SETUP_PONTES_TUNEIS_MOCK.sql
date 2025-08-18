-- Script para adicionar dados mock para Pontes e Túneis
-- Execute este script na Supabase SQL Editor

-- Desabilitar RLS temporariamente
ALTER TABLE pontes_tuneis DISABLE ROW LEVEL SECURITY;
ALTER TABLE inspecoes_pontes_tuneis DISABLE ROW LEVEL SECURITY;

-- Inserir dados mock para pontes e túneis
INSERT INTO pontes_tuneis (
  id, codigo, tipo, categoria, localizacao, km_inicial, km_final, 
  estado, fabricante, modelo, data_construcao, status_operacional, 
  observacoes, parametros, ultima_inspecao, proxima_inspecao, responsavel, created_at, updated_at
) VALUES 
(
  gen_random_uuid(), 'PT-001', 'PONTE', 'ESTRUTURAL', 'Rio Douro, Porto', 15.5, 15.8,
  'ATIVO', 'Construtora Nacional', 'Ponte Metálica', '2020-03-15',
  'OPERACIONAL', 'Ponte principal sobre o Rio Douro', 
  '{"comprimento": 350, "largura": 12, "altura": 25, "capacidade_carga": 50}',
  '2024-01-15', '2024-07-15', 'Eng. João Silva',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'TN-001', 'TUNEL', 'GEOTECNICA', 'Serra da Estrela', 45.2, 47.8,
  'ATIVO', 'Túneis Portugal', 'Túnel Escavado', '2019-08-20',
  'OPERACIONAL', 'Túnel principal da linha da Beira Alta',
  '{"comprimento": 2600, "largura": 8, "altura": 6.5, "capacidade_carga": 25}',
  '2024-02-10', '2024-08-10', 'Eng. Maria Santos',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'VD-001', 'VIADUTO', 'ESTRUTURAL', 'Vale do Tejo, Lisboa', 25.3, 25.6,
  'ATIVO', 'Infraestruturas Lisboa', 'Viaduto de Betão', '2021-06-10',
  'OPERACIONAL', 'Viaduto sobre o Vale do Tejo',
  '{"comprimento": 180, "largura": 14, "altura": 35, "capacidade_carga": 40}',
  '2024-03-05', '2024-09-05', 'Eng. Carlos Oliveira',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'PS-001', 'PASSAGEM_SUPERIOR', 'ESTRUTURAL', 'Avenida da República, Lisboa', 8.2, 8.3,
  'ATIVO', 'Construções Urbanas', 'Passagem Superior Metálica', '2022-01-15',
  'OPERACIONAL', 'Passagem superior na Avenida da República',
  '{"comprimento": 45, "largura": 6, "altura": 8, "capacidade_carga": 15}',
  '2024-01-20', '2024-07-20', 'Eng. Ana Costa',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'PI-001', 'PASSAGEM_INFERIOR', 'HIDRAULICA', 'Ribeira de Sintra', 12.7, 12.8,
  'ATIVO', 'Obras Hidráulicas', 'Passagem Inferior', '2021-11-30',
  'OPERACIONAL', 'Passagem inferior sobre ribeira',
  '{"comprimento": 30, "largura": 10, "altura": 5, "capacidade_carga": 20}',
  '2024-02-15', '2024-08-15', 'Eng. Pedro Santos',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'AQ-001', 'AQUEDUTO', 'HIDRAULICA', 'Montejunto', 55.1, 55.4,
  'ATIVO', 'Sistemas Hídricos', 'Aqueduto Romano', '2020-09-20',
  'OPERACIONAL', 'Aqueduto histórico restaurado',
  '{"comprimento": 300, "largura": 3, "altura": 4, "capacidade_carga": 10}',
  '2024-01-10', '2024-07-10', 'Eng. Luísa Ferreira',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'PT-002', 'PONTE', 'ESTRUTURAL', 'Rio Mondego, Coimbra', 35.8, 36.1,
  'MANUTENCAO', 'Construtora Centro', 'Ponte de Betão', '2018-05-12',
  'MANUTENCAO', 'Ponte em manutenção programada',
  '{"comprimento": 280, "largura": 11, "altura": 20, "capacidade_carga": 35}',
  '2024-02-28', '2024-08-28', 'Eng. Manuel Silva',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'TN-002', 'TUNEL', 'GEOTECNICA', 'Serra do Marão', 62.3, 64.9,
  'ATIVO', 'Túneis Norte', 'Túnel Ferroviário', '2019-12-05',
  'OPERACIONAL', 'Túnel da linha do Douro',
  '{"comprimento": 2600, "largura": 7, "altura": 6, "capacidade_carga": 22}',
  '2024-03-12', '2024-09-12', 'Eng. Rosa Martins',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'VD-002', 'VIADUTO', 'ESTRUTURAL', 'Vale do Côa', 78.5, 78.8,
  'ATIVO', 'Infraestruturas Norte', 'Viaduto Misto', '2021-03-18',
  'OPERACIONAL', 'Viaduto sobre o Vale do Côa',
  '{"comprimento": 320, "largura": 13, "altura": 40, "capacidade_carga": 45}',
  '2024-01-25', '2024-07-25', 'Eng. António Lima',
  NOW(), NOW()
),
(
  gen_random_uuid(), 'PT-003', 'PONTE', 'ESTRUTURAL', 'Rio Guadiana, Algarve', 95.2, 95.5,
  'AVARIA', 'Construções Sul', 'Ponte Suspensa', '2017-07-22',
  'AVARIA', 'Ponte com avaria detetada',
  '{"comprimento": 420, "largura": 15, "altura": 30, "capacidade_carga": 30}',
  '2024-02-05', '2024-06-05', 'Eng. Sofia Almeida',
  NOW(), NOW()
);

-- Inserir dados mock para inspeções de pontes e túneis
INSERT INTO inspecoes_pontes_tuneis (
  id, ponte_tunel_id, data_inspecao, tipo_inspecao, resultado, 
  observacoes, responsavel, proxima_inspecao, created_at, updated_at
) VALUES 
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'PT-001' LIMIT 1),
  '2024-01-15', 'ROTINA', 'CONFORME',
  'Estrutura em bom estado geral, sem anomalias detetadas',
  'Eng. Carlos Oliveira', '2024-07-15', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'TN-001' LIMIT 1),
  '2024-02-10', 'MANUTENCAO', 'NAO_CONFORME',
  'Detetadas infiltrações na zona norte, necessária intervenção',
  'Eng. Ana Costa', '2024-05-10', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'VD-001' LIMIT 1),
  '2024-03-05', 'ROTINA', 'CONFORME',
  'Viaduto em excelente estado, todos os elementos conformes',
  'Eng. Pedro Santos', '2024-09-05', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'PS-001' LIMIT 1),
  '2024-01-20', 'ESPECIAL', 'PENDENTE',
  'Inspeção especial em curso, aguardando resultados laboratoriais',
  'Eng. Luísa Ferreira', '2024-04-20', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'PI-001' LIMIT 1),
  '2024-02-15', 'ROTINA', 'CONFORME',
  'Passagem inferior em bom estado, drenagem funcionando corretamente',
  'Eng. Manuel Silva', '2024-08-15', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'AQ-001' LIMIT 1),
  '2024-01-10', 'ROTINA', 'CONFORME',
  'Aqueduto histórico em bom estado de conservação',
  'Eng. Rosa Martins', '2024-07-10', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'PT-002' LIMIT 1),
  '2024-02-28', 'MANUTENCAO', 'CRITICO',
  'Detetadas fissuras críticas na estrutura, intervenção urgente necessária',
  'Eng. António Lima', '2024-04-28', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'TN-002' LIMIT 1),
  '2024-03-12', 'ROTINA', 'CONFORME',
  'Túnel em bom estado, ventilação e iluminação funcionais',
  'Eng. Sofia Almeida', '2024-09-12', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'VD-002' LIMIT 1),
  '2024-01-25', 'ROTINA', 'CONFORME',
  'Viaduto em excelente estado, todos os elementos conformes',
  'Eng. Carlos Oliveira', '2024-07-25', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'PT-003' LIMIT 1),
  '2024-02-05', 'AVARIA', 'CRITICO',
  'Avaria crítica detetada, ponte interdita ao tráfego',
  'Eng. Ana Costa', '2024-04-05', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'PT-001' LIMIT 1),
  '2023-07-15', 'ROTINA', 'CONFORME',
  'Inspeção de rotina sem anomalias',
  'Eng. Pedro Santos', '2024-01-15', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'TN-001' LIMIT 1),
  '2023-08-10', 'MANUTENCAO', 'CONFORME',
  'Manutenção preventiva concluída com sucesso',
  'Eng. Luísa Ferreira', '2024-02-10', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'VD-001' LIMIT 1),
  '2023-09-05', 'ROTINA', 'CONFORME',
  'Viaduto em excelente estado de conservação',
  'Eng. Manuel Silva', '2024-03-05', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'PS-001' LIMIT 1),
  '2023-07-20', 'ROTINA', 'CONFORME',
  'Passagem superior em bom estado',
  'Eng. Rosa Martins', '2024-01-20', NOW(), NOW()
),
(
  gen_random_uuid(), (SELECT id FROM pontes_tuneis WHERE codigo = 'PI-001' LIMIT 1),
  '2023-08-15', 'ROTINA', 'CONFORME',
  'Passagem inferior sem problemas detetados',
  'Eng. António Lima', '2024-02-15', NOW(), NOW()
);

-- Reabilitar RLS
ALTER TABLE pontes_tuneis ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspecoes_pontes_tuneis ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS permissivas para desenvolvimento
CREATE POLICY "Allow read access to all pontes_tuneis" ON pontes_tuneis
  FOR SELECT USING (true);

CREATE POLICY "Allow insert access to all pontes_tuneis" ON pontes_tuneis
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to all pontes_tuneis" ON pontes_tuneis
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to all pontes_tuneis" ON pontes_tuneis
  FOR DELETE USING (true);

CREATE POLICY "Allow read access to all inspecoes_pontes_tuneis" ON inspecoes_pontes_tuneis
  FOR SELECT USING (true);

CREATE POLICY "Allow insert access to all inspecoes_pontes_tuneis" ON inspecoes_pontes_tuneis
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to all inspecoes_pontes_tuneis" ON inspecoes_pontes_tuneis
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to all inspecoes_pontes_tuneis" ON inspecoes_pontes_tuneis
  FOR DELETE USING (true);

-- Verificar dados inseridos
SELECT 'Pontes e Túneis inseridos:' as info, COUNT(*) as total FROM pontes_tuneis;
SELECT 'Inspeções inseridas:' as info, COUNT(*) as total FROM inspecoes_pontes_tuneis;
