-- =====================================================
-- MIGRAÇÃO: Módulo de Auditorias SGQ
-- =====================================================

-- Tabela principal de auditorias
CREATE TABLE IF NOT EXISTS auditorias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('interna', 'externa', 'certificacao', 'seguimento', 'surpresa')),
    escopo TEXT NOT NULL,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE,
    duracao_horas INTEGER NOT NULL,
    local VARCHAR(255) NOT NULL,
    obra_id UUID NOT NULL,
    obra_nome VARCHAR(255) NOT NULL,
    
    -- Equipa de Auditoria
    auditor_principal VARCHAR(255) NOT NULL,
    auditores TEXT[] DEFAULT '{}',
    observadores TEXT[] DEFAULT '{}',
    
    -- Status e Resultados
    status VARCHAR(20) NOT NULL DEFAULT 'programada' CHECK (status IN ('programada', 'em_curso', 'concluida', 'cancelada', 'adiada')),
    resultado VARCHAR(30) DEFAULT 'pendente' CHECK (resultado IN ('conforme', 'nao_conforme', 'conforme_com_observacoes', 'pendente')),
    classificacao VARCHAR(20) DEFAULT 'satisfatorio' CHECK (classificacao IN ('excelente', 'bom', 'satisfatorio', 'insatisfatorio', 'critico')),
    
    -- Critérios e Normas
    normas_aplicaveis TEXT[] DEFAULT '{}',
    
    -- Métricas
    pontuacao_total INTEGER DEFAULT 0,
    pontuacao_maxima INTEGER DEFAULT 0,
    percentagem_conformidade INTEGER DEFAULT 0,
    
    -- Campos base
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responsavel VARCHAR(255) NOT NULL,
    zona VARCHAR(100) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendente' CHECK (estado IN ('pendente', 'em_analise', 'aprovado', 'reprovado', 'concluido')),
    observacoes TEXT,
    
    -- Aprovação
    aprovador VARCHAR(255),
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    comentarios_aprovacao TEXT,
    
    -- Relatório
    relatorio_url TEXT
);

-- Tabela de critérios de auditoria
CREATE TABLE IF NOT EXISTS criterios_auditoria (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auditoria_id UUID NOT NULL REFERENCES auditorias(id) ON DELETE CASCADE,
    codigo VARCHAR(20) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('documentacao', 'processos', 'recursos', 'resultados', 'melhoria')),
    peso INTEGER DEFAULT 1,
    pontuacao_maxima INTEGER NOT NULL DEFAULT 10,
    pontuacao_atual INTEGER DEFAULT 0,
    observacoes TEXT,
    evidencias TEXT[] DEFAULT '{}',
    conformidade VARCHAR(25) DEFAULT 'nao_aplicavel' CHECK (conformidade IN ('conforme', 'nao_conforme', 'parcialmente_conforme', 'nao_aplicavel')),
    
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de evidências de auditoria
CREATE TABLE IF NOT EXISTS evidencias_auditoria (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auditoria_id UUID NOT NULL REFERENCES auditorias(id) ON DELETE CASCADE,
    criterio_id UUID REFERENCES criterios_auditoria(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('foto', 'documento', 'registro', 'entrevista', 'observacao', 'outro')),
    descricao TEXT NOT NULL,
    url TEXT,
    data_captura TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responsavel VARCHAR(255) NOT NULL,
    observacoes TEXT
);

-- Tabela de não conformidades de auditoria
CREATE TABLE IF NOT EXISTS nao_conformidades_auditoria (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auditoria_id UUID NOT NULL REFERENCES auditorias(id) ON DELETE CASCADE,
    criterio_id UUID REFERENCES criterios_auditoria(id) ON DELETE CASCADE,
    codigo VARCHAR(20) NOT NULL,
    descricao TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('maior', 'menor', 'observacao')),
    evidencia TEXT NOT NULL,
    impacto VARCHAR(20) NOT NULL CHECK (impacto IN ('baixo', 'medio', 'alto', 'critico')),
    prazo_correcao DATE NOT NULL,
    responsavel_correcao VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'aberta' CHECK (status IN ('aberta', 'em_correcao', 'verificada', 'fechada')),
    acoes_corretivas TEXT[] DEFAULT '{}',
    data_verificacao TIMESTAMP WITH TIME ZONE,
    verificador VARCHAR(255),
    
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de observações de auditoria
CREATE TABLE IF NOT EXISTS observacoes_auditoria (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auditoria_id UUID NOT NULL REFERENCES auditorias(id) ON DELETE CASCADE,
    criterio_id UUID REFERENCES criterios_auditoria(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('melhoria', 'sugestao', 'observacao', 'elogio')),
    responsavel VARCHAR(255) NOT NULL,
    data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    prioridade VARCHAR(10) DEFAULT 'baixa' CHECK (prioridade IN ('baixa', 'media', 'alta')),
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'implementada', 'rejeitada'))
);

