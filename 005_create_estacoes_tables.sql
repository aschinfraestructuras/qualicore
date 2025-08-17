-- =====================================================
-- SCRIPT SQL PARA TABELAS DE ESTAÇÕES FERROVIÁRIAS
-- Seguindo Normativas Portuguesas e Europeias
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA PRINCIPAL: estacoes
-- =====================================================
CREATE TABLE IF NOT EXISTS estacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(100) NOT NULL CHECK (tipo IN ('Principal', 'Secundária', 'Terminal', 'Intercambiador')),
    categoria VARCHAR(100) NOT NULL CHECK (categoria IN ('Terminal', 'Intercambiador', 'Regional', 'Metropolitana')),
    localizacao TEXT NOT NULL,
    km DECIMAL(10,3) NOT NULL,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('Ativo', 'Inativo', 'Manutenção', 'Avaria', 'Desligado', 'Planejado', 'Em Construção')),
    operador VARCHAR(150) NOT NULL,
    data_inauguracao DATE NOT NULL,
    status_operacional VARCHAR(50) NOT NULL CHECK (status_operacional IN ('Operacional', 'Pendente', 'Manutenção', 'Avaria', 'Teste', 'Inspeção')),
    observacoes TEXT,
    parametros JSONB DEFAULT '{}',
    ultima_inspecao DATE,
    proxima_inspecao DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA DE INSPEÇÕES: inspecoes_estacoes
-- =====================================================
CREATE TABLE IF NOT EXISTS inspecoes_estacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estacao_id UUID NOT NULL REFERENCES estacoes(id) ON DELETE CASCADE,
    data_inspecao DATE NOT NULL,
    tipo_inspecao VARCHAR(100) NOT NULL CHECK (tipo_inspecao IN ('Preventiva', 'Corretiva', 'Periódica', 'Especial', 'Emergencial', 'Estrutural', 'Funcional')),
    resultado VARCHAR(50) NOT NULL CHECK (resultado IN ('Conforme', 'Não Conforme', 'Pendente', 'Aprovado', 'Reprovado', 'Condicional')),
    observacoes TEXT,
    responsavel VARCHAR(150) NOT NULL,
    proxima_inspecao DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_estacoes_codigo ON estacoes(codigo);
CREATE INDEX IF NOT EXISTS idx_estacoes_nome ON estacoes(nome);
CREATE INDEX IF NOT EXISTS idx_estacoes_tipo ON estacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_estacoes_estado ON estacoes(estado);
CREATE INDEX IF NOT EXISTS idx_estacoes_status ON estacoes(status_operacional);
CREATE INDEX IF NOT EXISTS idx_estacoes_km ON estacoes(km);
CREATE INDEX IF NOT EXISTS idx_estacoes_data_inauguracao ON estacoes(data_inauguracao);
CREATE INDEX IF NOT EXISTS idx_estacoes_proxima_inspecao ON estacoes(proxima_inspecao);
CREATE INDEX IF NOT EXISTS idx_estacoes_operador ON estacoes(operador);

CREATE INDEX IF NOT EXISTS idx_inspecoes_estacoes_id ON inspecoes_estacoes(estacao_id);
CREATE INDEX IF NOT EXISTS idx_inspecoes_estacoes_data ON inspecoes_estacoes(data_inspecao);
CREATE INDEX IF NOT EXISTS idx_inspecoes_estacoes_tipo ON inspecoes_estacoes(tipo_inspecao);
CREATE INDEX IF NOT EXISTS idx_inspecoes_estacoes_resultado ON inspecoes_estacoes(resultado);

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_estacoes_updated_at 
    BEFORE UPDATE ON estacoes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspecoes_estacoes_updated_at 
    BEFORE UPDATE ON inspecoes_estacoes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO PARA ESTATÍSTICAS
