-- ===== MÓDULO DE CALIBRAÇÕES E EQUIPAMENTOS =====

-- Primeiro, vamos dropar as tabelas se existirem para evitar conflitos
DROP TABLE IF EXISTS documentos_inspecoes CASCADE;
DROP TABLE IF EXISTS fotos_inspecoes CASCADE;
DROP TABLE IF EXISTS documentos_manutencoes CASCADE;
DROP TABLE IF EXISTS fotos_manutencoes CASCADE;
DROP TABLE IF EXISTS documentos_calibracoes CASCADE;
DROP TABLE IF EXISTS fotos_calibracoes CASCADE;
DROP TABLE IF EXISTS documentos_equipamentos CASCADE;
DROP TABLE IF EXISTS fotos_equipamentos CASCADE;
DROP TABLE IF EXISTS criterios_inspecao CASCADE;
DROP TABLE IF EXISTS pontos_calibracao CASCADE;
DROP TABLE IF EXISTS inspecoes CASCADE;
DROP TABLE IF EXISTS manutencoes CASCADE;
DROP TABLE IF EXISTS calibracoes CASCADE;
DROP TABLE IF EXISTS equipamentos CASCADE;

-- Tabela de Equipamentos (PRIMEIRA - sem dependências)
CREATE TABLE equipamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  marca VARCHAR(100),
  modelo VARCHAR(100),
  numero_serie VARCHAR(100),
  localizacao VARCHAR(255),
  departamento VARCHAR(100),
  responsavel VARCHAR(100),
  data_aquisicao DATE,
  data_instalacao DATE,
  estado VARCHAR(20) DEFAULT 'ativo',
  status_operacional VARCHAR(20) DEFAULT 'operacional',
  fabricante VARCHAR(100),
  fornecedor VARCHAR(100),
  garantia_ate DATE,
  vida_util_anos INTEGER DEFAULT 10,
  valor_aquisicao DECIMAL(10,2) DEFAULT 0,
  valor_atual DECIMAL(10,2) DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Calibrações (depende de equipamentos)
CREATE TABLE calibracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipamento_id UUID NOT NULL,
  numero_calibracao VARCHAR(50) UNIQUE NOT NULL,
  tipo_calibracao VARCHAR(20) NOT NULL,
  data_calibracao DATE NOT NULL,
  data_proxima_calibracao DATE NOT NULL,
  laboratorio VARCHAR(100),
  tecnico_responsavel VARCHAR(100),
  certificado_calibracao VARCHAR(100),
  resultado VARCHAR(20) DEFAULT 'aprovado',
  incerteza_medicao DECIMAL(10,6),
  unidade_incerteza VARCHAR(20),
  observacoes TEXT,
  custo DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_calibracoes_equipamento FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE CASCADE
);

-- Tabela de Manutenções (depende de equipamentos)
CREATE TABLE manutencoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipamento_id UUID NOT NULL,
  tipo_manutencao VARCHAR(20) NOT NULL,
  data_manutencao DATE NOT NULL,
  data_proxima_manutencao DATE,
  descricao TEXT,
  acoes_realizadas TEXT,
  pecas_substituidas TEXT,
  custo DECIMAL(10,2) DEFAULT 0,
  tecnico_responsavel VARCHAR(100),
  fornecedor VARCHAR(100),
  resultado VARCHAR(20) DEFAULT 'concluida',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_manutencoes_equipamento FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE CASCADE
);

-- Tabela de Inspeções (depende de equipamentos)
CREATE TABLE inspecoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipamento_id UUID NOT NULL,
  data_inspecao DATE NOT NULL,
  tipo_inspecao VARCHAR(20) NOT NULL,
  inspetor VARCHAR(100),
  resultado VARCHAR(20) DEFAULT 'aprovado',
  observacoes TEXT,
  acoes_corretivas TEXT,
  duracao_horas DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_inspecoes_equipamento FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE CASCADE
);

