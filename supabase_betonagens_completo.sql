-- =====================================================
-- SCRIPT COMPLETO PARA MÓDULO "CONTROLO DE BETONAGENS"
-- =====================================================

-- Limpar dados existentes (se houver)
DELETE FROM controlo_cura;
DELETE FROM ensaios_betonagem;
DELETE FROM betonagens;
DELETE FROM fornecedores_betao;
DELETE FROM aditivos;
DELETE FROM tipos_betao;

-- =====================================================
-- 1. TABELAS BASE
-- =====================================================

-- Tabela de tipos de betão
CREATE TABLE IF NOT EXISTS tipos_betao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    classe_resistencia VARCHAR(20) NOT NULL,
    resistencia_caracteristica DECIMAL(5,2) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de aditivos
CREATE TABLE IF NOT EXISTS aditivos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    unidade_dosagem VARCHAR(20) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fornecedores de betão
CREATE TABLE IF NOT EXISTS fornecedores_betao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    nif VARCHAR(20),
    morada TEXT,
    telefone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TABELA PRINCIPAL - BETONAGENS
-- =====================================================

CREATE TABLE IF NOT EXISTS betonagens (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    obra VARCHAR(200) NOT NULL,
    elemento_estrutural VARCHAR(100) NOT NULL,
    localizacao VARCHAR(200),
    data_betonagem DATE NOT NULL,
    hora_betonagem TIME,
    data_ensaio_7d DATE,
    data_ensaio_28d DATE,
    fornecedor_id INTEGER REFERENCES fornecedores_betao(id),
    guia_remessa VARCHAR(50),
    tipo_betao_id INTEGER REFERENCES tipos_betao(id),
    aditivos_id INTEGER REFERENCES aditivos(id),
    hora_limite_uso TIME,
    slump DECIMAL(4,1),
    temperatura DECIMAL(4,1),
    resistencia_7d_1 DECIMAL(5,2),
    resistencia_7d_2 DECIMAL(5,2),
    resistencia_28d_1 DECIMAL(5,2),
    resistencia_28d_2 DECIMAL(5,2),
    resistencia_28d_3 DECIMAL(5,2),
    resistencia_rotura DECIMAL(5,2),
    dimensoes_provete VARCHAR(20),
    status_conformidade VARCHAR(20) DEFAULT 'Pendente',
    observacoes TEXT,
    relatorio_rotura TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABELAS RELACIONADAS
-- =====================================================

-- Tabela de ensaios de betonagem
CREATE TABLE IF NOT EXISTS ensaios_betonagem (
    id SERIAL PRIMARY KEY,
    betonagem_id INTEGER REFERENCES betonagens(id) ON DELETE CASCADE,
    tipo_ensaio VARCHAR(50) NOT NULL,
    data_ensaio DATE NOT NULL,
    resultado DECIMAL(8,2),
    unidade VARCHAR(20),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de controlo de cura
CREATE TABLE IF NOT EXISTS controlo_cura (
    id SERIAL PRIMARY KEY,
    betonagem_id INTEGER REFERENCES betonagens(id) ON DELETE CASCADE,
    data_controlo DATE NOT NULL,
    temperatura_ambiente DECIMAL(4,1),
    humidade_relativa DECIMAL(4,1),
    temperatura_betao DECIMAL(4,1),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. ADICIONAR COLUNAS SE NÃO EXISTIREM
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'betonagens' AND column_name = 'hora_betonagem') THEN
        ALTER TABLE betonagens ADD COLUMN hora_betonagem TIME;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'betonagens' AND column_name = 'hora_limite_uso') THEN
        ALTER TABLE betonagens ADD COLUMN hora_limite_uso TIME;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'betonagens' AND column_name = 'relatorio_rotura') THEN
        ALTER TABLE betonagens ADD COLUMN relatorio_rotura TEXT;
    END IF;
END $$;

-- =====================================================
-- 5. DADOS DE EXEMPLO
-- =====================================================

