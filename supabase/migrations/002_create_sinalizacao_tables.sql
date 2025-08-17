-- =====================================================
-- MIGRAÇÃO: Criação das Tabelas de Sinalização Ferroviária
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: sinalizacoes
-- =====================================================
CREATE TABLE IF NOT EXISTS sinalizacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    localizacao VARCHAR(200) NOT NULL,
    km_inicial DECIMAL(10,2) NOT NULL,
    km_final DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    fabricante VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    data_instalacao DATE NOT NULL,
    status_operacional VARCHAR(50) NOT NULL,
    observacoes TEXT,
    parametros JSONB DEFAULT '{}',
    ultima_inspecao DATE,
    proxima_inspecao DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: inspecoes_sinalizacao
-- =====================================================
CREATE TABLE IF NOT EXISTS inspecoes_sinalizacao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sinalizacao_id UUID REFERENCES sinalizacoes(id) ON DELETE CASCADE,
    data_inspecao DATE NOT NULL,
    tipo_inspecao VARCHAR(100) NOT NULL,
    resultado VARCHAR(50) NOT NULL,
    observacoes TEXT,
    responsavel VARCHAR(200),
    proxima_inspecao DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para sinalizacoes
CREATE INDEX IF NOT EXISTS idx_sinalizacoes_codigo ON sinalizacoes(codigo);
CREATE INDEX IF NOT EXISTS idx_sinalizacoes_tipo ON sinalizacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_sinalizacoes_categoria ON sinalizacoes(categoria);
CREATE INDEX IF NOT EXISTS idx_sinalizacoes_estado ON sinalizacoes(estado);
CREATE INDEX IF NOT EXISTS idx_sinalizacoes_fabricante ON sinalizacoes(fabricante);
CREATE INDEX IF NOT EXISTS idx_sinalizacoes_status ON sinalizacoes(status_operacional);
CREATE INDEX IF NOT EXISTS idx_sinalizacoes_km ON sinalizacoes(km_inicial, km_final);
CREATE INDEX IF NOT EXISTS idx_sinalizacoes_data_instalacao ON sinalizacoes(data_instalacao);
CREATE INDEX IF NOT EXISTS idx_sinalizacoes_ultima_inspecao ON sinalizacoes(ultima_inspecao);

-- Índices para inspecoes_sinalizacao
CREATE INDEX IF NOT EXISTS idx_inspecoes_sinalizacao_sinalizacao_id ON inspecoes_sinalizacao(sinalizacao_id);
CREATE INDEX IF NOT EXISTS idx_inspecoes_sinalizacao_data ON inspecoes_sinalizacao(data_inspecao);
CREATE INDEX IF NOT EXISTS idx_inspecoes_sinalizacao_tipo ON inspecoes_sinalizacao(tipo_inspecao);
CREATE INDEX IF NOT EXISTS idx_inspecoes_sinalizacao_resultado ON inspecoes_sinalizacao(resultado);

-- =====================================================
-- FUNÇÃO PARA ATUALIZAR updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_sinalizacoes_updated_at 
    BEFORE UPDATE ON sinalizacoes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspecoes_sinalizacao_updated_at 
    BEFORE UPDATE ON inspecoes_sinalizacao 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Inserir dados de exemplo para sinalizações