-- Tabela de ações corretivas
CREATE TABLE IF NOT EXISTS acoes_corretivas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auditoria_id UUID NOT NULL REFERENCES auditorias(id) ON DELETE CASCADE,
    nao_conformidade_id UUID REFERENCES nao_conformidades_auditoria(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    responsavel VARCHAR(255) NOT NULL,
    prazo DATE NOT NULL,
    custo_estimado DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_execucao', 'concluida', 'verificada')),
    data_inicio TIMESTAMP WITH TIME ZONE,
    data_conclusao TIMESTAMP WITH TIME ZONE,
    evidencias TEXT[] DEFAULT '{}',
    eficacia VARCHAR(25) DEFAULT 'pendente' CHECK (eficacia IN ('eficaz', 'parcialmente_eficaz', 'ineficaz', 'pendente')),
    
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de checklists de auditoria
CREATE TABLE IF NOT EXISTS checklists_auditoria (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    versao VARCHAR(20) NOT NULL,
    categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('geral', 'especifico', 'norma', 'processo')),
    normas_referencia TEXT[] DEFAULT '{}',
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    criador VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    utilizacoes INTEGER DEFAULT 0
);

-- Tabela de programas de auditoria
CREATE TABLE IF NOT EXISTS programas_auditorias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ano INTEGER NOT NULL,
    obra_id UUID NOT NULL,
    obra_nome VARCHAR(255) NOT NULL,
    responsavel_programa VARCHAR(255) NOT NULL,
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    aprovador VARCHAR(255),
    status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'aprovado', 'em_execucao', 'concluido')),
    observacoes TEXT,
    
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de auditorias planeadas
CREATE TABLE IF NOT EXISTS auditorias_planeadas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    programa_id UUID NOT NULL REFERENCES programas_auditorias(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('interna', 'externa', 'certificacao', 'seguimento')),
    mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
    escopo TEXT NOT NULL,
    duracao_estimada INTEGER NOT NULL,
    auditor_principal VARCHAR(255) NOT NULL,
    normas_aplicaveis TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'planeada' CHECK (status IN ('planeada', 'confirmada', 'realizada', 'cancelada')),
    auditoria_id UUID REFERENCES auditorias(id),
    
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relatórios de auditoria
CREATE TABLE IF NOT EXISTS relatorios_auditoria (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auditoria_id UUID NOT NULL REFERENCES auditorias(id) ON DELETE CASCADE,
    versao VARCHAR(20) NOT NULL,
    data_geracao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    gerador VARCHAR(255) NOT NULL,
    
    -- Conteúdo do Relatório
    resumo_executivo TEXT,
    metodologia TEXT,
    resultados_gerais TEXT,
    nao_conformidades_encontradas INTEGER DEFAULT 0,
    observacoes INTEGER DEFAULT 0,
    acoes_corretivas INTEGER DEFAULT 0,
    
    -- Métricas
    pontuacao_total INTEGER DEFAULT 0,
    percentagem_conformidade INTEGER DEFAULT 0,
    classificacao_geral VARCHAR(20),
    
    -- Aprovação
    aprovador VARCHAR(255),
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'aprovado', 'distribuido'))
);

