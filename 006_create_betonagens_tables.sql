-- =====================================================
-- SCRIPT SQL PARA TABELAS DE CONTROLO DE BETONAGENS
-- Seguindo Normativas Portuguesas e Europeias
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA PRINCIPAL: betonagens
-- =====================================================
CREATE TABLE IF NOT EXISTS betonagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    obra VARCHAR(255) NOT NULL,
    elemento_estrutural VARCHAR(100) NOT NULL CHECK (elemento_estrutural IN (
        'Pilar', 'Viga', 'Laje', 'Fundação', 'Muro', 'Escada', 'Cobertura', 'Pavimento', 'Outro'
    )),
    localizacao VARCHAR(255) NOT NULL,
    data_betonagem DATE NOT NULL,
    data_ensaio_7d DATE,
    data_ensaio_28d DATE,
    fornecedor VARCHAR(100) NOT NULL,
    guia_remessa VARCHAR(100) NOT NULL,
    tipo_betao VARCHAR(50),
    aditivos VARCHAR(100) DEFAULT 'Nenhum',
    hora_limite_uso TIME,
    slump DECIMAL(5,2) CHECK (slump >= 0),
    temperatura DECIMAL(4,1) CHECK (temperatura >= -10 AND temperatura <= 50),
    resistencia_7d_1 DECIMAL(6,2) CHECK (resistencia_7d_1 >= 0),
    resistencia_7d_2 DECIMAL(6,2) CHECK (resistencia_7d_2 >= 0),
    resistencia_28d_1 DECIMAL(6,2) CHECK (resistencia_28d_1 >= 0),
    resistencia_28d_2 DECIMAL(6,2) CHECK (resistencia_28d_2 >= 0),
    resistencia_28d_3 DECIMAL(6,2) CHECK (resistencia_28d_3 >= 0),
    resistencia_rotura DECIMAL(6,2) CHECK (resistencia_rotura >= 0),
    dimensoes_provete VARCHAR(50) NOT NULL CHECK (dimensoes_provete IN (
        '15x15x15 cm', '15x30 cm', '10x20 cm', 'Outro'
    )),
    status_conformidade VARCHAR(50) NOT NULL CHECK (status_conformidade IN (
        'Conforme', 'Não Conforme', 'Pendente'
    )) DEFAULT 'Pendente',
    observacoes TEXT,
    relatorio_rotura TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA DE ENSAIOS: ensaios_betonagem
