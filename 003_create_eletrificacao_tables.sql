-- =====================================================
-- SCRIPT SQL PARA TABELAS DE ELETRIFICAÇÃO FERROVIÁRIA
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA PRINCIPAL: eletrificacoes
-- =====================================================
CREATE TABLE IF NOT EXISTS eletrificacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(100) NOT NULL CHECK (tipo IN ('Catenária', 'Subestação', 'Transformador', 'Poste', 'Cabo', 'Disjuntor', 'Painel de Controle', 'Sistema de Aterramento')),
    categoria VARCHAR(100) NOT NULL CHECK (categoria IN ('Alta Tensão', 'Média Tensão', 'Baixa Tensão', 'Sinalização', 'Iluminação', 'Comunicação')),
    localizacao TEXT NOT NULL,
    km_inicial DECIMAL(10,3) NOT NULL,
    km_final DECIMAL(10,3) NOT NULL,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('Ativo', 'Inativo', 'Manutenção', 'Avaria', 'Desligado', 'Planejado')),
    fabricante VARCHAR(150) NOT NULL,
    modelo VARCHAR(150) NOT NULL,
    data_instalacao DATE NOT NULL,
    status_operacional VARCHAR(50) NOT NULL CHECK (status_operacional IN ('Operacional', 'Pendente', 'Manutenção', 'Avaria', 'Teste')),
    observacoes TEXT,
    parametros JSONB DEFAULT '{}',
    ultima_inspecao DATE,
    proxima_inspecao DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA DE INSPEÇÕES: inspecoes_eletrificacao
-- =====================================================
CREATE TABLE IF NOT EXISTS inspecoes_eletrificacao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    eletrificacao_id UUID NOT NULL REFERENCES eletrificacoes(id) ON DELETE CASCADE,
    data_inspecao DATE NOT NULL,
    tipo_inspecao VARCHAR(100) NOT NULL CHECK (tipo_inspecao IN ('Preventiva', 'Corretiva', 'Periódica', 'Especial', 'Emergencial')),
    resultado VARCHAR(50) NOT NULL CHECK (resultado IN ('Conforme', 'Não Conforme', 'Pendente', 'Aprovado', 'Reprovado')),
    observacoes TEXT,
    responsavel VARCHAR(150) NOT NULL,
    proxima_inspecao DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_eletrificacoes_codigo ON eletrificacoes(codigo);
CREATE INDEX IF NOT EXISTS idx_eletrificacoes_tipo ON eletrificacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_eletrificacoes_estado ON eletrificacoes(estado);
CREATE INDEX IF NOT EXISTS idx_eletrificacoes_status ON eletrificacoes(status_operacional);
CREATE INDEX IF NOT EXISTS idx_eletrificacoes_km ON eletrificacoes(km_inicial, km_final);
CREATE INDEX IF NOT EXISTS idx_eletrificacoes_data_instalacao ON eletrificacoes(data_instalacao);
CREATE INDEX IF NOT EXISTS idx_eletrificacoes_proxima_inspecao ON eletrificacoes(proxima_inspecao);

CREATE INDEX IF NOT EXISTS idx_inspecoes_eletrificacao_id ON inspecoes_eletrificacao(eletrificacao_id);
CREATE INDEX IF NOT EXISTS idx_inspecoes_eletrificacao_data ON inspecoes_eletrificacao(data_inspecao);
CREATE INDEX IF NOT EXISTS idx_inspecoes_eletrificacao_tipo ON inspecoes_eletrificacao(tipo_inspecao);
CREATE INDEX IF NOT EXISTS idx_inspecoes_eletrificacao_resultado ON inspecoes_eletrificacao(resultado);

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

CREATE TRIGGER update_eletrificacoes_updated_at 
    BEFORE UPDATE ON eletrificacoes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspecoes_eletrificacao_updated_at 
    BEFORE UPDATE ON inspecoes_eletrificacao 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO PARA ESTATÍSTICAS