-- Tabela de Pontos de Calibração (depende de calibracoes)
CREATE TABLE pontos_calibracao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calibracao_id UUID NOT NULL,
  ponto_medicao INTEGER NOT NULL,
  valor_nominal DECIMAL(10,6) NOT NULL,
  valor_medido DECIMAL(10,6) NOT NULL,
  erro DECIMAL(10,6),
  incerteza DECIMAL(10,6),
  unidade VARCHAR(20),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_pontos_calibracao_calibracao FOREIGN KEY (calibracao_id) REFERENCES calibracoes(id) ON DELETE CASCADE
);

-- Tabela de Critérios de Inspeção (depende de inspecoes)
CREATE TABLE criterios_inspecao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inspecao_id UUID NOT NULL,
  criterio VARCHAR(255) NOT NULL,
  resultado VARCHAR(20) DEFAULT 'conforme',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_criterios_inspecao_inspecao FOREIGN KEY (inspecao_id) REFERENCES inspecoes(id) ON DELETE CASCADE
);

-- Tabelas de Fotos e Documentos (dependem das tabelas principais)
CREATE TABLE fotos_equipamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipamento_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  descricao TEXT,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tamanho INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  CONSTRAINT fk_fotos_equipamentos_equipamento FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE CASCADE
);

CREATE TABLE documentos_equipamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipamento_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  tamanho INTEGER NOT NULL,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  descricao TEXT,
  CONSTRAINT fk_documentos_equipamentos_equipamento FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id) ON DELETE CASCADE
);

CREATE TABLE fotos_calibracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calibracao_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  descricao TEXT,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tamanho INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  CONSTRAINT fk_fotos_calibracoes_calibracao FOREIGN KEY (calibracao_id) REFERENCES calibracoes(id) ON DELETE CASCADE
);

CREATE TABLE documentos_calibracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calibracao_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  tamanho INTEGER NOT NULL,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  descricao TEXT,
  CONSTRAINT fk_documentos_calibracoes_calibracao FOREIGN KEY (calibracao_id) REFERENCES calibracoes(id) ON DELETE CASCADE
);

CREATE TABLE fotos_manutencoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  manutencao_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  descricao TEXT,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tamanho INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  CONSTRAINT fk_fotos_manutencoes_manutencao FOREIGN KEY (manutencao_id) REFERENCES manutencoes(id) ON DELETE CASCADE
);

CREATE TABLE documentos_manutencoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  manutencao_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  tamanho INTEGER NOT NULL,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  descricao TEXT,
  CONSTRAINT fk_documentos_manutencoes_manutencao FOREIGN KEY (manutencao_id) REFERENCES manutencoes(id) ON DELETE CASCADE
);

CREATE TABLE fotos_inspecoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inspecao_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  descricao TEXT,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tamanho INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  CONSTRAINT fk_fotos_inspecoes_inspecao FOREIGN KEY (inspecao_id) REFERENCES inspecoes(id) ON DELETE CASCADE
);

