-- Script para adicionar dados mock à tabela sistemas_seguranca e inspecoes_seguranca
-- Desabilitar RLS temporariamente
ALTER TABLE sistemas_seguranca DISABLE ROW LEVEL SECURITY;
ALTER TABLE inspecoes_seguranca DISABLE ROW LEVEL SECURITY;

-- Inserir dados mock na tabela sistemas_seguranca
INSERT INTO sistemas_seguranca (
  codigo,
  tipo,
  categoria,
  localizacao,
  km_inicial,
  km_final,
  estado,
  fabricante,
  modelo,
  data_instalacao,
  status_operacional,
  observacoes,
  parametros,
  ultima_inspecao,
  proxima_inspecao,
  responsavel,
  fotos,
  documentos_anexos,
  created_at,
  updated_at
) VALUES
  ('SEC-001', 'Sistema de Detecção', 'Segurança Operacional', 'KM 10+200', 10.2, 10.3, 'Ativo', 'Siemens', 'DET-2000', '2023-01-15', 'Operacional', 'Sistema de detecção de obstáculos na via', '{"nivel_seguranca": 9, "raio_cobertura": 500, "tempo_resposta": 100, "capacidade_deteccao": 95}', '2024-01-15', '2024-04-15', 'João Silva', '[]', '[]', NOW(), NOW()),
  ('SEC-002', 'Sistema de Vigilância', 'Segurança de Passageiros', 'KM 15+500', 15.5, 15.6, 'Ativo', 'Bosch', 'CCTV-500', '2023-02-20', 'Operacional', 'Câmeras de vigilância da estação', '{"nivel_seguranca": 8, "raio_cobertura": 200, "tempo_resposta": 50, "capacidade_deteccao": 98}', '2024-01-20', '2024-04-20', 'Maria Santos', '[]', '[]', NOW(), NOW()),
  ('SEC-003', 'Sistema de Controle', 'Segurança de Infraestrutura', 'KM 22+100', 22.1, 22.2, 'Ativo', 'ABB', 'CTRL-300', '2023-03-10', 'Manutenção', 'Sistema de controle de acesso', '{"nivel_seguranca": 7, "raio_cobertura": 100, "tempo_resposta": 200, "capacidade_deteccao": 90}', '2024-02-01', '2024-05-01', 'Carlos Oliveira', '[]', '[]', NOW(), NOW()),
  ('SEC-004', 'Sistema de Alarme', 'Segurança Ambiental', 'KM 28+700', 28.7, 28.8, 'Ativo', 'Honeywell', 'ALM-100', '2023-04-05', 'Operacional', 'Sistema de alarme de incêndio', '{"nivel_seguranca": 10, "raio_cobertura": 300, "tempo_resposta": 30, "capacidade_deteccao": 99}', '2024-01-25', '2024-04-25', 'Ana Costa', '[]', '[]', NOW(), NOW()),
  ('SEC-005', 'Sistema de Bloqueio', 'Segurança no Trabalho', 'KM 35+300', 35.3, 35.4, 'Ativo', 'Thales', 'BLK-400', '2023-05-12', 'Avaria', 'Sistema de bloqueio de via', '{"nivel_seguranca": 9, "raio_cobertura": 150, "tempo_resposta": 150, "capacidade_deteccao": 92}', '2024-02-10', '2024-05-10', 'Pedro Martins', '[]', '[]', NOW(), NOW()),
  ('SEC-006', 'Sistema de Comunicação', 'Segurança Patrimonial', 'KM 42+800', 42.8, 42.9, 'Ativo', 'Motorola', 'COM-600', '2023-06-18', 'Operacional', 'Sistema de comunicação de emergência', '{"nivel_seguranca": 8, "raio_cobertura": 1000, "tempo_resposta": 20, "capacidade_deteccao": 97}', '2024-01-30', '2024-04-30', 'Sofia Rodrigues', '[]', '[]', NOW(), NOW()),
  ('SEC-007', 'Sistema de Monitoramento', 'Segurança Operacional', 'KM 48+200', 48.2, 48.3, 'Ativo', 'GE', 'MON-700', '2023-07-25', 'Operacional', 'Sistema de monitoramento de velocidade', '{"nivel_seguranca": 7, "raio_cobertura": 400, "tempo_resposta": 80, "capacidade_deteccao": 94}', '2024-02-05', '2024-05-05', 'Miguel Ferreira', '[]', '[]', NOW(), NOW()),
  ('SEC-008', 'Sistema de Emergência', 'Segurança de Passageiros', 'KM 55+600', 55.6, 55.7, 'Inativo', 'Hitachi', 'EMG-800', '2023-08-30', 'Desligado', 'Sistema de emergência em túnel', '{"nivel_seguranca": 10, "raio_cobertura": 800, "tempo_resposta": 10, "capacidade_deteccao": 99}', '2024-01-18', '2024-04-18', 'Inês Pereira', '[]', '[]', NOW(), NOW()),
  ('SEC-009', 'Sistema de Detecção', 'Segurança de Infraestrutura', 'KM 62+400', 62.4, 62.5, 'Ativo', 'Alstom', 'DET-900', '2023-09-14', 'Teste', 'Sistema de detecção de intrusão', '{"nivel_seguranca": 8, "raio_cobertura": 250, "tempo_resposta": 120, "capacidade_deteccao": 96}', '2024-02-12', '2024-05-12', 'Tiago Sousa', '[]', '[]', NOW(), NOW()),
  ('SEC-010', 'Sistema de Vigilância', 'Segurança Ambiental', 'KM 68+900', 68.9, 69.0, 'Ativo', 'Siemens', 'CCTV-1000', '2023-10-22', 'Operacional', 'Sistema de vigilância perimetral', '{"nivel_seguranca": 9, "raio_cobertura": 600, "tempo_resposta": 60, "capacidade_deteccao": 98}', '2024-01-22', '2024-04-22', 'Rita Almeida', '[]', '[]', NOW(), NOW());