INSERT INTO sinalizacoes (codigo, tipo, categoria, localizacao, km_inicial, km_final, estado, fabricante, modelo, data_instalacao, status_operacional, observacoes, parametros, ultima_inspecao, proxima_inspecao) VALUES
('SIG-001-2024', 'Sinal Luminoso', 'Sinalização de Via', 'Entrada Norte', 0.0, 2.5, 'Operacional', 'Siemens', 'SIGMA-2000', '2024-01-15', 'Ativo', 'Sinalização principal da entrada norte', '{"alcance": 500, "frequencia": "2.4 GHz", "potencia": 25, "sensibilidade": -85}', '2024-03-15', '2024-06-15'),
('SIG-002-2024', 'Sinal Sonoro', 'Sinalização de Passagem', 'Curva Sul', 5.2, 7.8, 'Operacional', 'Alstom', 'ALERT-3000', '2024-02-20', 'Ativo', 'Sinal sonoro para curva perigosa', '{"alcance": 300, "frequencia": "1.8 GHz", "potencia": 30, "sensibilidade": -90}', '2024-04-10', '2024-07-10'),
('SIG-003-2024', 'Sinal Eletrônico', 'Sinalização de Velocidade', 'Reta Central', 12.0, 15.5, 'Manutenção', 'Bombardier', 'SPEED-1500', '2024-01-10', 'Teste', 'Sinal de controle de velocidade', '{"alcance": 800, "frequencia": "3.0 GHz", "potencia": 40, "sensibilidade": -80}', '2024-05-05', '2024-08-05'),
('SIG-004-2024', 'Sinal de Velocidade', 'Sinalização de Segurança', 'Túnel Leste', 25.0, 28.0, 'Operacional', 'Thales', 'TUNNEL-500', '2024-03-05', 'Ativo', 'Sinalização específica para túnel', '{"alcance": 200, "frequencia": "2.0 GHz", "potencia": 20, "sensibilidade": -95}', '2024-06-20', '2024-09-20'),
('SIG-005-2024', 'Sinal de Passagem', 'Sinalização de Emergência', 'Ponte Oeste', 35.5, 38.0, 'Avariada', 'Ansaldo', 'BRIDGE-1000', '2024-02-28', 'Inativo', 'Sinal de emergência na ponte', '{"alcance": 400, "frequencia": "2.6 GHz", "potencia": 35, "sensibilidade": -88}', '2024-04-15', '2024-07-15'),
('SIG-006-2024', 'Sinal Luminoso', 'Sinalização de Via', 'Estação Central', 45.0, 47.5, 'Operacional', 'Siemens', 'SIGMA-2000', '2024-01-25', 'Ativo', 'Sinalização da estação central', '{"alcance": 600, "frequencia": "2.4 GHz", "potencia": 28, "sensibilidade": -82}', '2024-05-30', '2024-08-30'),
('SIG-007-2024', 'Sinal Eletrônico', 'Sinalização de Velocidade', 'Descida Norte', 55.0, 58.0, 'Operacional', 'Bombardier', 'SPEED-1500', '2024-03-12', 'Ativo', 'Controle de velocidade em descida', '{"alcance": 700, "frequencia": "3.0 GHz", "potencia": 45, "sensibilidade": -78}', '2024-06-25', '2024-09-25'),
('SIG-008-2024', 'Sinal Sonoro', 'Sinalização de Segurança', 'Cruzamento Sul', 65.0, 67.5, 'Desativada', 'Alstom', 'ALERT-3000', '2024-02-15', 'Inativo', 'Sinal sonoro no cruzamento', '{"alcance": 250, "frequencia": "1.8 GHz", "potencia": 22, "sensibilidade": -92}', '2024-04-08', '2024-07-08'),
('SIG-009-2024', 'Sinal de Passagem', 'Sinalização de Via', 'Subida Leste', 75.0, 78.0, 'Operacional', 'Thales', 'CLIMB-800', '2024-01-30', 'Ativo', 'Sinalização na subida íngreme', '{"alcance": 350, "frequencia": "2.2 GHz", "potencia": 32, "sensibilidade": -85}', '2024-05-12', '2024-08-12'),
('SIG-010-2024', 'Sinal Luminoso', 'Sinalização de Emergência', 'Saída Oeste', 85.0, 87.5, 'Operacional', 'Siemens', 'EXIT-1200', '2024-03-18', 'Ativo', 'Sinal de emergência na saída', '{"alcance": 450, "frequencia": "2.4 GHz", "potencia": 38, "sensibilidade": -80}', '2024-06-18', '2024-09-18');