CREATE TABLE documentos_inspecoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inspecao_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  tamanho INTEGER NOT NULL,
  data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  descricao TEXT,
  CONSTRAINT fk_documentos_inspecoes_inspecao FOREIGN KEY (inspecao_id) REFERENCES inspecoes(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_equipamentos_codigo ON equipamentos(codigo);
CREATE INDEX idx_equipamentos_tipo ON equipamentos(tipo);
CREATE INDEX idx_equipamentos_categoria ON equipamentos(categoria);
CREATE INDEX idx_equipamentos_estado ON equipamentos(estado);
CREATE INDEX idx_equipamentos_departamento ON equipamentos(departamento);
CREATE INDEX idx_equipamentos_responsavel ON equipamentos(responsavel);

CREATE INDEX idx_calibracoes_equipamento_id ON calibracoes(equipamento_id);
CREATE INDEX idx_calibracoes_numero_calibracao ON calibracoes(numero_calibracao);
CREATE INDEX idx_calibracoes_data_proxima ON calibracoes(data_proxima_calibracao);
CREATE INDEX idx_calibracoes_resultado ON calibracoes(resultado);

CREATE INDEX idx_manutencoes_equipamento_id ON manutencoes(equipamento_id);
CREATE INDEX idx_manutencoes_tipo ON manutencoes(tipo_manutencao);
CREATE INDEX idx_manutencoes_data ON manutencoes(data_manutencao);
CREATE INDEX idx_manutencoes_resultado ON manutencoes(resultado);

CREATE INDEX idx_inspecoes_equipamento_id ON inspecoes(equipamento_id);
CREATE INDEX idx_inspecoes_tipo ON inspecoes(tipo_inspecao);
CREATE INDEX idx_inspecoes_data ON inspecoes(data_inspecao);
CREATE INDEX idx_inspecoes_resultado ON inspecoes(resultado);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_equipamentos_updated_at BEFORE UPDATE ON equipamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calibracoes_updated_at BEFORE UPDATE ON calibracoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_manutencoes_updated_at BEFORE UPDATE ON manutencoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspecoes_updated_at BEFORE UPDATE ON inspecoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular estatísticas
CREATE OR REPLACE FUNCTION get_calibracoes_stats()
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_equipamentos', (SELECT COUNT(*) FROM equipamentos),
    'equipamentos_ativos', (SELECT COUNT(*) FROM equipamentos WHERE estado = 'ativo'),
    'equipamentos_manutencao', (SELECT COUNT(*) FROM equipamentos WHERE estado = 'manutencao'),
    'equipamentos_avariados', (SELECT COUNT(*) FROM equipamentos WHERE estado = 'avariado'),
    'calibracoes_vencidas', (SELECT COUNT(*) FROM calibracoes WHERE data_proxima_calibracao < CURRENT_DATE AND resultado = 'aprovado'),
    'calibracoes_proximas_vencer', (SELECT COUNT(*) FROM calibracoes WHERE data_proxima_calibracao BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days' AND resultado = 'aprovado'),
    'manutencoes_pendentes', (SELECT COUNT(*) FROM manutencoes WHERE resultado IN ('pendente', 'em_andamento')),
    'inspecoes_pendentes', (SELECT COUNT(*) FROM inspecoes WHERE resultado = 'pendente'),
    'valor_total_equipamentos', (SELECT COALESCE(SUM(COALESCE(valor_atual, valor_aquisicao)), 0) FROM equipamentos),
    'custo_total_calibracoes', (SELECT COALESCE(SUM(custo), 0) FROM calibracoes),
    'custo_total_manutencoes', (SELECT COALESCE(SUM(custo), 0) FROM manutencoes)
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS)
ALTER TABLE equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE calibracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE manutencoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspecoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pontos_calibracao ENABLE ROW LEVEL SECURITY;
ALTER TABLE criterios_inspecao ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos_equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos_calibracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_calibracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos_manutencoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_manutencoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos_inspecoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_inspecoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários autenticados podem ver equipamentos" ON equipamentos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir equipamentos" ON equipamentos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem atualizar equipamentos" ON equipamentos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar equipamentos" ON equipamentos FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver calibrações" ON calibracoes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir calibrações" ON calibracoes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem atualizar calibrações" ON calibracoes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar calibrações" ON calibracoes FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver manutenções" ON manutencoes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir manutenções" ON manutencoes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem atualizar manutenções" ON manutencoes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar manutenções" ON manutencoes FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver inspeções" ON inspecoes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir inspeções" ON inspecoes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem atualizar inspeções" ON inspecoes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar inspeções" ON inspecoes FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para tabelas relacionadas
CREATE POLICY "Usuários autenticados podem ver pontos de calibração" ON pontos_calibracao FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir pontos de calibração" ON pontos_calibracao FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem atualizar pontos de calibração" ON pontos_calibracao FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar pontos de calibração" ON pontos_calibracao FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver critérios de inspeção" ON criterios_inspecao FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir critérios de inspeção" ON criterios_inspecao FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem atualizar critérios de inspeção" ON criterios_inspecao FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar critérios de inspeção" ON criterios_inspecao FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para fotos e documentos
CREATE POLICY "Usuários autenticados podem ver fotos de equipamentos" ON fotos_equipamentos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir fotos de equipamentos" ON fotos_equipamentos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar fotos de equipamentos" ON fotos_equipamentos FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver documentos de equipamentos" ON documentos_equipamentos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir documentos de equipamentos" ON documentos_equipamentos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar documentos de equipamentos" ON documentos_equipamentos FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para fotos e documentos de calibrações
CREATE POLICY "Usuários autenticados podem ver fotos de calibrações" ON fotos_calibracoes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir fotos de calibrações" ON fotos_calibracoes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar fotos de calibrações" ON fotos_calibracoes FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver documentos de calibrações" ON documentos_calibracoes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir documentos de calibrações" ON documentos_calibracoes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar documentos de calibrações" ON documentos_calibracoes FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para fotos e documentos de manutenções
CREATE POLICY "Usuários autenticados podem ver fotos de manutenções" ON fotos_manutencoes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir fotos de manutenções" ON fotos_manutencoes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar fotos de manutenções" ON fotos_manutencoes FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver documentos de manutenções" ON documentos_manutencoes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir documentos de manutenções" ON documentos_manutencoes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar documentos de manutenções" ON documentos_manutencoes FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para fotos e documentos de inspeções
CREATE POLICY "Usuários autenticados podem ver fotos de inspeções" ON fotos_inspecoes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir fotos de inspeções" ON fotos_inspecoes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar fotos de inspeções" ON fotos_inspecoes FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver documentos de inspeções" ON documentos_inspecoes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem inserir documentos de inspeções" ON documentos_inspecoes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem eliminar documentos de inspeções" ON documentos_inspecoes FOR DELETE USING (auth.role() = 'authenticated');

-- Dados de exemplo
INSERT INTO equipamentos (codigo, nome, tipo, categoria, marca, modelo, numero_serie, localizacao, departamento, responsavel, data_aquisicao, estado, valor_aquisicao, valor_atual, observacoes) VALUES
('EQ001', 'Multímetro Digital Fluke 87V', 'medicao', 'eletronico', 'Fluke', '87V', 'SN123456', 'Laboratório Principal', 'Manutenção', 'João Silva', '2023-01-15', 'ativo', 850.00, 850.00, 'Multímetro de alta precisão para medições elétricas'),
('EQ002', 'Osciloscópio Tektronix TBS1102B', 'medicao', 'eletronico', 'Tektronix', 'TBS1102B', 'SN789012', 'Laboratório Eletrónico', 'Eletrónica', 'Maria Santos', '2023-02-20', 'ativo', 1200.00, 1200.00, 'Osciloscópio digital de 2 canais'),
('EQ003', 'Gerador de Sinais HP 33120A', 'medicao', 'eletronico', 'Hewlett-Packard', '33120A', 'SN345678', 'Laboratório Eletrónico', 'Eletrónica', 'Carlos Oliveira', '2022-11-10', 'ativo', 950.00, 950.00, 'Gerador de sinais de função'),
('EQ004', 'Analisador de Espectro Rigol DSA815', 'medicao', 'eletronico', 'Rigol', 'DSA815', 'SN901234', 'Laboratório RF', 'Comunicações', 'Ana Costa', '2023-03-05', 'ativo', 2500.00, 2500.00, 'Analisador de espectro para RF'),
('EQ005', 'Fonte de Alimentação Agilent E3631A', 'medicao', 'eletronico', 'Agilent', 'E3631A', 'SN567890', 'Laboratório Principal', 'Manutenção', 'Pedro Martins', '2022-08-15', 'ativo', 1800.00, 1800.00, 'Fonte de alimentação tripla'),
('EQ006', 'Termómetro Digital Testo 0560', 'medicao', 'optico', 'Testo', '0560', 'SN234567', 'Armazém', 'Logística', 'Luísa Ferreira', '2023-04-12', 'ativo', 150.00, 150.00, 'Termómetro de infravermelhos'),
('EQ007', 'Câmara Térmica FLIR E4', 'medicao', 'optico', 'FLIR', 'E4', 'SN678901', 'Manutenção Preventiva', 'Manutenção', 'Rui Alves', '2023-05-20', 'ativo', 3500.00, 3500.00, 'Câmara térmica para inspeções'),
('EQ008', 'Medidor de Vibrações SKF TKRT 20', 'medicao', 'mecanico', 'SKF', 'TKRT 20', 'SN123789', 'Oficina Mecânica', 'Mecânica', 'Fernando Lima', '2022-12-03', 'ativo', 450.00, 450.00, 'Medidor de vibrações portátil'),
('EQ009', 'Analisador de Qualidade de Energia Fluke 435', 'medicao', 'eletrico', 'Fluke', '435', 'SN456123', 'Subestação', 'Eletricidade', 'Manuel Sousa', '2023-06-08', 'ativo', 4200.00, 4200.00, 'Analisador de qualidade de energia'),
('EQ010', 'Medidor de Espessura Elcometer 456', 'medicao', 'optico', 'Elcometer', '456', 'SN789456', 'Laboratório de Pinturas', 'Pinturas', 'Isabel Rodrigues', '2023-01-30', 'ativo', 280.00, 280.00, 'Medidor de espessura de revestimentos');

INSERT INTO calibracoes (equipamento_id, numero_calibracao, tipo_calibracao, data_calibracao, data_proxima_calibracao, laboratorio, tecnico_responsavel, certificado_calibracao, resultado, incerteza_medicao, unidade_incerteza, custo, observacoes) VALUES
((SELECT id FROM equipamentos WHERE codigo = 'EQ001'), 'CAL001-2024', 'periodica', '2024-01-15', '2025-01-15', 'Laboratório de Calibração IPQ', 'Dr. António Pereira', 'CERT-2024-001', 'aprovado', 0.001, 'V', 120.00, 'Calibração periódica anual'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ002'), 'CAL002-2024', 'periodica', '2024-02-10', '2025-02-10', 'Laboratório de Calibração IPQ', 'Dr. António Pereira', 'CERT-2024-002', 'aprovado', 0.002, 'V', 150.00, 'Calibração periódica anual'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ003'), 'CAL003-2024', 'periodica', '2024-01-20', '2025-01-20', 'Laboratório de Calibração IPQ', 'Dr. António Pereira', 'CERT-2024-003', 'aprovado', 0.001, 'Hz', 100.00, 'Calibração periódica anual'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ004'), 'CAL004-2024', 'inicial', '2024-03-05', '2025-03-05', 'Laboratório de Calibração IPQ', 'Dr. António Pereira', 'CERT-2024-004', 'aprovado', 0.005, 'dB', 200.00, 'Calibração inicial'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ005'), 'CAL005-2024', 'periodica', '2024-02-25', '2025-02-25', 'Laboratório de Calibração IPQ', 'Dr. António Pereira', 'CERT-2024-005', 'aprovado', 0.003, 'V', 180.00, 'Calibração periódica anual'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ006'), 'CAL006-2024', 'periodica', '2024-04-12', '2025-04-12', 'Laboratório de Calibração IPQ', 'Dr. António Pereira', 'CERT-2024-006', 'aprovado', 0.5, '°C', 80.00, 'Calibração periódica anual'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ007'), 'CAL007-2024', 'inicial', '2024-05-20', '2025-05-20', 'Laboratório de Calibração IPQ', 'Dr. António Pereira', 'CERT-2024-007', 'aprovado', 2.0, '°C', 300.00, 'Calibração inicial'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ008'), 'CAL008-2024', 'periodica', '2024-03-15', '2025-03-15', 'Laboratório de Calibração IPQ', 'Dr. António Pereira', 'CERT-2024-008', 'aprovado', 0.1, 'mm/s', 90.00, 'Calibração periódica anual'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ009'), 'CAL009-2024', 'periodica', '2024-06-08', '2025-06-08', 'Laboratório de Calibração IPQ', 'Dr. António Pereira', 'CERT-2024-009', 'aprovado', 0.01, 'V', 250.00, 'Calibração periódica anual'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ010'), 'CAL010-2024', 'periodica', '2024-02-15', '2025-02-15', 'Laboratório de Calibração IPQ', 'Dr. António Pereira', 'CERT-2024-010', 'aprovado', 1.0, 'μm', 70.00, 'Calibração periódica anual');

