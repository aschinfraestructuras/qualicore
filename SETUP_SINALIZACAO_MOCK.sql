-- Script para adicionar dados mock à tabela sinalizacoes
-- Desabilitar RLS temporariamente
ALTER TABLE sinalizacoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE inspecoes_sinalizacao DISABLE ROW LEVEL SECURITY;

-- Inserir dados mock na tabela sinalizacoes
INSERT INTO sinalizacoes (
  codigo,
  tipo,
  categoria,
  localizacao,
  descricao,
  status_operacional,
  estado,
  ultima_inspecao,
  proxima_inspecao,
  responsavel,
  fabricante,
  modelo,
  ano_fabricacao,
  potencia,
  tensao,
  corrente,
  frequencia,
  observacoes,
  fotos,
  documentos_anexos,
  created_at,
  updated_at
) VALUES
  ('SIG-001', 'SEMAFORO', 'SINALIZACAO_LUMINOSA', 'KM 15+200', 'Semáforo principal da linha', 'OPERACIONAL', 'ATIVO', '2024-01-15', '2024-04-15', 'João Silva', 'Siemens', 'SIG-2000', 2020, '50W', '220V', '0.23A', '50Hz', 'Funcionamento normal', '[]', '[]', NOW(), NOW()),
  ('SIG-002', 'PLACA_INDICADORA', 'SINALIZACAO_FIXA', 'KM 18+500', 'Placa de velocidade máxima', 'OPERACIONAL', 'ATIVO', '2024-01-20', '2024-04-20', 'Maria Santos', 'Alstom', 'PL-150', 2019, '10W', '24V', '0.42A', '50Hz', 'Boa visibilidade', '[]', '[]', NOW(), NOW()),
  ('SIG-003', 'BARRERA', 'SINALIZACAO_MECANICA', 'KM 22+100', 'Barreira automática de passagem', 'MANUTENCAO', 'ATIVO', '2024-02-01', '2024-05-01', 'Carlos Oliveira', 'Bombardier', 'BAR-300', 2021, '200W', '380V', '0.53A', '50Hz', 'Em manutenção preventiva', '[]', '[]', NOW(), NOW()),
  ('SIG-004', 'SINAL_ACUSTICO', 'SINALIZACAO_SONORA', 'KM 25+300', 'Sinal acústico de aproximação', 'OPERACIONAL', 'ATIVO', '2024-01-25', '2024-04-25', 'Ana Costa', 'Thales', 'ACU-100', 2022, '30W', '110V', '0.27A', '50Hz', 'Volume adequado', '[]', '[]', NOW(), NOW()),
  ('SIG-005', 'DISPLAY_LED', 'SINALIZACAO_DIGITAL', 'KM 28+700', 'Display de informações ao passageiro', 'AVARIA', 'INATIVO', '2024-02-10', '2024-05-10', 'Pedro Martins', 'Hitachi', 'LED-500', 2021, '100W', '220V', '0.45A', '50Hz', 'Aguardando reparação', '[]', '[]', NOW(), NOW()),
  ('SIG-006', 'LUZ_EMERGENCIA', 'SINALIZACAO_EMERGENCIA', 'KM 31+200', 'Luz de emergência da estação', 'OPERACIONAL', 'ATIVO', '2024-01-30', '2024-04-30', 'Sofia Rodrigues', 'ABB', 'EMG-200', 2020, '75W', '220V', '0.34A', '50Hz', 'Teste mensal OK', '[]', '[]', NOW(), NOW()),
  ('SIG-007', 'CAMERA_CCTV', 'SINALIZACAO_VIDEO', 'KM 34+800', 'Câmera de vigilância da via', 'OPERACIONAL', 'ATIVO', '2024-02-05', '2024-05-05', 'Miguel Ferreira', 'Bosch', 'CCTV-800', 2022, '25W', '24V', '1.04A', '50Hz', 'Imagem nítida', '[]', '[]', NOW(), NOW()),
  ('SIG-008', 'SENSOR_PRESENCA', 'SINALIZACAO_DETECCAO', 'KM 37+400', 'Sensor de presença de comboio', 'OPERACIONAL', 'ATIVO', '2024-01-18', '2024-04-18', 'Inês Pereira', 'GE', 'SEN-150', 2021, '15W', '12V', '1.25A', '50Hz', 'Detecção precisa', '[]', '[]', NOW(), NOW()),
  ('SIG-009', 'PAINEL_INFORMATIVO', 'SINALIZACAO_INFORMATIVA', 'KM 40+100', 'Painel de informações da estação', 'MANUTENCAO', 'ATIVO', '2024-02-12', '2024-05-12', 'Tiago Sousa', 'Siemens', 'PAN-400', 2020, '120W', '220V', '0.55A', '50Hz', 'Atualização de software', '[]', '[]', NOW(), NOW()),
  ('SIG-010', 'SINAL_RADIO', 'SINALIZACAO_COMUNICACAO', 'KM 42+600', 'Sinal de rádio para comunicação', 'OPERACIONAL', 'ATIVO', '2024-01-22', '2024-04-22', 'Rita Almeida', 'Motorola', 'RAD-300', 2021, '80W', '220V', '0.36A', '50Hz', 'Comunicação estável', '[]', '[]', NOW(), NOW());