-- Inserir dados mock na tabela inspecoes_seguranca
INSERT INTO inspecoes_seguranca (
  seguranca_id,
  data_inspecao,
  tipo_inspecao,
  resultado,
  observacoes,
  responsavel,
  proxima_inspecao,
  prioridade,
  acoes_corretivas,
  fotos,
  documentos_anexos,
  created_at,
  updated_at
) VALUES
  ('SEC-001', '2024-01-15', 'Inspeção de Rotina', 'Conforme', 'Sistema funcionando corretamente, sensores calibrados', 'João Silva', '2024-04-15', 'Baixa', 'Nenhuma ação necessária', '[]', '[]', NOW(), NOW()),
  ('SEC-002', '2024-01-20', 'Inspeção de Rotina', 'Conforme', 'Câmeras operacionais, imagem nítida', 'Maria Santos', '2024-04-20', 'Baixa', 'Limpeza das lentes realizada', '[]', '[]', NOW(), NOW()),
  ('SEC-003', '2024-02-01', 'Inspeção de Manutenção', 'Pendente', 'Sistema necessita atualização de software', 'Carlos Oliveira', '2024-05-01', 'Alta', 'Agendada atualização para próxima semana', '[]', '[]', NOW(), NOW()),
  ('SEC-004', '2024-01-25', 'Inspeção de Rotina', 'Conforme', 'Sistema de alarme testado e funcionando', 'Ana Costa', '2024-04-25', 'Baixa', 'Teste mensal realizado', '[]', '[]', NOW(), NOW()),
  ('SEC-005', '2024-02-10', 'Inspeção de Avaria', 'Não Conforme', 'Sistema com falha no mecanismo de bloqueio', 'Pedro Martins', '2024-05-10', 'Crítica', 'Solicitada peça de reposição', '[]', '[]', NOW(), NOW()),
  ('SEC-006', '2024-01-30', 'Inspeção de Rotina', 'Conforme', 'Comunicação estável, sinal forte', 'Sofia Rodrigues', '2024-04-30', 'Baixa', 'Nenhuma ação necessária', '[]', '[]', NOW(), NOW()),
  ('SEC-007', '2024-02-05', 'Inspeção de Rotina', 'Conforme', 'Monitoramento funcionando corretamente', 'Miguel Ferreira', '2024-05-05', 'Baixa', 'Calibração realizada', '[]', '[]', NOW(), NOW()),
  ('SEC-008', '2024-01-18', 'Inspeção Especial', 'Não Conforme', 'Sistema desligado para manutenção', 'Inês Pereira', '2024-04-18', 'Média', 'Aguardando autorização para religar', '[]', '[]', NOW(), NOW()),
  ('SEC-009', '2024-02-12', 'Inspeção de Manutenção', 'Pendente', 'Sistema em fase de testes', 'Tiago Sousa', '2024-05-12', 'Média', 'Testes em andamento', '[]', '[]', NOW(), NOW()),
  ('SEC-010', '2024-01-22', 'Inspeção de Rotina', 'Conforme', 'Vigilância perimetral operacional', 'Rita Almeida', '2024-04-22', 'Baixa', 'Nenhuma ação necessária', '[]', '[]', NOW(), NOW()),
  ('SEC-001', '2024-02-15', 'Inspeção Especial', 'Conforme', 'Inspeção especial após tempestade, sem danos', 'João Silva', '2024-05-15', 'Baixa', 'Verificação adicional realizada', '[]', '[]', NOW(), NOW()),
  ('SEC-003', '2024-02-20', 'Inspeção de Reparação', 'Conforme', 'Software atualizado, sistema funcionando', 'Carlos Oliveira', '2024-05-20', 'Baixa', 'Atualização concluída com sucesso', '[]', '[]', NOW(), NOW()),
  ('SEC-005', '2024-02-25', 'Inspeção de Reparação', 'Pendente', 'Peça substituída, aguardando testes', 'Pedro Martins', '2024-05-25', 'Alta', 'Instalação concluída, testes em andamento', '[]', '[]', NOW(), NOW()),
  ('SEC-008', '2024-02-28', 'Inspeção de Manutenção', 'Conforme', 'Sistema religado e testado', 'Inês Pereira', '2024-05-28', 'Baixa', 'Sistema religado com sucesso', '[]', '[]', NOW(), NOW()),
  ('SEC-002', '2024-03-01', 'Inspeção Especial', 'Não Conforme', 'Câmera com pequeno desalinhamento', 'Maria Santos', '2024-06-01', 'Média', 'Ajuste de alinhamento agendado', '[]', '[]', NOW(), NOW());