INSERT INTO manutencoes (equipamento_id, tipo_manutencao, data_manutencao, data_proxima_manutencao, descricao, acoes_realizadas, custo, tecnico_responsavel, fornecedor, resultado, observacoes) VALUES
((SELECT id FROM equipamentos WHERE codigo = 'EQ001'), 'preventiva', '2024-01-10', '2024-07-10', 'Manutenção preventiva semestral', 'Limpeza, verificação de baterias, teste de funcionalidade', 50.00, 'João Silva', 'Manutenção Interna', 'concluida', 'Equipamento em perfeitas condições'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ002'), 'preventiva', '2024-02-05', '2024-08-05', 'Manutenção preventiva semestral', 'Limpeza de lentes, verificação de conectores, atualização de firmware', 80.00, 'Maria Santos', 'Manutenção Interna', 'concluida', 'Firmware atualizado com sucesso'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ003'), 'corretiva', '2024-01-25', NULL, 'Substituição de display LCD', 'Display LCD avariado, substituído por peça original', 200.00, 'Carlos Oliveira', 'Hewlett-Packard', 'concluida', 'Equipamento funcionando normalmente'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ004'), 'preventiva', '2024-03-10', '2024-09-10', 'Manutenção preventiva semestral', 'Limpeza de filtros, verificação de conectores RF', 120.00, 'Ana Costa', 'Manutenção Interna', 'concluida', 'Filtros limpos e verificados'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ005'), 'preventiva', '2024-02-20', '2024-08-20', 'Manutenção preventiva semestral', 'Limpeza, verificação de tensões de saída, teste de carga', 60.00, 'Pedro Martins', 'Manutenção Interna', 'concluida', 'Todas as saídas verificadas'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ006'), 'preventiva', '2024-04-15', '2024-10-15', 'Manutenção preventiva semestral', 'Limpeza de lente, verificação de baterias, calibração', 40.00, 'Luísa Ferreira', 'Manutenção Interna', 'concluida', 'Equipamento calibrado'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ007'), 'preventiva', '2024-05-25', '2024-11-25', 'Manutenção preventiva semestral', 'Limpeza de lente, verificação de baterias, teste de imagem', 100.00, 'Rui Alves', 'Manutenção Interna', 'concluida', 'Imagem térmica nítida'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ008'), 'preventiva', '2024-03-20', '2024-09-20', 'Manutenção preventiva semestral', 'Limpeza de sensor, verificação de baterias, teste de medição', 45.00, 'Fernando Lima', 'Manutenção Interna', 'concluida', 'Sensor funcionando corretamente'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ009'), 'preventiva', '2024-06-15', '2024-12-15', 'Manutenção preventiva semestral', 'Limpeza, verificação de conectores, teste de medição', 150.00, 'Manuel Sousa', 'Manutenção Interna', 'concluida', 'Todas as medições corretas'),
((SELECT id FROM equipamentos WHERE codigo = 'EQ010'), 'preventiva', '2024-02-10', '2024-08-10', 'Manutenção preventiva semestral', 'Limpeza de sonda, verificação de baterias, teste de medição', 35.00, 'Isabel Rodrigues', 'Manutenção Interna', 'concluida', 'Sonda em perfeitas condições');