-- =====================================================
CREATE OR REPLACE FUNCTION get_estacoes_stats()
RETURNS TABLE (
    total_estacoes BIGINT,
    ativas BIGINT,
    em_manutencao BIGINT,
    com_avaria BIGINT,
    inspecoes_pendentes BIGINT,
    tipos_distribuicao JSONB,
    status_distribuicao JSONB,
    proximas_inspecoes_7d BIGINT,
    proximas_inspecoes_30d BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_estacoes,
        COUNT(*) FILTER (WHERE estado = 'Ativo') as ativas,
        COUNT(*) FILTER (WHERE estado = 'Manutenção') as em_manutencao,
        COUNT(*) FILTER (WHERE estado = 'Avaria') as com_avaria,
        COUNT(*) FILTER (WHERE proxima_inspecao <= CURRENT_DATE + INTERVAL '30 days') as inspecoes_pendentes,
        (SELECT jsonb_object_agg(tipo, count) FROM (
            SELECT tipo, COUNT(*) as count 
            FROM estacoes 
            GROUP BY tipo
        ) t) as tipos_distribuicao,
        (SELECT jsonb_object_agg(estado, count) FROM (
            SELECT estado, COUNT(*) as count 
            FROM estacoes 
            GROUP BY estado
        ) s) as status_distribuicao,
        COUNT(*) FILTER (WHERE proxima_inspecao BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days') as proximas_inspecoes_7d,
        COUNT(*) FILTER (WHERE proxima_inspecao BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') as proximas_inspecoes_30d
    FROM estacoes;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE estacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspecoes_estacoes ENABLE ROW LEVEL SECURITY;

-- Políticas para estacoes
CREATE POLICY "Permitir leitura para usuários autenticados" ON estacoes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção para usuários autenticados" ON estacoes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados" ON estacoes
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados" ON estacoes
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para inspecoes_estacoes
CREATE POLICY "Permitir leitura para usuários autenticados" ON inspecoes_estacoes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção para usuários autenticados" ON inspecoes_estacoes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados" ON inspecoes_estacoes
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados" ON inspecoes_estacoes
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Inserir estações de exemplo
INSERT INTO estacoes (codigo, nome, tipo, categoria, localizacao, km, estado, operador, data_inauguracao, status_operacional, observacoes, parametros, ultima_inspecao, proxima_inspecao) VALUES
('EST-001-2024', 'Estação Central de Lisboa', 'Principal', 'Terminal', 'Lisboa, Portugal', 0.000, 'Ativo', 'CP - Comboios de Portugal', '2024-01-15', 'Operacional', 'Estação principal de Lisboa com múltiplas linhas e ligações regionais', '{"num_plataformas": 8, "num_vias": 12, "area_total": 15000, "capacidade_passageiros": 50000}', '2024-01-20', '2024-04-20'),
('EST-002-2024', 'Estação do Porto - São Bento', 'Principal', 'Terminal', 'Porto, Portugal', 315.500, 'Ativo', 'CP - Comboios de Portugal', '2024-01-10', 'Operacional', 'Estação histórica do Porto com azulejos tradicionais e ligações nacionais', '{"num_plataformas": 6, "num_vias": 8, "area_total": 8000, "capacidade_passageiros": 30000}', '2024-01-25', '2024-04-25'),
('EST-003-2024', 'Estação de Coimbra-B', 'Secundária', 'Intercambiador', 'Coimbra, Portugal', 205.200, 'Ativo', 'CP - Comboios de Portugal', '2024-01-20', 'Operacional', 'Estação de Coimbra com ligações regionais e intercâmbio', '{"num_plataformas": 4, "num_vias": 6, "area_total": 5000, "capacidade_passageiros": 20000}', '2024-01-30', '2024-04-30'),
('EST-004-2024', 'Estação de Braga', 'Secundária', 'Terminal', 'Braga, Portugal', 365.800, 'Manutenção', 'CP - Comboios de Portugal', '2024-01-05', 'Manutenção', 'Estação em manutenção preventiva - renovação de plataformas', '{"num_plataformas": 3, "num_vias": 4, "area_total": 3000, "capacidade_passageiros": 15000}', '2024-02-01', '2024-05-01'),
('EST-005-2024', 'Estação de Faro', 'Secundária', 'Terminal', 'Faro, Portugal', 278.900, 'Ativo', 'CP - Comboios de Portugal', '2024-01-12', 'Operacional', 'Estação do Algarve com ligações regionais e turísticas', '{"num_plataformas": 3, "num_vias": 4, "area_total": 2500, "capacidade_passageiros": 12000}', '2024-01-18', '2024-04-18'),
('EST-006-2024', 'Estação de Aveiro', 'Secundária', 'Intercambiador', 'Aveiro, Portugal', 234.100, 'Ativo', 'CP - Comboios de Portugal', '2024-01-08', 'Operacional', 'Estação de Aveiro com ligações regionais e urbanas', '{"num_plataformas": 4, "num_vias": 5, "area_total": 4000, "capacidade_passageiros": 18000}', '2024-01-22', '2024-04-22'),
('EST-007-2024', 'Estação de Leiria', 'Secundária', 'Regional', 'Leiria, Portugal', 120.500, 'Ativo', 'CP - Comboios de Portugal', '2024-01-25', 'Operacional', 'Estação regional de Leiria com ligações locais', '{"num_plataformas": 2, "num_vias": 3, "area_total": 1500, "capacidade_passageiros": 8000}', '2024-02-05', '2024-05-05'),
('EST-008-2024', 'Estação de Viseu', 'Secundária', 'Regional', 'Viseu, Portugal', 285.300, 'Ativo', 'CP - Comboios de Portugal', '2024-01-18', 'Operacional', 'Estação regional de Viseu com ligações locais', '{"num_plataformas": 2, "num_vias": 3, "area_total": 1800, "capacidade_passageiros": 10000}', '2024-01-28', '2024-04-28'),
('EST-009-2024', 'Estação de Évora', 'Secundária', 'Regional', 'Évora, Portugal', 130.700, 'Ativo', 'CP - Comboios de Portugal', '2024-01-30', 'Operacional', 'Estação regional de Évora com ligações locais', '{"num_plataformas": 2, "num_vias": 3, "area_total": 1600, "capacidade_passageiros": 9000}', '2024-02-10', '2024-05-10'),
('EST-010-2024', 'Estação de Castelo Branco', 'Secundária', 'Regional', 'Castelo Branco, Portugal', 195.400, 'Ativo', 'CP - Comboios de Portugal', '2024-01-14', 'Operacional', 'Estação regional de Castelo Branco com ligações locais', '{"num_plataformas": 2, "num_vias": 3, "area_total": 1400, "capacidade_passageiros": 7000}', '2024-01-24', '2024-04-24');

-- Inserir inspeções de exemplo
INSERT INTO inspecoes_estacoes (estacao_id, data_inspecao, tipo_inspecao, resultado, observacoes, responsavel, proxima_inspecao) VALUES
((SELECT id FROM estacoes WHERE codigo = 'EST-001-2024'), '2024-01-20', 'Periódica', 'Conforme', 'Inspeção periódica realizada conforme cronograma. Estação operando normalmente.', 'Eng. João Silva', '2024-04-20'),
((SELECT id FROM estacoes WHERE codigo = 'EST-002-2024'), '2024-01-25', 'Preventiva', 'Conforme', 'Manutenção preventiva realizada. Todos os sistemas operacionais.', 'Eng. Maria Santos', '2024-04-25'),
((SELECT id FROM estacoes WHERE codigo = 'EST-003-2024'), '2024-01-30', 'Periódica', 'Conforme', 'Inspeção de rotina. Estação funcionando adequadamente.', 'Téc. Pedro Costa', '2024-04-30'),
((SELECT id FROM estacoes WHERE codigo = 'EST-004-2024'), '2024-02-01', 'Corretiva', 'Pendente', 'Manutenção corretiva em andamento. Renovação de plataformas.', 'Eng. Fernanda Costa', '2024-05-01'),
((SELECT id FROM estacoes WHERE codigo = 'EST-005-2024'), '2024-01-18', 'Periódica', 'Conforme', 'Inspeção de rotina. Estação em bom estado.', 'Eng. Carlos Lima', '2024-04-18'),
((SELECT id FROM estacoes WHERE codigo = 'EST-006-2024'), '2024-01-22', 'Preventiva', 'Conforme', 'Manutenção preventiva concluída. Todos os sistemas OK.', 'Eng. Sofia Rodrigues', '2024-04-22'),
((SELECT id FROM estacoes WHERE codigo = 'EST-007-2024'), '2024-02-05', 'Periódica', 'Conforme', 'Inspeção de rotina. Estação regional funcionando normalmente.', 'Téc. Miguel Ferreira', '2024-05-05'),
((SELECT id FROM estacoes WHERE codigo = 'EST-008-2024'), '2024-01-28', 'Preventiva', 'Conforme', 'Manutenção preventiva realizada. Sistemas operacionais.', 'Eng. Luísa Martins', '2024-04-28'),
((SELECT id FROM estacoes WHERE codigo = 'EST-009-2024'), '2024-02-10', 'Periódica', 'Conforme', 'Inspeção de rotina. Estação regional em bom estado.', 'Eng. Ricardo Alves', '2024-05-10'),
((SELECT id FROM estacoes WHERE codigo = 'EST-010-2024'), '2024-01-24', 'Preventiva', 'Conforme', 'Manutenção preventiva concluída. Todos os sistemas operacionais.', 'Téc. Ana Oliveira', '2024-04-24');

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================
COMMENT ON TABLE estacoes IS 'Tabela principal para registros de estações ferroviárias';
COMMENT ON TABLE inspecoes_estacoes IS 'Tabela para registros de inspeções de estações ferroviárias';

COMMENT ON COLUMN estacoes.codigo IS 'Código único de identificação da estação';
COMMENT ON COLUMN estacoes.nome IS 'Nome da estação';
COMMENT ON COLUMN estacoes.tipo IS 'Tipo de estação (Principal, Secundária, Terminal, Intercambiador)';
COMMENT ON COLUMN estacoes.categoria IS 'Categoria da estação (Terminal, Intercambiador, Regional, Metropolitana)';
COMMENT ON COLUMN estacoes.parametros IS 'Parâmetros técnicos em formato JSON (num_plataformas, num_vias, area_total, capacidade_passageiros)';
COMMENT ON COLUMN estacoes.ultima_inspecao IS 'Data da última inspeção realizada';
COMMENT ON COLUMN estacoes.proxima_inspecao IS 'Data da próxima inspeção programada';

COMMENT ON COLUMN inspecoes_estacoes.estacao_id IS 'Referência para a estação inspecionada';
COMMENT ON COLUMN inspecoes_estacoes.tipo_inspecao IS 'Tipo de inspeção realizada';
COMMENT ON COLUMN inspecoes_estacoes.resultado IS 'Resultado da inspeção';
COMMENT ON COLUMN inspecoes_estacoes.responsavel IS 'Nome do responsável pela inspeção';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