-- Inserir tipos de betão
INSERT INTO tipos_betao (nome, classe_resistencia, resistencia_caracteristica, observacoes) VALUES
('C20/25', 'C20/25', 25.0, 'Betão para estruturas não estruturais'),
('C25/30', 'C25/30', 30.0, 'Betão para estruturas correntes'),
('C30/37', 'C30/37', 37.0, 'Betão para estruturas de média resistência'),
('C35/45', 'C35/45', 45.0, 'Betão para estruturas de alta resistência'),
('C40/50', 'C40/50', 50.0, 'Betão para estruturas especiais'),
('C45/55', 'C45/55', 55.0, 'Betão para estruturas de muito alta resistência');

-- Inserir aditivos
INSERT INTO aditivos (nome, tipo, unidade_dosagem, observacoes) VALUES
('SikaPlast-520', 'Plastificante', 'l/m³', 'Reduz a quantidade de água'),
('SikaRapid-1', 'Acelerador', 'l/m³', 'Acelera o endurecimento'),
('SikaRetardol-100', 'Retardador', 'l/m³', 'Retarda o endurecimento'),
('SikaAer-200', 'Incorporador de ar', 'l/m³', 'Melhora a trabalhabilidade'),
('SikaFume-100', 'Microsílica', 'kg/m³', 'Aumenta a resistência');

-- Inserir fornecedores
INSERT INTO fornecedores_betao (nome, nif, morada, telefone, email) VALUES
('Betão Lda', '123456789', 'Rua das Indústrias, 123, Lisboa', '213456789', 'geral@betao.pt'),
('Cimento Nacional', '987654321', 'Av. da República, 456, Porto', '225678901', 'info@cimento.pt'),
('Betão Express', '456789123', 'Rua do Comércio, 789, Coimbra', '239123456', 'contacto@express.pt'),
('Betão Premium', '789123456', 'Rua da Qualidade, 321, Braga', '253456789', 'premium@betao.pt');

