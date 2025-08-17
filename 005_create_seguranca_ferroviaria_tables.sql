-- =====================================================
-- SCRIPT SQL: Criação das Tabelas de Segurança Ferroviária
-- Módulo: Segurança Ferroviária
-- Data: 2024
-- Descrição: Tabelas para gestão de sistemas de segurança ferroviária
-- =====================================================

-- Habilitar extensão UUID se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: seguranca_ferroviaria
-- =====================================================
CREATE TABLE IF NOT EXISTS seguranca_ferroviaria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(100) NOT NULL CHECK (tipo IN (
        'Sistema de Detecção',
        'Sistema de Vigilância', 
        'Sistema de Controle',
        'Sistema de Alarme'
    )),
    categoria VARCHAR(100) NOT NULL CHECK (categoria IN (
        'Detecção de Intrusão',
        'CCTV',
        'Controle de Acesso',
        'Alarme de Incêndio',
        'Detecção de Fumo',
        'Sistema de Emergência'
    )),
    localizacao VARCHAR(255) NOT NULL,
    km_inicial DECIMAL(10,3) NOT NULL CHECK (km_inicial >= 0),
    km_final DECIMAL(10,3) NOT NULL CHECK (km_final > km_inicial),
    estado VARCHAR(50) NOT NULL CHECK (estado IN (
        'Ativo',
        'Manutenção',
        'Avaria',
        'Inativo'
    )),
    fabricante VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    data_instalacao DATE NOT NULL,
    status_operacional VARCHAR(50) NOT NULL CHECK (status_operacional IN (
        'Operacional',
        'Manutenção',
        'Teste',
        'Desligado'
    )),
    observacoes TEXT,
    parametros JSONB NOT NULL DEFAULT '{}',
    ultima_inspecao DATE,
    proxima_inspecao DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: inspecoes_seguranca