-- Inserir dados mock na tabela inspecoes_sinalizacao
INSERT INTO inspecoes_sinalizacao (
  codigo,
  sinalizacao_codigo,
  tipo_inspecao,
  data_inspecao,
  resultado,
  prioridade,
  inspetor,
  observacoes,
  acoes_corretivas,
  proxima_inspecao,
  fotos,
  documentos_anexos,
  created_at,
  updated_at
) VALUES
  ('INS-001', 'SIG-001', 'INSPECAO_ROTINA', '2024-01-15', 'CONFORME', 'BAIXA', 'João Silva', 'Funcionamento normal, lâmpadas em bom estado', 'Nenhuma ação necessária', '2024-04-15', '[]', '[]', NOW(), NOW()),
  ('INS-002', 'SIG-002', 'INSPECAO_ROTINA', '2024-01-20', 'CONFORME', 'BAIXA', 'Maria Santos', 'Placa limpa e visível, fixação segura', 'Limpeza realizada', '2024-04-20', '[]', '[]', NOW(), NOW()),
  ('INS-003', 'SIG-003', 'INSPECAO_MANUTENCAO', '2024-02-01', 'PENDENTE', 'ALTA', 'Carlos Oliveira', 'Barreira com movimento lento, necessita lubrificação', 'Agendada manutenção para próxima semana', '2024-05-01', '[]', '[]', NOW(), NOW()),
  ('INS-004', 'SIG-004', 'INSPECAO_ROTINA', '2024-01-25', 'CONFORME', 'BAIXA', 'Ana Costa', 'Sinal acústico funcionando corretamente', 'Nenhuma ação necessária', '2024-04-25', '[]', '[]', NOW(), NOW()),
  ('INS-005', 'SIG-005', 'INSPECAO_AVARIA', '2024-02-10', 'NAO_CONFORME', 'CRITICA', 'Pedro Martins', 'Display com falhas na exibição, necessita substituição', 'Solicitada peça de reposição', '2024-05-10', '[]', '[]', NOW(), NOW()),
  ('INS-006', 'SIG-006', 'INSPECAO_ROTINA', '2024-01-30', 'CONFORME', 'BAIXA', 'Sofia Rodrigues', 'Luz de emergência testada e funcionando', 'Teste mensal realizado', '2024-04-30', '[]', '[]', NOW(), NOW()),
  ('INS-007', 'SIG-007', 'INSPECAO_ROTINA', '2024-02-05', 'CONFORME', 'BAIXA', 'Miguel Ferreira', 'Câmera com imagem nítida, lente limpa', 'Limpeza da lente realizada', '2024-05-05', '[]', '[]', NOW(), NOW()),
  ('INS-008', 'SIG-008', 'INSPECAO_ROTINA', '2024-01-18', 'CONFORME', 'BAIXA', 'Inês Pereira', 'Sensor funcionando corretamente, calibração OK', 'Nenhuma ação necessária', '2024-04-18', '[]', '[]', NOW(), NOW()),
  ('INS-009', 'SIG-009', 'INSPECAO_MANUTENCAO', '2024-02-12', 'PENDENTE', 'MEDIA', 'Tiago Sousa', 'Painel necessita atualização de software', 'Agendada atualização para amanhã', '2024-05-12', '[]', '[]', NOW(), NOW()),
  ('INS-010', 'SIG-010', 'INSPECAO_ROTINA', '2024-01-22', 'CONFORME', 'BAIXA', 'Rita Almeida', 'Comunicação rádio estável, sinal forte', 'Nenhuma ação necessária', '2024-04-22', '[]', '[]', NOW(), NOW()),
  ('INS-011', 'SIG-001', 'INSPECAO_ESPECIAL', '2024-02-15', 'CONFORME', 'BAIXA', 'João Silva', 'Inspeção especial após tempestade, sem danos', 'Verificação adicional realizada', '2024-05-15', '[]', '[]', NOW(), NOW()),
  ('INS-012', 'SIG-003', 'INSPECAO_REPARACAO', '2024-02-20', 'CONFORME', 'BAIXA', 'Carlos Oliveira', 'Barreira reparada e testada, funcionamento normal', 'Lubrificação e ajustes realizados', '2024-05-20', '[]', '[]', NOW(), NOW()),
  ('INS-013', 'SIG-005', 'INSPECAO_REPARACAO', '2024-02-25', 'PENDENTE', 'ALTA', 'Pedro Martins', 'Display substituído, aguardando testes finais', 'Instalação concluída, testes em andamento', '2024-05-25', '[]', '[]', NOW(), NOW()),
  ('INS-014', 'SIG-009', 'INSPECAO_MANUTENCAO', '2024-02-28', 'CONFORME', 'BAIXA', 'Tiago Sousa', 'Software atualizado, painel funcionando normalmente', 'Atualização concluída com sucesso', '2024-05-28', '[]', '[]', NOW(), NOW()),
  ('INS-015', 'SIG-002', 'INSPECAO_ESPECIAL', '2024-03-01', 'NAO_CONFORME', 'MEDIA', 'Maria Santos', 'Placa com pequeno desalinhamento, necessita ajuste', 'Ajuste de alinhamento agendado', '2024-06-01', '[]', '[]', NOW(), NOW());