-- Reabilitar RLS
ALTER TABLE sistemas_seguranca ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspecoes_seguranca ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS permissivas para desenvolvimento
DROP POLICY IF EXISTS "Allow read access to all sistemas_seguranca" ON sistemas_seguranca;
DROP POLICY IF EXISTS "Allow insert access to all sistemas_seguranca" ON sistemas_seguranca;
DROP POLICY IF EXISTS "Allow update access to all sistemas_seguranca" ON sistemas_seguranca;
DROP POLICY IF EXISTS "Allow delete access to all sistemas_seguranca" ON sistemas_seguranca;

DROP POLICY IF EXISTS "Allow read access to all inspecoes_seguranca" ON inspecoes_seguranca;
DROP POLICY IF EXISTS "Allow insert access to all inspecoes_seguranca" ON inspecoes_seguranca;
DROP POLICY IF EXISTS "Allow update access to all inspecoes_seguranca" ON inspecoes_seguranca;
DROP POLICY IF EXISTS "Allow delete access to all inspecoes_seguranca" ON inspecoes_seguranca;

-- Políticas para sistemas_seguranca
CREATE POLICY "Allow read access to all sistemas_seguranca" ON sistemas_seguranca FOR SELECT USING (true);
CREATE POLICY "Allow insert access to all sistemas_seguranca" ON sistemas_seguranca FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to all sistemas_seguranca" ON sistemas_seguranca FOR UPDATE USING (true);
CREATE POLICY "Allow delete access to all sistemas_seguranca" ON sistemas_seguranca FOR DELETE USING (true);

-- Políticas para inspecoes_seguranca
CREATE POLICY "Allow read access to all inspecoes_seguranca" ON inspecoes_seguranca FOR SELECT USING (true);
CREATE POLICY "Allow insert access to all inspecoes_seguranca" ON inspecoes_seguranca FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to all inspecoes_seguranca" ON inspecoes_seguranca FOR UPDATE USING (true);
CREATE POLICY "Allow delete access to all inspecoes_seguranca" ON inspecoes_seguranca FOR DELETE USING (true);

-- Verificar dados inseridos
SELECT 'Sistemas de Segurança inseridos:' as info, COUNT(*) as total FROM sistemas_seguranca;
SELECT 'Inspeções de Segurança inseridas:' as info, COUNT(*) as total FROM inspecoes_seguranca;