-- =====================================================
CREATE TABLE IF NOT EXISTS inspecoes_seguranca (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seguranca_id UUID NOT NULL REFERENCES seguranca_ferroviaria(id) ON DELETE CASCADE,
    data_inspecao DATE NOT NULL,
    tipo_inspecao VARCHAR(100) NOT NULL CHECK (tipo_inspecao IN (
        'Preventiva',
        'Corretiva',
        'Periódica',
        'Emergencial',
        'Funcional',
        'Integridade'
    )),
    resultado VARCHAR(50) NOT NULL CHECK (resultado IN (
        'Conforme',
        'Não Conforme',
        'Pendente',
        'Aprovado',
        'Reprovado'
    )),
    observacoes TEXT,
    responsavel VARCHAR(100) NOT NULL,
    proxima_inspecao DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para seguranca_ferroviaria
CREATE INDEX IF NOT EXISTS idx_seguranca_codigo ON seguranca_ferroviaria(codigo);
CREATE INDEX IF NOT EXISTS idx_seguranca_tipo ON seguranca_ferroviaria(tipo);
CREATE INDEX IF NOT EXISTS idx_seguranca_categoria ON seguranca_ferroviaria(categoria);
CREATE INDEX IF NOT EXISTS idx_seguranca_estado ON seguranca_ferroviaria(estado);
CREATE INDEX IF NOT EXISTS idx_seguranca_fabricante ON seguranca_ferroviaria(fabricante);
CREATE INDEX IF NOT EXISTS idx_seguranca_status_operacional ON seguranca_ferroviaria(status_operacional);
CREATE INDEX IF NOT EXISTS idx_seguranca_km_inicial ON seguranca_ferroviaria(km_inicial);
CREATE INDEX IF NOT EXISTS idx_seguranca_km_final ON seguranca_ferroviaria(km_final);
CREATE INDEX IF NOT EXISTS idx_seguranca_proxima_inspecao ON seguranca_ferroviaria(proxima_inspecao);
CREATE INDEX IF NOT EXISTS idx_seguranca_created_at ON seguranca_ferroviaria(created_at);

-- Índices para inspecoes_seguranca
CREATE INDEX IF NOT EXISTS idx_inspecoes_seguranca_seguranca_id ON inspecoes_seguranca(seguranca_id);
CREATE INDEX IF NOT EXISTS idx_inspecoes_seguranca_data_inspecao ON inspecoes_seguranca(data_inspecao);
CREATE INDEX IF NOT EXISTS idx_inspecoes_seguranca_tipo_inspecao ON inspecoes_seguranca(tipo_inspecao);
CREATE INDEX IF NOT EXISTS idx_inspecoes_seguranca_resultado ON inspecoes_seguranca(resultado);
CREATE INDEX IF NOT EXISTS idx_inspecoes_seguranca_responsavel ON inspecoes_seguranca(responsavel);
CREATE INDEX IF NOT EXISTS idx_inspecoes_seguranca_proxima_inspecao ON inspecoes_seguranca(proxima_inspecao);

-- Índices para JSONB (parâmetros)
CREATE INDEX IF NOT EXISTS idx_seguranca_parametros_nivel_seguranca ON seguranca_ferroviaria USING GIN ((parametros->>'nivel_seguranca'));
CREATE INDEX IF NOT EXISTS idx_seguranca_parametros_raio_cobertura ON seguranca_ferroviaria USING GIN ((parametros->>'raio_cobertura'));
CREATE INDEX IF NOT EXISTS idx_seguranca_parametros_tempo_resposta ON seguranca_ferroviaria USING GIN ((parametros->>'tempo_resposta'));
CREATE INDEX IF NOT EXISTS idx_seguranca_parametros_capacidade_deteccao ON seguranca_ferroviaria USING GIN ((parametros->>'capacidade_deteccao'));

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas
CREATE TRIGGER update_seguranca_ferroviaria_updated_at 
    BEFORE UPDATE ON seguranca_ferroviaria 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspecoes_seguranca_updated_at 
    BEFORE UPDATE ON inspecoes_seguranca 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO PARA ESTATÍSTICAS
-- =====================================================
CREATE OR REPLACE FUNCTION get_seguranca_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_sistemas', COUNT(*),
        'ativos', COUNT(*) FILTER (WHERE estado = 'Ativo'),
        'em_manutencao', COUNT(*) FILTER (WHERE estado = 'Manutenção'),
        'com_avaria', COUNT(*) FILTER (WHERE estado = 'Avaria'),
        'inspecoes_pendentes', COUNT(*) FILTER (WHERE proxima_inspecao <= CURRENT_DATE + INTERVAL '30 days'),
        'tipos_distribuicao', (
            SELECT json_object_agg(tipo, count)
            FROM (
                SELECT tipo, COUNT(*) as count
                FROM seguranca_ferroviaria
                GROUP BY tipo
            ) t
        ),
        'status_distribuicao', (
            SELECT json_object_agg(estado, count)
            FROM (
                SELECT estado, COUNT(*) as count
                FROM seguranca_ferroviaria
                GROUP BY estado
            ) s
        ),
        'proximas_inspecoes_7d', COUNT(*) FILTER (WHERE proxima_inspecao <= CURRENT_DATE + INTERVAL '7 days'),
        'proximas_inspecoes_30d', COUNT(*) FILTER (WHERE proxima_inspecao <= CURRENT_DATE + INTERVAL '30 days')
    ) INTO result
    FROM seguranca_ferroviaria;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE seguranca_ferroviaria ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspecoes_seguranca ENABLE ROW LEVEL SECURITY;