-- Inserir betonagens de exemplo
INSERT INTO betonagens (codigo, obra, elemento_estrutural, localizacao, data_betonagem, hora_betonagem, data_ensaio_7d, data_ensaio_28d, fornecedor_id, guia_remessa, tipo_betao_id, aditivos_id, hora_limite_uso, slump, temperatura, resistencia_7d_1, resistencia_7d_2, resistencia_28d_1, resistencia_28d_2, resistencia_28d_3, resistencia_rotura, dimensoes_provete, status_conformidade, observacoes) VALUES
('BET-2024-001', 'Edifício Residencial Centro', 'Pilar P1', 'Piso 0, Eixo A-1', '2024-01-15', '08:30:00', '2024-01-22', '2024-02-12', 1, 'GR-2024-001', 2, 1, '10:30:00', 180.0, 18.5, 22.5, 23.1, 32.8, 33.2, 31.9, 35.1, '15x15x15', 'Conforme', 'Betonagem realizada com sucesso'),
('BET-2024-002', 'Edifício Residencial Centro', 'Viga V1', 'Piso 0, Eixo B-2', '2024-01-16', '14:15:00', '2024-01-23', '2024-02-13', 1, 'GR-2024-002', 3, 2, '16:15:00', 160.0, 20.1, 25.3, 24.8, 38.5, 37.9, 39.2, 40.8, '15x15x15', 'Conforme', 'Temperatura ligeiramente elevada'),
('BET-2024-003', 'Ponte Viaduto Norte', 'Pilar Central', 'Pilar P3', '2024-01-17', '09:45:00', '2024-01-24', '2024-02-14', 2, 'GR-2024-003', 4, 3, '11:45:00', 140.0, 16.8, 28.7, 29.1, 42.3, 43.1, 41.8, 45.2, '15x15x15', 'Conforme', 'Betonagem em condições ideais'),
('BET-2024-004', 'Ponte Viaduto Norte', 'Laje de Apoio', 'Laje L1', '2024-01-18', '16:30:00', '2024-01-25', '2024-02-15', 2, 'GR-2024-004', 3, 1, '18:30:00', 170.0, 19.2, 24.1, 23.7, 36.8, 37.2, 36.5, 38.9, '15x15x15', 'Conforme', 'Slump ligeiramente elevado'),
('BET-2024-005', 'Centro Comercial Sul', 'Fundação F1', 'Fundação Central', '2024-01-19', '07:00:00', '2024-01-26', '2024-02-16', 3, 'GR-2024-005', 2, 4, '09:00:00', 150.0, 17.5, 21.9, 22.3, 31.5, 32.1, 30.8, 34.2, '15x15x15', 'Conforme', 'Betonagem matinal'),
('BET-2024-006', 'Centro Comercial Sul', 'Pilar P2', 'Piso -1, Eixo C-3', '2024-01-20', '13:20:00', '2024-01-27', '2024-02-17', 3, 'GR-2024-006', 4, 2, '15:20:00', 155.0, 21.3, 26.8, 27.2, 39.7, 40.1, 38.9, 42.5, '15x15x15', 'Conforme', 'Temperatura ambiente elevada'),
('BET-2024-007', 'Hospital Regional', 'Laje de Cobertura', 'Cobertura Principal', '2024-01-21', '10:15:00', '2024-01-28', '2024-02-18', 4, 'GR-2024-007', 5, 3, '12:15:00', 130.0, 18.9, 30.2, 30.8, 44.1, 44.7, 43.3, 46.8, '15x15x15', 'Conforme', 'Betão de alta resistência'),
('BET-2024-008', 'Hospital Regional', 'Viga de Suporte', 'Piso 2, Eixo D-4', '2024-01-22', '15:45:00', '2024-01-29', '2024-02-19', 4, 'GR-2024-008', 3, 1, '17:45:00', 165.0, 20.7, 25.6, 26.1, 37.4, 37.9, 36.7, 39.8, '15x15x15', 'Conforme', 'Betonagem tarde'),
('BET-2024-009', 'Estação Metro', 'Pilar de Acesso', 'Entrada Principal', '2024-01-23', '08:00:00', '2024-01-30', '2024-02-20', 1, 'GR-2024-009', 2, 5, '10:00:00', 175.0, 19.8, 23.4, 23.9, 33.1, 33.6, 32.4, 35.7, '15x15x15', 'Conforme', 'Betão com microsílica'),
('BET-2024-010', 'Estação Metro', 'Laje de Plataforma', 'Plataforma Central', '2024-01-24', '12:30:00', '2024-01-31', '2024-02-21', 1, 'GR-2024-010', 4, 2, '14:30:00', 145.0, 22.1, 27.5, 28.1, 40.3, 40.8, 39.6, 43.1, '15x15x15', 'Conforme', 'Temperatura elevada controlada');

-- Inserir ensaios de betonagem
INSERT INTO ensaios_betonagem (betonagem_id, tipo_ensaio, data_ensaio, resultado, unidade, observacoes) VALUES
(1, 'Slump', '2024-01-15', 180.0, 'mm', 'Trabalhabilidade adequada'),
(1, 'Temperatura', '2024-01-15', 18.5, '°C', 'Temperatura dentro dos limites'),
(1, 'Resistência 7d', '2024-01-22', 22.8, 'MPa', 'Média dos dois provetes'),
(1, 'Resistência 28d', '2024-02-12', 32.6, 'MPa', 'Média dos três provetes'),
(2, 'Slump', '2024-01-16', 160.0, 'mm', 'Trabalhabilidade adequada'),
(2, 'Temperatura', '2024-01-16', 20.1, '°C', 'Temperatura ligeiramente elevada'),
(2, 'Resistência 7d', '2024-01-23', 25.1, 'MPa', 'Média dos dois provetes'),
(2, 'Resistência 28d', '2024-02-13', 38.5, 'MPa', 'Média dos três provetes'),
(3, 'Slump', '2024-01-17', 140.0, 'mm', 'Trabalhabilidade adequada'),
(3, 'Temperatura', '2024-01-17', 16.8, '°C', 'Temperatura ideal'),
(3, 'Resistência 7d', '2024-01-24', 28.9, 'MPa', 'Média dos dois provetes'),
(3, 'Resistência 28d', '2024-02-14', 42.4, 'MPa', 'Média dos três provetes'),
(4, 'Slump', '2024-01-18', 170.0, 'mm', 'Slump ligeiramente elevado'),
(4, 'Temperatura', '2024-01-18', 19.2, '°C', 'Temperatura adequada'),
(4, 'Resistência 7d', '2024-01-25', 23.9, 'MPa', 'Média dos dois provetes'),
(4, 'Resistência 28d', '2024-02-15', 36.8, 'MPa', 'Média dos três provetes'),
(5, 'Slump', '2024-01-19', 150.0, 'mm', 'Trabalhabilidade adequada'),
(5, 'Temperatura', '2024-01-19', 17.5, '°C', 'Temperatura adequada'),
(5, 'Resistência 7d', '2024-01-26', 22.1, 'MPa', 'Média dos dois provetes'),
(5, 'Resistência 28d', '2024-02-16', 31.5, 'MPa', 'Média dos três provetes');