INSERT INTO inspecoes (equipamento_id, data_inspecao, tipo_inspecao, inspetor, resultado, observacoes, duracao_horas) VALUES
((SELECT id FROM equipamentos WHERE codigo = 'EQ001'), '2024-01-20', 'rotina', 'João Silva', 'aprovado', 'Equipamento em perfeitas condições de funcionamento', 2.5),
((SELECT id FROM equipamentos WHERE codigo = 'EQ002'), '2024-02-15', 'rotina', 'Maria Santos', 'aprovado', 'Osciloscópio funcionando corretamente', 3.0),
((SELECT id FROM equipamentos WHERE codigo = 'EQ003'), '2024-01-30', 'rotina', 'Carlos Oliveira', 'aprovado', 'Gerador de sinais operacional', 2.0),
((SELECT id FROM equipamentos WHERE codigo = 'EQ004'), '2024-03-20', 'rotina', 'Ana Costa', 'aprovado', 'Analisador de espectro funcionando', 4.0),
((SELECT id FROM equipamentos WHERE codigo = 'EQ005'), '2024-02-25', 'rotina', 'Pedro Martins', 'aprovado', 'Fonte de alimentação operacional', 2.5),
((SELECT id FROM equipamentos WHERE codigo = 'EQ006'), '2024-04-20', 'rotina', 'Luísa Ferreira', 'aprovado', 'Termómetro funcionando corretamente', 1.5),
((SELECT id FROM equipamentos WHERE codigo = 'EQ007'), '2024-05-30', 'rotina', 'Rui Alves', 'aprovado', 'Câmara térmica operacional', 3.5),
((SELECT id FROM equipamentos WHERE codigo = 'EQ008'), '2024-03-25', 'rotina', 'Fernando Lima', 'aprovado', 'Medidor de vibrações funcionando', 2.0),
((SELECT id FROM equipamentos WHERE codigo = 'EQ009'), '2024-06-20', 'rotina', 'Manuel Sousa', 'aprovado', 'Analisador de qualidade de energia operacional', 4.5),
((SELECT id FROM equipamentos WHERE codigo = 'EQ010'), '2024-02-20', 'rotina', 'Isabel Rodrigues', 'aprovado', 'Medidor de espessura funcionando', 1.5);