-- Políticas para seguranca_ferroviaria
CREATE POLICY "Permitir leitura para usuários autenticados" ON seguranca_ferroviaria
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção para usuários autenticados" ON seguranca_ferroviaria
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados" ON seguranca_ferroviaria
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados" ON seguranca_ferroviaria
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para inspecoes_seguranca
CREATE POLICY "Permitir leitura para usuários autenticados" ON inspecoes_seguranca
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir inserção para usuários autenticados" ON inspecoes_seguranca
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização para usuários autenticados" ON inspecoes_seguranca
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão para usuários autenticados" ON inspecoes_seguranca
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Inserir dados de exemplo na tabela seguranca_ferroviaria
INSERT INTO seguranca_ferroviaria (
    codigo, tipo, categoria, localizacao, km_inicial, km_final, 
    estado, fabricante, modelo, data_instalacao, status_operacional, 
    observacoes, parametros, ultima_inspecao, proxima_inspecao
) VALUES 
(
    'SEG-001-2024',
    'Sistema de Detecção',
    'Detecção de Intrusão',
    'Lisboa - Estação Central',
    0.000,
    5.000,
    'Ativo',
    'Siemens',
    'SICAM PAS',
    '2024-01-15',
    'Operacional',
    'Sistema de detecção de intrusão na estação central',
    '{"nivel_seguranca": 5, "raio_cobertura": 500, "tempo_resposta": 2, "capacidade_deteccao": 95}',
    '2024-01-20',
    '2024-04-20'
),
(
    'SEG-002-2024',
    'Sistema de Vigilância',
    'CCTV',
    'Porto - São Bento',
    315.500,
    320.500,
    'Ativo',
    'Bosch',
    'DINION IP 4000',
    '2024-01-10',
    'Operacional',
    'Sistema de vigilância por vídeo na estação do Porto',
    '{"nivel_seguranca": 4, "raio_cobertura": 300, "tempo_resposta": 1, "capacidade_deteccao": 90}',
    '2024-01-25',
    '2024-04-25'
),
(
    'SEG-003-2024',
    'Sistema de Controle',
    'Controle de Acesso',
    'Coimbra-B',
    205.200,
    210.200,
    'Ativo',
    'Honeywell',
    'WIN-PAK',
    '2024-01-20',
    'Operacional',
    'Sistema de controle de acesso na estação de Coimbra',
    '{"nivel_seguranca": 5, "raio_cobertura": 200, "tempo_resposta": 1, "capacidade_deteccao": 98}',
    '2024-01-30',
    '2024-04-30'
),
(
    'SEG-004-2024',
    'Sistema de Alarme',
    'Alarme de Incêndio',
    'Braga',
    365.800,
    370.800,
    'Manutenção',
    'Notifier',
    'AFP-320',
    '2024-01-05',
    'Manutenção',
    'Sistema de alarme de incêndio em manutenção preventiva',
    '{"nivel_seguranca": 4, "raio_cobertura": 400, "tempo_resposta": 3, "capacidade_deteccao": 92}',
    '2024-02-01',
    '2024-05-01'
),
(
    'SEG-005-2024',
    'Sistema de Detecção',
    'Detecção de Fumo',
    'Faro',
    278.900,
    283.900,
    'Ativo',
    'Edwards',
    'EST3',
    '2024-01-12',
    'Operacional',
    'Sistema de detecção de fumo na estação do Algarve',
    '{"nivel_seguranca": 3, "raio_cobertura": 250, "tempo_resposta": 2, "capacidade_deteccao": 88}',
    '2024-01-18',
    '2024-04-18'
)
ON CONFLICT (codigo) DO NOTHING;