-- Inserir controlo de cura
INSERT INTO controlo_cura (betonagem_id, data_controlo, temperatura_ambiente, humidade_relativa, temperatura_betao, observacoes) VALUES
(1, '2024-01-16', 18.0, 65.0, 22.0, 'Primeiro controlo'),
(1, '2024-01-17', 19.5, 62.0, 24.5, 'Segundo controlo'),
(1, '2024-01-18', 20.1, 60.0, 26.8, 'Terceiro controlo'),
(2, '2024-01-17', 21.0, 58.0, 25.2, 'Primeiro controlo'),
(2, '2024-01-18', 22.3, 55.0, 27.1, 'Segundo controlo'),
(2, '2024-01-19', 21.8, 57.0, 28.5, 'Terceiro controlo'),
(3, '2024-01-18', 17.5, 70.0, 20.8, 'Primeiro controlo'),
(3, '2024-01-19', 18.2, 68.0, 22.3, 'Segundo controlo'),
(3, '2024-01-20', 18.9, 65.0, 24.1, 'Terceiro controlo'),
(4, '2024-01-19', 19.8, 63.0, 23.5, 'Primeiro controlo'),
(4, '2024-01-20', 20.5, 61.0, 25.2, 'Segundo controlo'),
(4, '2024-01-21', 21.1, 59.0, 26.8, 'Terceiro controlo');

-- =====================================================
-- 6. VISTAS
-- =====================================================

-- Vista para estatísticas gerais
CREATE OR REPLACE VIEW v_betonagens_stats AS
SELECT 
    COUNT(*) as total_betonagens,
    COUNT(CASE WHEN status_conformidade = 'Conforme' THEN 1 END) as conformes,
    COUNT(CASE WHEN status_conformidade = 'Não Conforme' THEN 1 END) as nao_conformes,
    COUNT(CASE WHEN status_conformidade = 'Pendente' THEN 1 END) as pendentes,
    AVG(resistencia_28d_1) as media_resistencia_28d,
    AVG(temperatura) as media_temperatura,
    AVG(slump) as media_slump
FROM betonagens;

-- Vista para distribuição por elemento estrutural
CREATE OR REPLACE VIEW v_distribuicao_elementos AS
SELECT 
    elemento_estrutural,
    COUNT(*) as quantidade,
    AVG(resistencia_28d_1) as media_resistencia
FROM betonagens 
GROUP BY elemento_estrutural
ORDER BY quantidade DESC;

-- Vista para distribuição por fornecedor
CREATE OR REPLACE VIEW v_distribuicao_fornecedores AS
SELECT 
    f.nome as fornecedor,
    COUNT(b.id) as quantidade,
    AVG(b.resistencia_28d_1) as media_resistencia
FROM betonagens b
JOIN fornecedores_betao f ON b.fornecedor_id = f.id
GROUP BY f.id, f.nome
ORDER BY quantidade DESC;

-- Vista para evolução temporal
CREATE OR REPLACE VIEW v_evolucao_temporal AS
SELECT 
    DATE_TRUNC('week', data_betonagem) as semana,
    COUNT(*) as betonagens_semana,
    AVG(resistencia_28d_1) as media_resistencia_semana
FROM betonagens 
GROUP BY DATE_TRUNC('week', data_betonagem)
ORDER BY semana;

-- =====================================================
-- 7. FUNÇÕES
-- =====================================================