-- Reabilitar RLS
ALTER TABLE sinalizacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspecoes_sinalizacao ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS permissivas para desenvolvimento
DROP POLICY IF EXISTS "Allow read access to all sinalizacoes" ON sinalizacoes;
DROP POLICY IF EXISTS "Allow insert access to all sinalizacoes" ON sinalizacoes;
DROP POLICY IF EXISTS "Allow update access to all sinalizacoes" ON sinalizacoes;
DROP POLICY IF EXISTS "Allow delete access to all sinalizacoes" ON sinalizacoes;

DROP POLICY IF EXISTS "Allow read access to all inspecoes_sinalizacao" ON inspecoes_sinalizacao;
DROP POLICY IF EXISTS "Allow insert access to all inspecoes_sinalizacao" ON inspecoes_sinalizacao;
DROP POLICY IF EXISTS "Allow update access to all inspecoes_sinalizacao" ON inspecoes_sinalizacao;
DROP POLICY IF EXISTS "Allow delete access to all inspecoes_sinalizacao" ON inspecoes_sinalizacao;

-- Políticas para sinalizacoes
CREATE POLICY "Allow read access to all sinalizacoes" ON sinalizacoes FOR SELECT USING (true);
CREATE POLICY "Allow insert access to all sinalizacoes" ON sinalizacoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to all sinalizacoes" ON sinalizacoes FOR UPDATE USING (true);
CREATE POLICY "Allow delete access to all sinalizacoes" ON sinalizacoes FOR DELETE USING (true);

-- Políticas para inspecoes_sinalizacao
CREATE POLICY "Allow read access to all inspecoes_sinalizacao" ON inspecoes_sinalizacao FOR SELECT USING (true);
CREATE POLICY "Allow insert access to all inspecoes_sinalizacao" ON inspecoes_sinalizacao FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to all inspecoes_sinalizacao" ON inspecoes_sinalizacao FOR UPDATE USING (true);
CREATE POLICY "Allow delete access to all inspecoes_sinalizacao" ON inspecoes_sinalizacao FOR DELETE USING (true);

-- Verificar dados inseridos
SELECT 'Sinalizações inseridas:' as info, COUNT(*) as total FROM sinalizacoes;
SELECT 'Inspeções inseridas:' as info, COUNT(*) as total FROM inspecoes_sinalizacao;
