-- =====================================================
-- SCRIPT SQL PARA TABELAS DE PONTES & TÚNEIS FERROVIÁRIOS
-- Seguindo Normativas Portuguesas e Europeias
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA PRINCIPAL: pontes_tuneis
-- =====================================================
CREATE TABLE IF NOT EXISTS pontes_tuneis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(100) NOT NULL CHECK (tipo IN ('Ponte', 'Túnel', 'Viaduto', 'Passagem Inferior', 'Aqueduto', 'Galeria')),
    categoria VARCHAR(100) NOT NULL CHECK (categoria IN ('Principal', 'Secundário', 'Acesso', 'Emergencial', 'Pedonal')),
    localizacao TEXT NOT NULL,
    km_inicial DECIMAL(10,3) NOT NULL,
    km_final DECIMAL(10,3) NOT NULL,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('Ativo', 'Inativo', 'Manutenção', 'Avaria', 'Desligado', 'Planejado', 'Em Construção')),
    fabricante VARCHAR(150) NOT NULL,
    modelo VARCHAR(150) NOT NULL,
    data_construcao DATE NOT NULL,
    status_operacional VARCHAR(50) NOT NULL CHECK (status_operacional IN ('Operacional', 'Pendente', 'Manutenção', 'Avaria', 'Teste', 'Inspeção')),
    observacoes TEXT,
    parametros JSONB DEFAULT '{}',
    ultima_inspecao DATE,
    proxima_inspecao DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA DE INSPEÇÕES: inspecoes_pontes_tuneis
-- =====================================================
CREATE TABLE IF NOT EXISTS inspecoes_pontes_tuneis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ponte_tunel_id UUID NOT NULL REFERENCES pontes_tuneis(id) ON DELETE CASCADE,
    data_inspecao DATE NOT NULL,
    tipo_inspecao VARCHAR(100) NOT NULL CHECK (tipo_inspecao IN ('Preventiva', 'Corretiva', 'Periódica', 'Especial', 'Emergencial', 'Estrutural')),
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
CREATE INDEX IF NOT EXISTS idx_pontes_tuneis_codigo ON pontes_tuneis(codigo);
CREATE INDEX IF NOT EXISTS idx_pontes_tuneis_tipo ON pontes_tuneis(tipo);
CREATE INDEX IF NOT EXISTS idx_pontes_tuneis_estado ON pontes_tuneis(estado);
CREATE INDEX IF NOT EXISTS idx_pontes_tuneis_status ON pontes_tuneis(status_operacional);
CREATE INDEX IF NOT EXISTS idx_pontes_tuneis_km ON pontes_tuneis(km_inicial, km_final);
CREATE INDEX IF NOT EXISTS idx_pontes_tuneis_data_construcao ON pontes_tuneis(data_construcao);
CREATE INDEX IF NOT EXISTS idx_pontes_tuneis_proxima_inspecao ON pontes_tuneis(proxima_inspecao);

CREATE INDEX IF NOT EXISTS idx_inspecoes_pontes_tuneis_id ON inspecoes_pontes_tuneis(ponte_tunel_id);
CREATE INDEX IF NOT EXISTS idx_inspecoes_pontes_tuneis_data ON inspecoes_pontes_tuneis(data_inspecao);
CREATE INDEX IF NOT EXISTS idx_inspecoes_pontes_tuneis_tipo ON inspecoes_pontes_tuneis(tipo_inspecao);
CREATE INDEX IF NOT EXISTS idx_inspecoes_pontes_tuneis_resultado ON inspecoes_pontes_tuneis(resultado);

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

CREATE TRIGGER update_pontes_tuneis_updated_at 
    BEFORE UPDATE ON pontes_tuneis 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspecoes_pontes_tuneis_updated_at 
    BEFORE UPDATE ON inspecoes_pontes_tuneis 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO PARA ESTATÍSTICAS