-- Função para obter estatísticas completas
CREATE OR REPLACE FUNCTION get_betonagens_stats()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_betonagens', COUNT(*),
        'conformes', COUNT(CASE WHEN status_conformidade = 'Conforme' THEN 1 END),
        'nao_conformes', COUNT(CASE WHEN status_conformidade = 'Não Conforme' THEN 1 END),
        'pendentes', COUNT(CASE WHEN status_conformidade = 'Pendente' THEN 1 END),
        'media_resistencia_28d', AVG(resistencia_28d_1),
        'media_temperatura', AVG(temperatura),
        'media_slump', AVG(slump),
        'distribuicao_elementos', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'elemento', elemento_estrutural,
                    'quantidade', quantidade,
                    'media_resistencia', media_resistencia
                )
            )
            FROM v_distribuicao_elementos
        ),
        'distribuicao_fornecedores', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'fornecedor', fornecedor,
                    'quantidade', quantidade,
                    'media_resistencia', media_resistencia
                )
            )
            FROM v_distribuicao_fornecedores
        )
    ) INTO result
    FROM betonagens;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar status de conformidade
CREATE OR REPLACE FUNCTION update_conformidade_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar status baseado na resistência 28d
    IF NEW.resistencia_28d_1 IS NOT NULL AND NEW.resistencia_28d_2 IS NOT NULL AND NEW.resistencia_28d_3 IS NOT NULL THEN
        DECLARE
            media_resistencia DECIMAL(5,2);
            resistencia_esperada DECIMAL(5,2);
        BEGIN
            -- Calcular média das resistências 28d
            media_resistencia := (NEW.resistencia_28d_1 + NEW.resistencia_28d_2 + NEW.resistencia_28d_3) / 3;
            
            -- Obter resistência esperada do tipo de betão
            SELECT resistencia_caracteristica INTO resistencia_esperada
            FROM tipos_betao
            WHERE id = NEW.tipo_betao_id;
            
            -- Atualizar status
            IF media_resistencia >= resistencia_esperada * 0.95 THEN
                NEW.status_conformidade := 'Conforme';
            ELSE
                NEW.status_conformidade := 'Não Conforme';
            END IF;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. TRIGGERS
-- =====================================================

-- Triggers para atualizar updated_at
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tipos_betao_updated_at') THEN
        CREATE TRIGGER update_tipos_betao_updated_at
            BEFORE UPDATE ON tipos_betao
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_aditivos_updated_at') THEN
        CREATE TRIGGER update_aditivos_updated_at
            BEFORE UPDATE ON aditivos
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_fornecedores_betao_updated_at') THEN
        CREATE TRIGGER update_fornecedores_betao_updated_at
            BEFORE UPDATE ON fornecedores_betao
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_betonagens_updated_at') THEN
        CREATE TRIGGER update_betonagens_updated_at
            BEFORE UPDATE ON betonagens
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ensaios_betonagem_updated_at') THEN
        CREATE TRIGGER update_ensaios_betonagem_updated_at
            BEFORE UPDATE ON ensaios_betonagem
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_controlo_cura_updated_at') THEN
        CREATE TRIGGER update_controlo_cura_updated_at
            BEFORE UPDATE ON controlo_cura
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Trigger para atualizar conformidade
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_betonagens_conformidade') THEN
        CREATE TRIGGER update_betonagens_conformidade
            BEFORE UPDATE ON betonagens
            FOR EACH ROW EXECUTE FUNCTION update_conformidade_status();
    END IF;
END $$;