-- Tabela de métricas de auditoria
CREATE TABLE IF NOT EXISTS metricas_auditoria (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    obra_id UUID NOT NULL,
    periodo VARCHAR(20) NOT NULL,
    total_auditorias INTEGER DEFAULT 0,
    auditorias_conformes INTEGER DEFAULT 0,
    auditorias_nao_conformes INTEGER DEFAULT 0,
    percentagem_conformidade INTEGER DEFAULT 0,
    nao_conformidades_maiores INTEGER DEFAULT 0,
    nao_conformidades_menores INTEGER DEFAULT 0,
    acoes_corretivas_abertas INTEGER DEFAULT 0,
    acoes_corretivas_concluidas INTEGER DEFAULT 0,
    tempo_medio_correcao INTEGER DEFAULT 0,
    custo_total_correcoes DECIMAL(12,2) DEFAULT 0,
    
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_auditorias_obra_id ON auditorias(obra_id);
CREATE INDEX IF NOT EXISTS idx_auditorias_status ON auditorias(status);
CREATE INDEX IF NOT EXISTS idx_auditorias_tipo ON auditorias(tipo);
CREATE INDEX IF NOT EXISTS idx_auditorias_data_inicio ON auditorias(data_inicio);
CREATE INDEX IF NOT EXISTS idx_auditorias_auditor_principal ON auditorias(auditor_principal);

CREATE INDEX IF NOT EXISTS idx_criterios_auditoria_id ON criterios_auditoria(auditoria_id);
CREATE INDEX IF NOT EXISTS idx_criterios_conformidade ON criterios_auditoria(conformidade);

CREATE INDEX IF NOT EXISTS idx_evidencias_auditoria_id ON evidencias_auditoria(auditoria_id);
CREATE INDEX IF NOT EXISTS idx_evidencias_criterio_id ON evidencias_auditoria(criterio_id);

CREATE INDEX IF NOT EXISTS idx_ncs_auditoria_id ON nao_conformidades_auditoria(auditoria_id);
CREATE INDEX IF NOT EXISTS idx_ncs_status ON nao_conformidades_auditoria(status);
CREATE INDEX IF NOT EXISTS idx_ncs_tipo ON nao_conformidades_auditoria(tipo);

CREATE INDEX IF NOT EXISTS idx_observacoes_auditoria_id ON observacoes_auditoria(auditoria_id);
CREATE INDEX IF NOT EXISTS idx_observacoes_status ON observacoes_auditoria(status);

CREATE INDEX IF NOT EXISTS idx_acoes_auditoria_id ON acoes_corretivas(auditoria_id);
CREATE INDEX IF NOT EXISTS idx_acoes_status ON acoes_corretivas(status);

CREATE INDEX IF NOT EXISTS idx_programas_ano ON programas_auditorias(ano);
CREATE INDEX IF NOT EXISTS idx_programas_obra_id ON programas_auditorias(obra_id);

CREATE INDEX IF NOT EXISTS idx_planeadas_programa_id ON auditorias_planeadas(programa_id);
CREATE INDEX IF NOT EXISTS idx_planeadas_status ON auditorias_planeadas(status);

CREATE INDEX IF NOT EXISTS idx_relatorios_auditoria_id ON relatorios_auditoria(auditoria_id);
CREATE INDEX IF NOT EXISTS idx_relatorios_status ON relatorios_auditoria(status);

CREATE INDEX IF NOT EXISTS idx_metricas_obra_id ON metricas_auditoria(obra_id);
CREATE INDEX IF NOT EXISTS idx_metricas_periodo ON metricas_auditoria(periodo);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar data_atualizacao
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar data_atualizacao
CREATE TRIGGER update_auditorias_updated_at BEFORE UPDATE ON auditorias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_criterios_auditoria_updated_at BEFORE UPDATE ON criterios_auditoria FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nao_conformidades_auditoria_updated_at BEFORE UPDATE ON nao_conformidades_auditoria FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_acoes_corretivas_updated_at BEFORE UPDATE ON acoes_corretivas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programas_auditorias_updated_at BEFORE UPDATE ON programas_auditorias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_auditorias_planeadas_updated_at BEFORE UPDATE ON auditorias_planeadas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_relatorios_auditoria_updated_at BEFORE UPDATE ON relatorios_auditoria FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_metricas_auditoria_updated_at BEFORE UPDATE ON metricas_auditoria FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular pontuação da auditoria
CREATE OR REPLACE FUNCTION calcular_pontuacao_auditoria(auditoria_uuid UUID)
RETURNS TABLE(total_pontuacao INTEGER, maxima_pontuacao INTEGER, percentagem INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(c.pontuacao_atual), 0)::INTEGER as total_pontuacao,
        COALESCE(SUM(c.pontuacao_maxima), 0)::INTEGER as maxima_pontuacao,
        CASE 
            WHEN COALESCE(SUM(c.pontuacao_maxima), 0) > 0 
            THEN ROUND((COALESCE(SUM(c.pontuacao_atual), 0)::DECIMAL / COALESCE(SUM(c.pontuacao_maxima), 1)::DECIMAL) * 100)::INTEGER
            ELSE 0 
        END as percentagem
    FROM criterios_auditoria c
    WHERE c.auditoria_id = auditoria_uuid;
END;
$$ LANGUAGE plpgsql;

-- Função para obter estatísticas de auditorias
CREATE OR REPLACE FUNCTION get_auditorias_stats()
RETURNS TABLE(
    total_auditorias BIGINT,
    auditorias_este_ano BIGINT,
    auditorias_este_mes BIGINT,
    percentagem_conformidade_geral INTEGER,
    nao_conformidades_abertas BIGINT,
    acoes_corretivas_pendentes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_auditorias,
        COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM data_criacao) = EXTRACT(YEAR FROM NOW()))::BIGINT as auditorias_este_ano,
        COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM data_criacao) = EXTRACT(YEAR FROM NOW()) AND EXTRACT(MONTH FROM data_criacao) = EXTRACT(MONTH FROM NOW()))::BIGINT as auditorias_este_mes,
        CASE 
            WHEN COUNT(*) > 0 
            THEN ROUND((COUNT(*) FILTER (WHERE resultado IN ('conforme', 'conforme_com_observacoes'))::DECIMAL / COUNT(*)::DECIMAL) * 100)::INTEGER
            ELSE 0 
        END as percentagem_conformidade_geral,
        (SELECT COUNT(*) FROM nao_conformidades_auditoria WHERE status = 'aberta')::BIGINT as nao_conformidades_abertas,
        (SELECT COUNT(*) FROM acoes_corretivas WHERE status = 'pendente')::BIGINT as acoes_corretivas_pendentes
    FROM auditorias;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Ativar RLS em todas as tabelas