-- =====================================================
CREATE OR REPLACE FUNCTION get_pontes_tuneis_stats()
RETURNS TABLE (
    total_pontes_tuneis BIGINT,
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
        COUNT(*) as total_pontes_tuneis,
        COUNT(*) FILTER (WHERE estado = 'Ativo') as ativas,
        COUNT(*) FILTER (WHERE estado = 'Manutenção') as em_manutencao,
        COUNT(*) FILTER (WHERE estado = 'Avaria') as com_avaria,
        COUNT(*) FILTER (WHERE proxima_inspecao <= CURRENT_DATE + INTERVAL '30 days') as inspecoes_pendentes,
        (SELECT jsonb_object_agg(tipo, count) FROM (
            SELECT tipo, COUNT(*) as count 
            FROM pontes_tuneis 
            GROUP BY tipo
        ) t) as tipos_distribuicao,
        (SELECT jsonb_object_agg(estado, count) FROM (
            SELECT estado, COUNT(*) as count 
            FROM pontes_tuneis 
            GROUP BY estado
        ) s) as status_distribuicao,
        COUNT(*) FILTER (WHERE proxima_inspecao BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days') as proximas_inspecoes_7d,
        COUNT(*) FILTER (WHERE proxima_inspecao BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') as proximas_inspecoes_30d
    FROM pontes_tuneis;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE pontes_tuneis ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspecoes_pontes_tuneis ENABLE ROW LEVEL SECURITY;

-- Políticas para pontes_tuneis
CREATE POLICY "Permitir leitura para usuários autenticados" ON pontes_tuneis
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção para usuários autenticados" ON pontes_tuneis
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados" ON pontes_tuneis
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados" ON pontes_tuneis
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para inspecoes_pontes_tuneis
CREATE POLICY "Permitir leitura para usuários autenticados" ON inspecoes_pontes_tuneis
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção para usuários autenticados" ON inspecoes_pontes_tuneis
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados" ON inspecoes_pontes_tuneis
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados" ON inspecoes_pontes_tuneis
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Inserir pontes/túneis de exemplo
INSERT INTO pontes_tuneis (codigo, tipo, categoria, localizacao, km_inicial, km_final, estado, fabricante, modelo, data_construcao, status_operacional, observacoes, parametros, ultima_inspecao, proxima_inspecao) VALUES
('PT-001-2024', 'Ponte', 'Principal', 'Rio Douro - Linha Norte', 15.500, 15.800, 'Ativo', 'Mota-Engil', 'Ponte Mista', '2024-01-15', 'Operacional', 'Ponte principal sobre o Rio Douro com estrutura mista aço-betão', '{"comprimento": 300, "largura": 12, "altura": 25, "capacidade_carga": 25000}', '2024-01-20', '2024-04-20'),
('TUN-001-2024', 'Túnel', 'Principal', 'Serra da Estrela - Linha Norte', 45.200, 47.800, 'Ativo', 'Teixeira Duarte', 'Túnel Ferroviário', '2024-01-10', 'Operacional', 'Túnel principal através da Serra da Estrela com 2.6km', '{"comprimento": 2600, "largura": 8, "altura": 6, "capacidade_carga": 30000}', '2024-01-25', '2024-04-25'),
('VIAD-001-2024', 'Viaduto', 'Secundário', 'Vale do Tâmega - Linha Norte', 32.100, 32.450, 'Ativo', 'Somague', 'Viaduto de Betão', '2024-01-20', 'Operacional', 'Viaduto sobre o Vale do Tâmega com pilares em betão armado', '{"comprimento": 350, "largura": 10, "altura": 40, "capacidade_carga": 20000}', '2024-01-30', '2024-04-30'),
('PASS-001-2024', 'Passagem Inferior', 'Acesso', 'Acesso Norte - Linha Norte', 8.500, 8.550, 'Ativo', 'Fergrupo', 'Passagem Inferior', '2024-01-12', 'Operacional', 'Passagem inferior para acesso norte com estrutura em betão', '{"comprimento": 50, "largura": 8, "altura": 4, "capacidade_carga": 15000}', '2024-01-18', '2024-04-18'),
('PT-002-2024', 'Ponte', 'Secundário', 'Rio Tâmega - Linha Norte', 28.300, 28.600, 'Manutenção', 'Mota-Engil', 'Ponte de Betão', '2024-01-08', 'Manutenção', 'Ponte em manutenção preventiva - substituição de juntas', '{"comprimento": 250, "largura": 10, "altura": 20, "capacidade_carga": 18000}', '2024-02-01', '2024-05-01'),
('TUN-002-2024', 'Túnel', 'Secundário', 'Serra do Marão - Linha Norte', 52.100, 53.800, 'Ativo', 'Teixeira Duarte', 'Túnel Ferroviário', '2024-01-05', 'Operacional', 'Túnel secundário através da Serra do Marão', '{"comprimento": 1700, "largura": 8, "altura": 6, "capacidade_carga": 25000}', '2024-01-15', '2024-04-15'),
('VIAD-002-2024', 'Viaduto', 'Principal', 'Vale do Mondego - Linha Centro', 18.200, 18.600, 'Ativo', 'Somague', 'Viaduto Misto', '2024-01-25', 'Operacional', 'Viaduto principal sobre o Vale do Mondego', '{"comprimento": 400, "largura": 12, "altura": 35, "capacidade_carga": 22000}', '2024-02-05', '2024-05-05'),
('PASS-002-2024', 'Passagem Inferior', 'Pedonal', 'Centro Histórico - Linha Norte', 12.300, 12.320, 'Ativo', 'Fergrupo', 'Passagem Pedonal', '2024-01-18', 'Operacional', 'Passagem inferior pedonal no centro histórico', '{"comprimento": 20, "largura": 4, "altura": 3, "capacidade_carga": 5000}', '2024-01-22', '2024-04-22'),
('PT-003-2024', 'Ponte', 'Emergencial', 'Rio Ave - Linha Norte', 22.500, 22.750, 'Ativo', 'Mota-Engil', 'Ponte de Emergência', '2024-01-30', 'Operacional', 'Ponte de emergência sobre o Rio Ave', '{"comprimento": 200, "largura": 8, "altura": 15, "capacidade_carga": 12000}', '2024-02-10', '2024-05-10'),
('TUN-003-2024', 'Túnel', 'Acesso', 'Acesso Sul - Linha Norte', 5.200, 5.400, 'Ativo', 'Teixeira Duarte', 'Túnel de Acesso', '2024-01-28', 'Operacional', 'Túnel de acesso sul com 200m de comprimento', '{"comprimento": 200, "largura": 6, "altura": 5, "capacidade_carga": 10000}', '2024-02-08', '2024-05-08');

-- Inserir inspeções de exemplo
INSERT INTO inspecoes_pontes_tuneis (ponte_tunel_id, data_inspecao, tipo_inspecao, resultado, observacoes, responsavel, proxima_inspecao) VALUES
((SELECT id FROM pontes_tuneis WHERE codigo = 'PT-001-2024'), '2024-01-20', 'Periódica', 'Conforme', 'Inspeção periódica realizada conforme cronograma. Estrutura em bom estado.', 'Eng. João Silva', '2024-04-20'),
((SELECT id FROM pontes_tuneis WHERE codigo = 'TUN-001-2024'), '2024-01-25', 'Preventiva', 'Conforme', 'Manutenção preventiva realizada. Todos os sistemas operacionais.', 'Eng. Maria Santos', '2024-04-25'),
((SELECT id FROM pontes_tuneis WHERE codigo = 'VIAD-001-2024'), '2024-01-30', 'Periódica', 'Conforme', 'Inspeção de rotina. Viaduto funcionando adequadamente.', 'Téc. Pedro Costa', '2024-04-30'),
((SELECT id FROM pontes_tuneis WHERE codigo = 'PASS-001-2024'), '2024-01-18', 'Preventiva', 'Conforme', 'Verificação estrutural. Sem danos ou deformações.', 'Téc. Ana Oliveira', '2024-04-18'),
((SELECT id FROM pontes_tuneis WHERE codigo = 'PT-002-2024'), '2024-02-01', 'Corretiva', 'Pendente', 'Manutenção corretiva em andamento. Substituição de componentes.', 'Eng. Fernanda Costa', '2024-05-01'),
((SELECT id FROM pontes_tuneis WHERE codigo = 'TUN-002-2024'), '2024-01-15', 'Periódica', 'Conforme', 'Inspeção de rotina. Túnel em bom estado de conservação.', 'Eng. Carlos Lima', '2024-04-15'),
((SELECT id FROM pontes_tuneis WHERE codigo = 'VIAD-002-2024'), '2024-02-05', 'Preventiva', 'Conforme', 'Manutenção preventiva concluída. Todos os sistemas OK.', 'Eng. Sofia Rodrigues', '2024-05-05'),
((SELECT id FROM pontes_tuneis WHERE codigo = 'PASS-002-2024'), '2024-01-22', 'Periódica', 'Conforme', 'Verificação da passagem pedonal. Sem problemas identificados.', 'Téc. Miguel Ferreira', '2024-04-22'),
((SELECT id FROM pontes_tuneis WHERE codigo = 'PT-003-2024'), '2024-02-10', 'Estrutural', 'Conforme', 'Inspeção estrutural detalhada. Ponte em excelente estado.', 'Eng. Luísa Martins', '2024-05-10'),
((SELECT id FROM pontes_tuneis WHERE codigo = 'TUN-003-2024'), '2024-02-08', 'Periódica', 'Conforme', 'Inspeção de rotina. Túnel de acesso funcionando normalmente.', 'Eng. Ricardo Alves', '2024-05-08');

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================
COMMENT ON TABLE pontes_tuneis IS 'Tabela principal para registros de pontes e túneis ferroviários';
COMMENT ON TABLE inspecoes_pontes_tuneis IS 'Tabela para registros de inspeções de pontes e túneis ferroviários';

COMMENT ON COLUMN pontes_tuneis.codigo IS 'Código único de identificação da ponte/túnel';
COMMENT ON COLUMN pontes_tuneis.tipo IS 'Tipo de infraestrutura (Ponte, Túnel, Viaduto, etc.)';
COMMENT ON COLUMN pontes_tuneis.categoria IS 'Categoria da infraestrutura (Principal, Secundário, etc.)';
COMMENT ON COLUMN pontes_tuneis.parametros IS 'Parâmetros técnicos em formato JSON (comprimento, largura, altura, capacidade_carga)';
COMMENT ON COLUMN pontes_tuneis.ultima_inspecao IS 'Data da última inspeção realizada';
COMMENT ON COLUMN pontes_tuneis.proxima_inspecao IS 'Data da próxima inspeção programada';

COMMENT ON COLUMN inspecoes_pontes_tuneis.ponte_tunel_id IS 'Referência para a ponte/túnel inspecionada';
COMMENT ON COLUMN inspecoes_pontes_tuneis.tipo_inspecao IS 'Tipo de inspeção realizada';
COMMENT ON COLUMN inspecoes_pontes_tuneis.resultado IS 'Resultado da inspeção';
COMMENT ON COLUMN inspecoes_pontes_tuneis.responsavel IS 'Nome do responsável pela inspeção';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