-- Inserir dados de exemplo para inspeções
INSERT INTO inspecoes_sinalizacao (sinalizacao_id, data_inspecao, tipo_inspecao, resultado, observacoes, responsavel, proxima_inspecao) VALUES
((SELECT id FROM sinalizacoes WHERE codigo = 'SIG-001-2024'), '2024-03-15', 'Inspeção Preventiva', 'Aprovado', 'Sinalização funcionando perfeitamente', 'João Silva', '2024-06-15'),
((SELECT id FROM sinalizacoes WHERE codigo = 'SIG-002-2024'), '2024-04-10', 'Inspeção Corretiva', 'Aprovado', 'Ajuste realizado no volume', 'Maria Santos', '2024-07-10'),
((SELECT id FROM sinalizacoes WHERE codigo = 'SIG-003-2024'), '2024-05-05', 'Inspeção Preventiva', 'Reprovado', 'Necessita manutenção urgente', 'Pedro Costa', '2024-08-05'),
((SELECT id FROM sinalizacoes WHERE codigo = 'SIG-004-2024'), '2024-06-20', 'Inspeção Preventiva', 'Aprovado', 'Sistema operacional', 'Ana Oliveira', '2024-09-20'),
((SELECT id FROM sinalizacoes WHERE codigo = 'SIG-005-2024'), '2024-04-15', 'Inspeção Corretiva', 'Reprovado', 'Falha no sistema eletrônico', 'Carlos Lima', '2024-07-15'),
((SELECT id FROM sinalizacoes WHERE codigo = 'SIG-006-2024'), '2024-05-30', 'Inspeção Preventiva', 'Aprovado', 'Todas as funções operacionais', 'Lucia Ferreira', '2024-08-30'),
((SELECT id FROM sinalizacoes WHERE codigo = 'SIG-007-2024'), '2024-06-25', 'Inspeção Preventiva', 'Aprovado', 'Calibração realizada', 'Roberto Alves', '2024-09-25'),
((SELECT id FROM sinalizacoes WHERE codigo = 'SIG-008-2024'), '2024-04-08', 'Inspeção Corretiva', 'Reprovado', 'Sistema desativado por segurança', 'Fernanda Rocha', '2024-07-08'),
((SELECT id FROM sinalizacoes WHERE codigo = 'SIG-009-2024'), '2024-05-12', 'Inspeção Preventiva', 'Aprovado', 'Funcionamento normal', 'Marcos Pereira', '2024-08-12'),
((SELECT id FROM sinalizacoes WHERE codigo = 'SIG-010-2024'), '2024-06-18', 'Inspeção Preventiva', 'Aprovado', 'Sistema em perfeito estado', 'Juliana Martins', '2024-09-18');

-- =====================================================
-- POLÍTICAS DE SEGURANÇA RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE sinalizacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspecoes_sinalizacao ENABLE ROW LEVEL SECURITY;

-- Políticas para sinalizacoes
CREATE POLICY "Permitir leitura de sinalizações para usuários autenticados" ON sinalizacoes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção de sinalizações para usuários autenticados" ON sinalizacoes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização de sinalizações para usuários autenticados" ON sinalizacoes
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão de sinalizações para usuários autenticados" ON sinalizacoes
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para inspecoes_sinalizacao
CREATE POLICY "Permitir leitura de inspeções para usuários autenticados" ON inspecoes_sinalizacao
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção de inspeções para usuários autenticados" ON inspecoes_sinalizacao
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização de inspeções para usuários autenticados" ON inspecoes_sinalizacao
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão de inspeções para usuários autenticados" ON inspecoes_sinalizacao
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- FUNÇÕES ÚTEIS
-- =====================================================

-- Função para obter estatísticas de sinalização
CREATE OR REPLACE FUNCTION get_sinalizacao_stats()
RETURNS TABLE (
    total_sinalizacoes BIGINT,
    operacionais BIGINT,
    manutencao BIGINT,
    avariadas BIGINT,
    desativadas BIGINT,
    proxima_inspecao_30dias BIGINT,
    ultima_inspecao_90dias BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_sinalizacoes,
        COUNT(*) FILTER (WHERE estado = 'Operacional') as operacionais,
        COUNT(*) FILTER (WHERE estado = 'Manutenção') as manutencao,
        COUNT(*) FILTER (WHERE estado = 'Avariada') as avariadas,
        COUNT(*) FILTER (WHERE estado = 'Desativada') as desativadas,
        COUNT(*) FILTER (WHERE proxima_inspecao BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') as proxima_inspecao_30dias,
        COUNT(*) FILTER (WHERE ultima_inspecao < CURRENT_DATE - INTERVAL '90 days') as ultima_inspecao_90dias
    FROM sinalizacoes;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE sinalizacoes IS 'Tabela principal para armazenar dados de sinalização ferroviária';
COMMENT ON TABLE inspecoes_sinalizacao IS 'Tabela para armazenar histórico de inspeções das sinalizações';
COMMENT ON FUNCTION get_sinalizacao_stats() IS 'Função para obter estatísticas gerais das sinalizações';

-- =====================================================
-- FIM DA MIGRAÇÃO
-- =====================================================