-- Inserir alguns pontos de calibração de exemplo
INSERT INTO pontos_calibracao (calibracao_id, ponto_medicao, valor_nominal, valor_medido, erro, incerteza, unidade, observacoes) VALUES
((SELECT id FROM calibracoes WHERE numero_calibracao = 'CAL001-2024'), 1, 1.000, 1.001, 0.001, 0.001, 'V', 'Ponto de calibração 1V'),
((SELECT id FROM calibracoes WHERE numero_calibracao = 'CAL001-2024'), 2, 10.000, 10.002, 0.002, 0.001, 'V', 'Ponto de calibração 10V'),
((SELECT id FROM calibracoes WHERE numero_calibracao = 'CAL002-2024'), 1, 1.000, 0.999, -0.001, 0.002, 'V', 'Ponto de calibração 1V'),
((SELECT id FROM calibracoes WHERE numero_calibracao = 'CAL002-2024'), 2, 5.000, 5.001, 0.001, 0.002, 'V', 'Ponto de calibração 5V');

-- Inserir alguns critérios de inspeção de exemplo
INSERT INTO criterios_inspecao (inspecao_id, criterio, resultado, observacoes) VALUES
((SELECT id FROM inspecoes WHERE equipamento_id = (SELECT id FROM equipamentos WHERE codigo = 'EQ001')), 'Funcionamento do display', 'conforme', 'Display funcionando corretamente'),
((SELECT id FROM inspecoes WHERE equipamento_id = (SELECT id FROM equipamentos WHERE codigo = 'EQ001')), 'Precisão das medições', 'conforme', 'Medições dentro da especificação'),
((SELECT id FROM inspecoes WHERE equipamento_id = (SELECT id FROM equipamentos WHERE codigo = 'EQ002')), 'Funcionamento do display', 'conforme', 'Display funcionando corretamente'),
((SELECT id FROM inspecoes WHERE equipamento_id = (SELECT id FROM equipamentos WHERE codigo = 'EQ002')), 'Qualidade da imagem', 'conforme', 'Imagem nítida e estável');