-- =====================================================
CREATE TABLE IF NOT EXISTS ensaios_betonagem (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    betonagem_id UUID NOT NULL REFERENCES betonagens(id) ON DELETE CASCADE,
    data_ensaio DATE NOT NULL,
    tipo_ensaio VARCHAR(100) NOT NULL CHECK (tipo_ensaio IN (
        'Resistência 7 dias - Probeta 1', 'Resistência 7 dias - Probeta 2',
        'Resistência 28 dias - Probeta 1', 'Resistência 28 dias - Probeta 2',
        'Resistência 28 dias - Probeta 3', 'Resistência de Rotura',
        'Slump', 'Temperatura', 'Outro'
    )),
    resultado DECIMAL(8,2) NOT NULL,
    observacoes TEXT,
    responsavel VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_betonagens_codigo ON betonagens(codigo);
CREATE INDEX IF NOT EXISTS idx_betonagens_obra ON betonagens(obra);
CREATE INDEX IF NOT EXISTS idx_betonagens_elemento_estrutural ON betonagens(elemento_estrutural);
CREATE INDEX IF NOT EXISTS idx_betonagens_localizacao ON betonagens(localizacao);
CREATE INDEX IF NOT EXISTS idx_betonagens_data_betonagem ON betonagens(data_betonagem);
CREATE INDEX IF NOT EXISTS idx_betonagens_fornecedor ON betonagens(fornecedor);
CREATE INDEX IF NOT EXISTS idx_betonagens_status_conformidade ON betonagens(status_conformidade);
CREATE INDEX IF NOT EXISTS idx_betonagens_tipo_betao ON betonagens(tipo_betao);
CREATE INDEX IF NOT EXISTS idx_betonagens_data_ensaio_7d ON betonagens(data_ensaio_7d);
CREATE INDEX IF NOT EXISTS idx_betonagens_data_ensaio_28d ON betonagens(data_ensaio_28d);

CREATE INDEX IF NOT EXISTS idx_ensaios_betonagem_betonagem_id ON ensaios_betonagem(betonagem_id);
CREATE INDEX IF NOT EXISTS idx_ensaios_betonagem_data_ensaio ON ensaios_betonagem(data_ensaio);
CREATE INDEX IF NOT EXISTS idx_ensaios_betonagem_tipo_ensaio ON ensaios_betonagem(tipo_ensaio);

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

CREATE TRIGGER update_betonagens_updated_at 
    BEFORE UPDATE ON betonagens 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ensaios_betonagem_updated_at 
    BEFORE UPDATE ON ensaios_betonagem 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO PARA ESTATÍSTICAS
-- =====================================================
CREATE OR REPLACE FUNCTION get_betonagens_stats()
RETURNS TABLE (
    total_betonagens BIGINT,
    conformes BIGINT,
    nao_conformes BIGINT,
    pendentes BIGINT,
    ensaios_7d_pendentes BIGINT,
    ensaios_28d_pendentes BIGINT,
    tipos_betao_distribuicao JSONB,
    status_distribuicao JSONB,
    obras_distribuicao JSONB,
    resistencia_media_7d DECIMAL(6,2),
    resistencia_media_28d DECIMAL(6,2),
    resistencia_media_rotura DECIMAL(6,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_betonagens,
        COUNT(*) FILTER (WHERE status_conformidade = 'Conforme') as conformes,
        COUNT(*) FILTER (WHERE status_conformidade = 'Não Conforme') as nao_conformes,
        COUNT(*) FILTER (WHERE status_conformidade = 'Pendente') as pendentes,
        COUNT(*) FILTER (WHERE data_ensaio_7d IS NULL OR data_ensaio_7d > CURRENT_DATE) as ensaios_7d_pendentes,
        COUNT(*) FILTER (WHERE data_ensaio_28d IS NULL OR data_ensaio_28d > CURRENT_DATE) as ensaios_28d_pendentes,
        (SELECT jsonb_object_agg(tipo_betao, count) FROM (
            SELECT tipo_betao, COUNT(*) as count 
            FROM betonagens 
            WHERE tipo_betao IS NOT NULL
            GROUP BY tipo_betao
        ) t) as tipos_betao_distribuicao,
        (SELECT jsonb_object_agg(status_conformidade, count) FROM (
            SELECT status_conformidade, COUNT(*) as count 
            FROM betonagens 
            GROUP BY status_conformidade
        ) s) as status_distribuicao,
        (SELECT jsonb_object_agg(obra, count) FROM (
            SELECT obra, COUNT(*) as count 
            FROM betonagens 
            GROUP BY obra
        ) o) as obras_distribuicao,
        AVG((resistencia_7d_1 + resistencia_7d_2) / 2) as resistencia_media_7d,
        AVG((resistencia_28d_1 + resistencia_28d_2 + resistencia_28d_3) / 3) as resistencia_media_28d,
        AVG(resistencia_rotura) as resistencia_media_rotura
    FROM betonagens;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE betonagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE ensaios_betonagem ENABLE ROW LEVEL SECURITY;

-- Políticas para betonagens
CREATE POLICY "Permitir leitura para usuários autenticados" ON betonagens
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção para usuários autenticados" ON betonagens
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados" ON betonagens
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados" ON betonagens
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para ensaios_betonagem
CREATE POLICY "Permitir leitura para usuários autenticados" ON ensaios_betonagem
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção para usuários autenticados" ON ensaios_betonagem
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados" ON ensaios_betonagem
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados" ON ensaios_betonagem
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Inserir betonagens de exemplo
INSERT INTO betonagens (codigo, obra, elemento_estrutural, localizacao, data_betonagem, data_ensaio_7d, data_ensaio_28d, fornecedor, guia_remessa, tipo_betao, aditivos, hora_limite_uso, slump, temperatura, resistencia_7d_1, resistencia_7d_2, resistencia_28d_1, resistencia_28d_2, resistencia_28d_3, resistencia_rotura, dimensoes_provete, status_conformidade, observacoes, relatorio_rotura) VALUES
('BET-2024-001', 'Viaduto A1 - Km 45', 'Pilar', 'Pilar P1 - Nível 0', '2024-01-15', '2024-01-22', '2024-02-12', 'Cimpor', 'GR-2024-001', 'C30/37', 'Superplastificante', '14:30:00', 12.5, 18.0, 25.3, 26.1, 38.5, 39.2, 37.8, 42.1, '15x15x15 cm', 'Conforme', 'Betonagem conforme especificações', 'Relatório LAB-001/2024 - Resistência 42.1 MPa'),
('BET-2024-002', 'Viaduto A1 - Km 45', 'Viga', 'Viga V1 - Nível 1', '2024-01-18', '2024-01-25', '2024-02-15', 'Secil', 'GR-2024-002', 'C35/45', 'Retardador', '15:00:00', 14.0, 16.5, 27.8, 28.2, 41.5, 42.1, 40.8, 45.2, '15x15x15 cm', 'Conforme', 'Excelente trabalhabilidade', 'Relatório LAB-002/2024 - Resistência 45.2 MPa'),
('BET-2024-003', 'Ponte Rio Douro - Porto', 'Fundação', 'Fundação F1 - Sapata', '2024-01-22', '2024-01-29', '2024-02-19', 'Secil', 'GR-2024-004', 'C40/50', 'Impermeabilizante', '16:00:00', 13.5, 17.0, 26.8, 27.3, 39.8, 40.5, 39.1, 43.6, '15x15x15 cm', 'Conforme', 'Fundação conforme projeto', 'Relatório LAB-004/2024 - Resistência 43.6 MPa'),
('BET-2024-004', 'Metro Lisboa - Linha Vermelha', 'Escada', 'Escada E1 - Bloco A', '2024-01-28', '2024-02-04', '2024-02-25', 'Secil', 'GR-2024-006', 'C30/37', 'Acelerador', '14:15:00', 12.0, 18.5, 25.7, 26.3, 38.9, 39.6, 38.2, 42.5, '15x15x15 cm', 'Pendente', 'Aguardando ensaios 28 dias', NULL),
('BET-2024-005', 'Estação Comboios - Braga', 'Pavimento', 'Pavimento P1 - Estacionamento', '2024-02-05', '2024-02-12', '2024-03-05', 'Secil', 'GR-2024-008', 'C25/30', 'Nenhum', '16:30:00', 13.0, 17.5, 26.1, 26.7, 38.4, 39.1, 37.8, 41.9, '15x15x15 cm', 'Não Conforme', 'Resistência abaixo do especificado', 'Relatório LAB-008/2024 - Resistência 41.9 MPa (NÃO CONFORME)'),
('BET-2024-006', 'Túnel A1 - Km 120', 'Viga', 'Viga V2 - Nível 2', '2024-02-10', '2024-02-17', '2024-03-10', 'Cimpor', 'GR-2024-010', 'C35/45', 'Superplastificante', '15:30:00', 13.2, 16.8, 27.1, 27.6, 40.2, 40.8, 39.5, 44.1, '15x15x15 cm', 'Conforme', 'Betonagem de alta qualidade', 'Relatório LAB-010/2024 - Resistência 44.1 MPa'),
('BET-2024-007', 'Viaduto A2 - Setúbal', 'Fundação', 'Fundação F2 - Sapata', '2024-02-15', '2024-02-22', '2024-03-15', 'Secil', 'GR-2024-012', 'C45/55', 'Impermeabilizante', '16:45:00', 14.5, 17.2, 28.3, 28.8, 42.5, 43.1, 41.8, 46.3, '15x15x15 cm', 'Conforme', 'Fundação para carga pesada', 'Relatório LAB-012/2024 - Resistência 46.3 MPa'),
('BET-2024-008', 'Metro Porto - Linha Amarela', 'Pilar', 'Pilar P3 - Estação', '2024-02-20', '2024-02-27', '2024-03-20', 'Cimpor', 'GR-2024-014', 'C30/37', 'Retardador', '14:00:00', 12.8, 18.2, 25.9, 26.4, 38.7, 39.3, 38.0, 42.8, '15x15x15 cm', 'Conforme', 'Pilar estrutural conforme', 'Relatório LAB-014/2024 - Resistência 42.8 MPa'),
('BET-2024-009', 'Ponte 25 de Abril - Lisboa', 'Viga', 'Viga V3 - Tabuleiro', '2024-02-25', '2024-03-04', '2024-03-25', 'Secil', 'GR-2024-016', 'C50/60', 'Superplastificante', '15:15:00', 15.0, 16.0, 29.1, 29.6, 43.8, 44.4, 43.1, 47.9, '15x15x15 cm', 'Conforme', 'Viga de alta resistência', 'Relatório LAB-016/2024 - Resistência 47.9 MPa'),
('BET-2024-010', 'Estação Metro - Coimbra', 'Pavimento', 'Pavimento P2 - Plataforma', '2024-03-01', '2024-03-08', '2024-04-01', 'Cimpor', 'GR-2024-018', 'C25/30', 'Nenhum', '16:00:00', 13.3, 17.8, 26.4, 26.9, 38.9, 39.5, 38.2, 42.2, '15x15x15 cm', 'Conforme', 'Pavimento resistente', 'Relatório LAB-018/2024 - Resistência 42.2 MPa'),
('BET-2024-011', 'Viaduto A1 - Km 45', 'Laje', 'Laje L1 - Nível 1', '2024-03-05', '2024-03-12', '2024-04-05', 'Secil', 'GR-2024-020', 'C30/37', 'Fibras', '14:45:00', 13.8, 17.5, 26.7, 27.2, 39.1, 39.7, 38.4, 43.0, '15x15x15 cm', 'Pendente', 'Aguardando ensaios finais', NULL),
('BET-2024-012', 'Ponte Rio Douro - Porto', 'Muro', 'Muro M1 - Acesso', '2024-03-10', '2024-03-17', '2024-04-10', 'Cimpor', 'GR-2024-022', 'C20/25', 'Nenhum', '15:30:00', 12.2, 18.8, 24.8, 25.3, 37.2, 37.8, 36.5, 40.1, '15x15x15 cm', 'Conforme', 'Muro de contenção', 'Relatório LAB-022/2024 - Resistência 40.1 MPa'),
('BET-2024-013', 'Metro Lisboa - Linha Vermelha', 'Cobertura', 'Cobertura C1 - Bloco B', '2024-03-15', '2024-03-22', '2024-04-15', 'Secil', 'GR-2024-024', 'C35/45', 'Impermeabilizante', '16:15:00', 14.2, 16.3, 27.5, 28.0, 40.8, 41.4, 40.1, 44.7, '15x15x15 cm', 'Conforme', 'Cobertura impermeável', 'Relatório LAB-024/2024 - Resistência 44.7 MPa'),
('BET-2024-014', 'Estação Comboios - Braga', 'Escada', 'Escada E2 - Bloco C', '2024-03-20', '2024-03-27', '2024-04-20', 'Cimpor', 'GR-2024-026', 'C30/37', 'Acelerador', '14:30:00', 12.6, 18.1, 26.0, 26.5, 38.6, 39.2, 37.9, 42.4, '15x15x15 cm', 'Pendente', 'Aguardando ensaios 28 dias', NULL),
('BET-2024-015', 'Túnel A1 - Km 120', 'Laje', 'Laje L2 - Nível 2', '2024-03-25', '2024-04-01', '2024-04-25', 'Secil', 'GR-2024-028', 'C40/50', 'Superplastificante', '15:45:00', 13.9, 16.7, 27.9, 28.4, 41.2, 41.8, 40.5, 45.1, '15x15x15 cm', 'Conforme', 'Laje de alta resistência', 'Relatório LAB-028/2024 - Resistência 45.1 MPa');

-- Inserir ensaios de exemplo
INSERT INTO ensaios_betonagem (betonagem_id, data_ensaio, tipo_ensaio, resultado, observacoes, responsavel) VALUES
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-001'), '2024-01-22', 'Resistência 7 dias - Probeta 1', 25.3, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. João Silva'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-001'), '2024-01-22', 'Resistência 7 dias - Probeta 2', 26.1, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. João Silva'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-001'), '2024-02-12', 'Resistência 28 dias - Probeta 1', 38.5, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. João Silva'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-001'), '2024-02-12', 'Resistência 28 dias - Probeta 2', 39.2, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. João Silva'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-001'), '2024-02-12', 'Resistência 28 dias - Probeta 3', 37.8, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. João Silva'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-002'), '2024-01-25', 'Resistência 7 dias - Probeta 1', 27.8, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. Maria Santos'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-002'), '2024-01-25', 'Resistência 7 dias - Probeta 2', 28.2, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. Maria Santos'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-002'), '2024-02-15', 'Resistência 28 dias - Probeta 1', 41.5, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. Maria Santos'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-002'), '2024-02-15', 'Resistência 28 dias - Probeta 2', 42.1, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. Maria Santos'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-002'), '2024-02-15', 'Resistência 28 dias - Probeta 3', 40.8, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. Maria Santos'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-003'), '2024-01-29', 'Resistência 7 dias - Probeta 1', 26.8, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. Pedro Costa'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-003'), '2024-01-29', 'Resistência 7 dias - Probeta 2', 27.3, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. Pedro Costa'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-003'), '2024-02-19', 'Resistência 28 dias - Probeta 1', 39.8, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. Pedro Costa'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-003'), '2024-02-19', 'Resistência 28 dias - Probeta 2', 40.5, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. Pedro Costa'),
((SELECT id FROM betonagens WHERE codigo = 'BET-2024-003'), '2024-02-19', 'Resistência 28 dias - Probeta 3', 39.1, 'Ensaio realizado conforme norma EN 12390-3', 'Eng. Pedro Costa');

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================
COMMENT ON TABLE betonagens IS 'Tabela principal para registros de controlo de betonagens';
COMMENT ON TABLE ensaios_betonagem IS 'Tabela para registros de ensaios específicos de betonagens';

COMMENT ON COLUMN betonagens.codigo IS 'Código único de identificação da betonagem';
COMMENT ON COLUMN betonagens.obra IS 'Obra a que pertence a betonagem';
COMMENT ON COLUMN betonagens.elemento_estrutural IS 'Tipo de elemento estrutural (Pilar, Viga, Laje, etc.)';
COMMENT ON COLUMN betonagens.localizacao IS 'Localização específica da betonagem';
COMMENT ON COLUMN betonagens.data_betonagem IS 'Data da betonagem';
COMMENT ON COLUMN betonagens.data_ensaio_7d IS 'Data do ensaio a 7 dias';
COMMENT ON COLUMN betonagens.data_ensaio_28d IS 'Data do ensaio a 28 dias';
COMMENT ON COLUMN betonagens.fornecedor IS 'Fornecedor do betão';
COMMENT ON COLUMN betonagens.guia_remessa IS 'Número da guia de remessa';
COMMENT ON COLUMN betonagens.tipo_betao IS 'Tipo de betão (C20/25, C25/30, etc.)';
COMMENT ON COLUMN betonagens.aditivos IS 'Aditivos utilizados no betão';
COMMENT ON COLUMN betonagens.hora_limite_uso IS 'Hora limite para uso do betão';
COMMENT ON COLUMN betonagens.slump IS 'Slump do betão em cm';
COMMENT ON COLUMN betonagens.temperatura IS 'Temperatura do betão em °C';
COMMENT ON COLUMN betonagens.resistencia_7d_1 IS 'Resistência a 7 dias - Probeta 1 em MPa';
COMMENT ON COLUMN betonagens.resistencia_7d_2 IS 'Resistência a 7 dias - Probeta 2 em MPa';
COMMENT ON COLUMN betonagens.resistencia_28d_1 IS 'Resistência a 28 dias - Probeta 1 em MPa';
COMMENT ON COLUMN betonagens.resistencia_28d_2 IS 'Resistência a 28 dias - Probeta 2 em MPa';
COMMENT ON COLUMN betonagens.resistencia_28d_3 IS 'Resistência a 28 dias - Probeta 3 em MPa';
COMMENT ON COLUMN betonagens.resistencia_rotura IS 'Resistência de rotura em MPa (editável)';
COMMENT ON COLUMN betonagens.dimensoes_provete IS 'Dimensões das provetas utilizadas';
COMMENT ON COLUMN betonagens.status_conformidade IS 'Status de conformidade (Conforme, Não Conforme, Pendente)';
COMMENT ON COLUMN betonagens.observacoes IS 'Observações gerais';
COMMENT ON COLUMN betonagens.relatorio_rotura IS 'Relatório de resultados da rotura';

COMMENT ON COLUMN ensaios_betonagem.betonagem_id IS 'Referência para a betonagem';
COMMENT ON COLUMN ensaios_betonagem.data_ensaio IS 'Data do ensaio';
COMMENT ON COLUMN ensaios_betonagem.tipo_ensaio IS 'Tipo de ensaio realizado';
COMMENT ON COLUMN ensaios_betonagem.resultado IS 'Resultado do ensaio';
COMMENT ON COLUMN ensaios_betonagem.responsavel IS 'Responsável pelo ensaio';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