-- =====================================================
CREATE OR REPLACE FUNCTION get_eletrificacao_stats()
RETURNS TABLE (
    total_eletrificacoes BIGINT,
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
        COUNT(*) as total_eletrificacoes,
        COUNT(*) FILTER (WHERE estado = 'Ativo') as ativas,
        COUNT(*) FILTER (WHERE estado = 'Manutenção') as em_manutencao,
        COUNT(*) FILTER (WHERE estado = 'Avaria') as com_avaria,
        COUNT(*) FILTER (WHERE proxima_inspecao <= CURRENT_DATE + INTERVAL '30 days') as inspecoes_pendentes,
        (SELECT jsonb_object_agg(tipo, count) FROM (
            SELECT tipo, COUNT(*) as count 
            FROM eletrificacoes 
            GROUP BY tipo
        ) t) as tipos_distribuicao,
        (SELECT jsonb_object_agg(estado, count) FROM (
            SELECT estado, COUNT(*) as count 
            FROM eletrificacoes 
            GROUP BY estado
        ) s) as status_distribuicao,
        COUNT(*) FILTER (WHERE proxima_inspecao BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days') as proximas_inspecoes_7d,
        COUNT(*) FILTER (WHERE proxima_inspecao BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') as proximas_inspecoes_30d
    FROM eletrificacoes;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE eletrificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspecoes_eletrificacao ENABLE ROW LEVEL SECURITY;

-- Políticas para eletrificacoes
CREATE POLICY "Permitir leitura para usuários autenticados" ON eletrificacoes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção para usuários autenticados" ON eletrificacoes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados" ON eletrificacoes
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados" ON eletrificacoes
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para inspecoes_eletrificacao
CREATE POLICY "Permitir leitura para usuários autenticados" ON inspecoes_eletrificacao
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção para usuários autenticados" ON inspecoes_eletrificacao
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados" ON inspecoes_eletrificacao
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados" ON inspecoes_eletrificacao
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Inserir eletrificações de exemplo
INSERT INTO eletrificacoes (codigo, tipo, categoria, localizacao, km_inicial, km_final, estado, fabricante, modelo, data_instalacao, status_operacional, observacoes, parametros, ultima_inspecao, proxima_inspecao) VALUES
('ELET-001-2024', 'Catenária', 'Alta Tensão', 'Linha Norte - Troço A', 0.000, 5.250, 'Ativo', 'Siemens', 'Sicat S1.0', '2024-01-15', 'Operacional', 'Sistema de catenária principal da linha norte', '{"tensao": 25000, "corrente": 1000, "potencia": 25000000, "frequencia": 50}', '2024-01-20', '2024-04-20'),
('ELET-002-2024', 'Subestação', 'Alta Tensão', 'Subestação Central', 2.500, 2.500, 'Ativo', 'ABB', 'PowerLink', '2024-01-10', 'Operacional', 'Subestação principal de distribuição', '{"tensao": 110000, "corrente": 500, "potencia": 55000000, "frequencia": 50}', '2024-01-25', '2024-04-25'),
('ELET-003-2024', 'Transformador', 'Média Tensão', 'Posto de Transformação PT-01', 1.200, 1.200, 'Ativo', 'Schneider Electric', 'EcoBlade', '2024-01-20', 'Operacional', 'Transformador de distribuição local', '{"tensao": 15000, "corrente": 200, "potencia": 3000000, "frequencia": 50}', '2024-01-30', '2024-04-30'),
('ELET-004-2024', 'Poste', 'Baixa Tensão', 'Linha Norte - Troço A', 0.500, 0.500, 'Ativo', 'Metalúrgica Silva', 'PS-12M', '2024-01-12', 'Operacional', 'Poste de sustentação da catenária', '{"tensao": 0, "corrente": 0, "potencia": 0, "frequencia": 0}', '2024-01-18', '2024-04-18'),
('ELET-005-2024', 'Cabo', 'Alta Tensão', 'Linha Norte - Troço A', 0.000, 5.250, 'Ativo', 'Prysmian', 'Railway Cable', '2024-01-15', 'Operacional', 'Cabo condutor principal', '{"tensao": 25000, "corrente": 1000, "potencia": 25000000, "frequencia": 50}', '2024-01-20', '2024-04-20'),
('ELET-006-2024', 'Disjuntor', 'Alta Tensão', 'Subestação Central', 2.500, 2.500, 'Ativo', 'Schneider Electric', 'MasterPact', '2024-01-10', 'Operacional', 'Disjuntor principal de proteção', '{"tensao": 110000, "corrente": 500, "potencia": 55000000, "frequencia": 50}', '2024-01-25', '2024-04-25'),
('ELET-007-2024', 'Painel de Controle', 'Baixa Tensão', 'Sala de Controle', 2.500, 2.500, 'Ativo', 'Siemens', 'Sivacon S8', '2024-01-10', 'Operacional', 'Painel de controle da subestação', '{"tensao": 400, "corrente": 100, "potencia": 40000, "frequencia": 50}', '2024-01-25', '2024-04-25'),
('ELET-008-2024', 'Sistema de Aterramento', 'Baixa Tensão', 'Subestação Central', 2.500, 2.500, 'Ativo', 'Eaton', 'GroundMaster', '2024-01-10', 'Operacional', 'Sistema de aterramento da subestação', '{"tensao": 0, "corrente": 0, "potencia": 0, "frequencia": 0}', '2024-01-25', '2024-04-25'),
('ELET-009-2024', 'Catenária', 'Alta Tensão', 'Linha Sul - Troço B', 5.250, 10.500, 'Ativo', 'Siemens', 'Sicat S1.0', '2024-02-01', 'Operacional', 'Extensão da catenária para linha sul', '{"tensao": 25000, "corrente": 1000, "potencia": 25000000, "frequencia": 50}', '2024-02-05', '2024-05-05'),
('ELET-010-2024', 'Transformador', 'Média Tensão', 'Posto de Transformação PT-02', 7.800, 7.800, 'Manutenção', 'ABB', 'Trafostar', '2024-01-25', 'Manutenção', 'Transformador em manutenção preventiva', '{"tensao": 15000, "corrente": 150, "potencia": 2250000, "frequencia": 50}', '2024-02-01', '2024-05-01');

-- Inserir inspeções de exemplo
INSERT INTO inspecoes_eletrificacao (eletrificacao_id, data_inspecao, tipo_inspecao, resultado, observacoes, responsavel, proxima_inspecao) VALUES
((SELECT id FROM eletrificacoes WHERE codigo = 'ELET-001-2024'), '2024-01-20', 'Periódica', 'Conforme', 'Inspeção periódica realizada conforme cronograma. Sistema operando normalmente.', 'Eng. João Silva', '2024-04-20'),
((SELECT id FROM eletrificacoes WHERE codigo = 'ELET-002-2024'), '2024-01-25', 'Preventiva', 'Conforme', 'Manutenção preventiva realizada. Todos os parâmetros dentro dos limites.', 'Eng. Maria Santos', '2024-04-25'),
((SELECT id FROM eletrificacoes WHERE codigo = 'ELET-003-2024'), '2024-01-30', 'Periódica', 'Conforme', 'Inspeção de rotina. Transformador funcionando adequadamente.', 'Téc. Pedro Costa', '2024-04-30'),
((SELECT id FROM eletrificacoes WHERE codigo = 'ELET-004-2024'), '2024-01-18', 'Preventiva', 'Conforme', 'Verificação estrutural do poste. Sem danos ou deformações.', 'Téc. Ana Oliveira', '2024-04-18'),
((SELECT id FROM eletrificacoes WHERE codigo = 'ELET-005-2024'), '2024-01-20', 'Periódica', 'Conforme', 'Inspeção do cabo condutor. Isolação em bom estado.', 'Eng. Carlos Lima', '2024-04-20'),
((SELECT id FROM eletrificacoes WHERE codigo = 'ELET-006-2024'), '2024-01-25', 'Preventiva', 'Conforme', 'Teste de funcionamento do disjuntor. Operação normal.', 'Eng. Sofia Rodrigues', '2024-04-25'),
((SELECT id FROM eletrificacoes WHERE codigo = 'ELET-007-2024'), '2024-01-25', 'Periódica', 'Conforme', 'Verificação dos painéis de controle. Todos os indicadores OK.', 'Téc. Miguel Ferreira', '2024-04-25'),
((SELECT id FROM eletrificacoes WHERE codigo = 'ELET-008-2024'), '2024-01-25', 'Preventiva', 'Conforme', 'Medição da resistência de aterramento. Valores dentro da norma.', 'Eng. Luísa Martins', '2024-04-25'),
((SELECT id FROM eletrificacoes WHERE codigo = 'ELET-009-2024'), '2024-02-05', 'Periódica', 'Conforme', 'Inspeção da extensão da catenária. Instalação correta.', 'Eng. Ricardo Alves', '2024-05-05'),
((SELECT id FROM eletrificacoes WHERE codigo = 'ELET-010-2024'), '2024-02-01', 'Corretiva', 'Pendente', 'Manutenção corretiva em andamento. Substituição de componentes.', 'Eng. Fernanda Costa', '2024-05-01');

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================
COMMENT ON TABLE eletrificacoes IS 'Tabela principal para registros de eletrificação ferroviária';
COMMENT ON TABLE inspecoes_eletrificacao IS 'Tabela para registros de inspeções de eletrificação ferroviária';

COMMENT ON COLUMN eletrificacoes.codigo IS 'Código único de identificação da eletrificação';
COMMENT ON COLUMN eletrificacoes.tipo IS 'Tipo de equipamento de eletrificação';
COMMENT ON COLUMN eletrificacoes.categoria IS 'Categoria de tensão do equipamento';
COMMENT ON COLUMN eletrificacoes.parametros IS 'Parâmetros técnicos em formato JSON (tensão, corrente, potência, frequência)';
COMMENT ON COLUMN eletrificacoes.ultima_inspecao IS 'Data da última inspeção realizada';
COMMENT ON COLUMN eletrificacoes.proxima_inspecao IS 'Data da próxima inspeção programada';

COMMENT ON COLUMN inspecoes_eletrificacao.eletrificacao_id IS 'Referência para a eletrificação inspecionada';
COMMENT ON COLUMN inspecoes_eletrificacao.tipo_inspecao IS 'Tipo de inspeção realizada';
COMMENT ON COLUMN inspecoes_eletrificacao.resultado IS 'Resultado da inspeção';
COMMENT ON COLUMN inspecoes_eletrificacao.responsavel IS 'Nome do responsável pela inspeção';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