-- Inserir dados de exemplo na tabela inspecoes_seguranca
INSERT INTO inspecoes_seguranca (
    seguranca_id, data_inspecao, tipo_inspecao, resultado, 
    observacoes, responsavel, proxima_inspecao
) VALUES 
(
    (SELECT id FROM seguranca_ferroviaria WHERE codigo = 'SEG-001-2024'),
    '2024-01-20',
    'Periódica',
    'Conforme',
    'Sistema funcionando perfeitamente. Todos os sensores operacionais.',
    'Eng. João Silva',
    '2024-04-20'
),
(
    (SELECT id FROM seguranca_ferroviaria WHERE codigo = 'SEG-002-2024'),
    '2024-01-25',
    'Funcional',
    'Conforme',
    'Câmeras operacionais. Sistema de gravação funcionando corretamente.',
    'Téc. Maria Santos',
    '2024-04-25'
),
(
    (SELECT id FROM seguranca_ferroviaria WHERE codigo = 'SEG-003-2024'),
    '2024-01-30',
    'Preventiva',
    'Conforme',
    'Controle de acesso funcionando. Cartões sendo lidos corretamente.',
    'Eng. Pedro Costa',
    '2024-04-30'
),
(
    (SELECT id FROM seguranca_ferroviaria WHERE codigo = 'SEG-004-2024'),
    '2024-02-01',
    'Corretiva',
    'Pendente',
    'Sistema em manutenção. Substituição de sensores necessária.',
    'Téc. Ana Ferreira',
    '2024-05-01'
),
(
    (SELECT id FROM seguranca_ferroviaria WHERE codigo = 'SEG-005-2024'),
    '2024-01-18',
    'Periódica',
    'Conforme',
    'Detectores de fumo funcionando. Sistema de alarme operacional.',
    'Eng. Carlos Lima',
    '2024-04-18'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMENTÁRIOS NAS TABELAS E COLUNAS
-- =====================================================

COMMENT ON TABLE seguranca_ferroviaria IS 'Tabela principal para gestão de sistemas de segurança ferroviária';
COMMENT ON COLUMN seguranca_ferroviaria.codigo IS 'Código único do sistema de segurança';
COMMENT ON COLUMN seguranca_ferroviaria.tipo IS 'Tipo do sistema de segurança';
COMMENT ON COLUMN seguranca_ferroviaria.categoria IS 'Categoria específica do sistema';
COMMENT ON COLUMN seguranca_ferroviaria.localizacao IS 'Localização física do sistema';
COMMENT ON COLUMN seguranca_ferroviaria.km_inicial IS 'Quilômetro inicial da área coberta';
COMMENT ON COLUMN seguranca_ferroviaria.km_final IS 'Quilômetro final da área coberta';
COMMENT ON COLUMN seguranca_ferroviaria.estado IS 'Estado atual do sistema';
COMMENT ON COLUMN seguranca_ferroviaria.fabricante IS 'Fabricante do equipamento';
COMMENT ON COLUMN seguranca_ferroviaria.modelo IS 'Modelo do equipamento';
COMMENT ON COLUMN seguranca_ferroviaria.data_instalacao IS 'Data de instalação do sistema';
COMMENT ON COLUMN seguranca_ferroviaria.status_operacional IS 'Status operacional atual';
COMMENT ON COLUMN seguranca_ferroviaria.parametros IS 'Parâmetros técnicos em formato JSON';
COMMENT ON COLUMN seguranca_ferroviaria.ultima_inspecao IS 'Data da última inspeção realizada';
COMMENT ON COLUMN seguranca_ferroviaria.proxima_inspecao IS 'Data da próxima inspeção programada';

COMMENT ON TABLE inspecoes_seguranca IS 'Tabela para registro de inspeções dos sistemas de segurança';
COMMENT ON COLUMN inspecoes_seguranca.seguranca_id IS 'Referência ao sistema de segurança';
COMMENT ON COLUMN inspecoes_seguranca.data_inspecao IS 'Data da inspeção';
COMMENT ON COLUMN inspecoes_seguranca.tipo_inspecao IS 'Tipo de inspeção realizada';
COMMENT ON COLUMN inspecoes_seguranca.resultado IS 'Resultado da inspeção';
COMMENT ON COLUMN inspecoes_seguranca.responsavel IS 'Responsável pela inspeção';
COMMENT ON COLUMN inspecoes_seguranca.proxima_inspecao IS 'Data da próxima inspeção programada';

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se as tabelas foram criadas corretamente
SELECT 
    'seguranca_ferroviaria' as tabela,
    COUNT(*) as registros
FROM seguranca_ferroviaria
UNION ALL
SELECT 
    'inspecoes_seguranca' as tabela,
    COUNT(*) as registros
FROM inspecoes_seguranca;

-- Verificar estatísticas
SELECT get_seguranca_stats();

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