-- =====================================================
-- 9. ÍNDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_betonagens_codigo ON betonagens(codigo);
CREATE INDEX IF NOT EXISTS idx_betonagens_obra ON betonagens(obra);
CREATE INDEX IF NOT EXISTS idx_betonagens_data ON betonagens(data_betonagem);
CREATE INDEX IF NOT EXISTS idx_betonagens_status ON betonagens(status_conformidade);
CREATE INDEX IF NOT EXISTS idx_betonagens_fornecedor ON betonagens(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_betonagens_tipo ON betonagens(tipo_betao_id);
CREATE INDEX IF NOT EXISTS idx_ensaios_betonagem_id ON ensaios_betonagem(betonagem_id);
CREATE INDEX IF NOT EXISTS idx_controlo_cura_betonagem_id ON controlo_cura(betonagem_id);

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Ativar RLS nas tabelas
ALTER TABLE betonagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE ensaios_betonagem ENABLE ROW LEVEL SECURITY;
ALTER TABLE controlo_cura ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para betonagens
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'betonagens' AND policyname = 'Users can view own betonagens') THEN
        CREATE POLICY "Users can view own betonagens" ON betonagens
            FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'betonagens' AND policyname = 'Users can insert own betonagens') THEN
        CREATE POLICY "Users can insert own betonagens" ON betonagens
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'betonagens' AND policyname = 'Users can update own betonagens') THEN
        CREATE POLICY "Users can update own betonagens" ON betonagens
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'betonagens' AND policyname = 'Users can delete own betonagens') THEN
        CREATE POLICY "Users can delete own betonagens" ON betonagens
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Políticas RLS para ensaios_betonagem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ensaios_betonagem' AND policyname = 'Users can view own ensaios') THEN
        CREATE POLICY "Users can view own ensaios" ON ensaios_betonagem
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM betonagens 
                    WHERE betonagens.id = ensaios_betonagem.betonagem_id 
                    AND (betonagens.user_id = auth.uid() OR betonagens.user_id IS NULL)
                )
            );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ensaios_betonagem' AND policyname = 'Users can insert own ensaios') THEN
        CREATE POLICY "Users can insert own ensaios" ON ensaios_betonagem
            FOR INSERT WITH CHECK (
                EXISTS (
                    SELECT 1 FROM betonagens 
                    WHERE betonagens.id = ensaios_betonagem.betonagem_id 
                    AND betonagens.user_id = auth.uid()
                )
            );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ensaios_betonagem' AND policyname = 'Users can update own ensaios') THEN
        CREATE POLICY "Users can update own ensaios" ON ensaios_betonagem
            FOR UPDATE USING (
                EXISTS (
                    SELECT 1 FROM betonagens 
                    WHERE betonagens.id = ensaios_betonagem.betonagem_id 
                    AND betonagens.user_id = auth.uid()
                )
            );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ensaios_betonagem' AND policyname = 'Users can delete own ensaios') THEN
        CREATE POLICY "Users can delete own ensaios" ON ensaios_betonagem
            FOR DELETE USING (
                EXISTS (
                    SELECT 1 FROM betonagens 
                    WHERE betonagens.id = ensaios_betonagem.betonagem_id 
                    AND betonagens.user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- Políticas RLS para controlo_cura
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'controlo_cura' AND policyname = 'Users can view own controlo_cura') THEN
        CREATE POLICY "Users can view own controlo_cura" ON controlo_cura
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM betonagens 
                    WHERE betonagens.id = controlo_cura.betonagem_id 
                    AND (betonagens.user_id = auth.uid() OR betonagens.user_id IS NULL)
                )
            );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'controlo_cura' AND policyname = 'Users can insert own controlo_cura') THEN
        CREATE POLICY "Users can insert own controlo_cura" ON controlo_cura
            FOR INSERT WITH CHECK (
                EXISTS (
                    SELECT 1 FROM betonagens 
                    WHERE betonagens.id = controlo_cura.betonagem_id 
                    AND betonagens.user_id = auth.uid()
                )
            );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'controlo_cura' AND policyname = 'Users can update own controlo_cura') THEN
        CREATE POLICY "Users can update own controlo_cura" ON controlo_cura
            FOR UPDATE USING (
                EXISTS (
                    SELECT 1 FROM betonagens 
                    WHERE betonagens.id = controlo_cura.betonagem_id 
                    AND betonagens.user_id = auth.uid()
                )
            );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'controlo_cura' AND policyname = 'Users can delete own controlo_cura') THEN
        CREATE POLICY "Users can delete own controlo_cura" ON controlo_cura
            FOR DELETE USING (
                EXISTS (
                    SELECT 1 FROM betonagens 
                    WHERE betonagens.id = controlo_cura.betonagem_id 
                    AND betonagens.user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