ALTER TABLE auditorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE criterios_auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidencias_auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE nao_conformidades_auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE observacoes_auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE acoes_corretivas ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists_auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE programas_auditorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditorias_planeadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios_auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_auditoria ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir tudo para autenticados)
CREATE POLICY "Permitir acesso total para utilizadores autenticados" ON auditorias FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados" ON criterios_auditoria FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados" ON evidencias_auditoria FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados" ON nao_conformidades_auditoria FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados" ON observacoes_auditoria FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados" ON acoes_corretivas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados" ON checklists_auditoria FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados" ON programas_auditorias FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados" ON auditorias_planeadas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados" ON relatorios_auditoria FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir acesso total para utilizadores autenticados" ON metricas_auditoria FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir alguns checklists de exemplo
INSERT INTO checklists_auditoria (nome, versao, categoria, normas_referencia, criador) VALUES
('Checklist Auditoria Interna SGQ', '1.0', 'geral', ARRAY['ISO 9001:2015', 'NP EN ISO 9001:2015'], 'Sistema'),
('Checklist Auditoria de Processos', '1.0', 'especifico', ARRAY['ISO 9001:2015'], 'Sistema'),
('Checklist Auditoria de Documentação', '1.0', 'especifico', ARRAY['ISO 9001:2015'], 'Sistema'),
('Checklist Auditoria de Recursos', '1.0', 'especifico', ARRAY['ISO 9001:2015'], 'Sistema');

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE auditorias IS 'Tabela principal para armazenar auditorias do sistema SGQ';
COMMENT ON TABLE criterios_auditoria IS 'Critérios específicos avaliados em cada auditoria';
COMMENT ON TABLE evidencias_auditoria IS 'Evidências coletadas durante as auditorias';
COMMENT ON TABLE nao_conformidades_auditoria IS 'Não conformidades identificadas durante auditorias';
COMMENT ON TABLE observacoes_auditoria IS 'Observações e sugestões de melhoria';
COMMENT ON TABLE acoes_corretivas IS 'Ações corretivas para resolver não conformidades';
COMMENT ON TABLE checklists_auditoria IS 'Checklists reutilizáveis para auditorias';
COMMENT ON TABLE programas_auditorias IS 'Programas anuais de auditoria por obra';
COMMENT ON TABLE auditorias_planeadas IS 'Auditorias planeadas dentro dos programas';
COMMENT ON TABLE relatorios_auditoria IS 'Relatórios gerados das auditorias';
COMMENT ON TABLE metricas_auditoria IS 'Métricas e estatísticas de auditorias';
