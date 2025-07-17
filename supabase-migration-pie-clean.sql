-- Migração para criar as tabelas do sistema PIE (Pontos de Inspeção e Ensaios)
-- Execute este script no SQL Editor do Supabase

-- 1. TABELA DE MODELOS PIE
CREATE TABLE IF NOT EXISTS ppi_modelos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    descricao TEXT,
    categoria TEXT NOT NULL CHECK (categoria IN ('CCG', 'CCE', 'CCM', 'custom')),
    versao TEXT NOT NULL DEFAULT '1.0',
    ativo BOOLEAN DEFAULT true,
    tags TEXT[],
    metadata JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE SEÇÕES PIE
CREATE TABLE IF NOT EXISTS ppi_secoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    modelo_id UUID REFERENCES ppi_modelos(id) ON DELETE CASCADE,
    codigo TEXT NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    ordem INTEGER NOT NULL DEFAULT 0,
    obrigatorio BOOLEAN DEFAULT false,
    ativo BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(modelo_id, codigo)
);

-- 3. TABELA DE PONTOS PIE
CREATE TABLE IF NOT EXISTS ppi_pontos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    secao_id UUID REFERENCES ppi_secoes(id) ON DELETE CASCADE,
    codigo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT NOT NULL CHECK (tipo IN ('checkbox', 'radio', 'text', 'number', 'select', 'file', 'date')),
    obrigatorio BOOLEAN DEFAULT false,
    ordem INTEGER NOT NULL DEFAULT 0,
    opcoes JSONB DEFAULT '[]'::jsonb,
    validacao JSONB DEFAULT '{}'::jsonb,
    dependencias JSONB DEFAULT '[]'::jsonb,
    ativo BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(secao_id, codigo)
);

-- 4. TABELA DE INSTÂNCIAS PIE
CREATE TABLE IF NOT EXISTS ppi_instancias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    modelo_id UUID REFERENCES ppi_modelos(id) ON DELETE SET NULL,
    obra_id UUID REFERENCES obras(id) ON DELETE SET NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'em_andamento', 'concluido', 'aprovado', 'reprovado')),
    prioridade TEXT NOT NULL DEFAULT 'normal' CHECK (prioridade IN ('baixa', 'media', 'normal', 'alta', 'urgente')),
    data_planeada DATE,
    data_inicio DATE,
    data_conclusao DATE,
    responsavel TEXT,
    zona TEXT,
    observacoes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE RESPOSTAS PIE
CREATE TABLE IF NOT EXISTS ppi_respostas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    instancia_id UUID REFERENCES ppi_instancias(id) ON DELETE CASCADE,
    ponto_id UUID REFERENCES ppi_pontos(id) ON DELETE CASCADE,
    valor TEXT,
    valor_numerico DECIMAL(15,4),
    valor_booleano BOOLEAN,
    valor_data DATE,
    valor_json JSONB,
    arquivos TEXT[],
    observacoes TEXT,
    conforme BOOLEAN,
    responsavel TEXT,
    data_resposta DATE DEFAULT CURRENT_DATE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(instancia_id, ponto_id)
);

-- 6. TABELA DE HISTÓRICO PIE
CREATE TABLE IF NOT EXISTS ppi_historico (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    instancia_id UUID REFERENCES ppi_instancias(id) ON DELETE CASCADE,
    acao TEXT NOT NULL,
    tabela_afetada TEXT,
    registro_id UUID,
    dados_anteriores JSONB,
    dados_novos JSONB,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_ppi_modelos_categoria ON ppi_modelos(categoria);
CREATE INDEX IF NOT EXISTS idx_ppi_modelos_ativo ON ppi_modelos(ativo);
CREATE INDEX IF NOT EXISTS idx_ppi_modelos_user_id ON ppi_modelos(user_id);
CREATE INDEX IF NOT EXISTS idx_ppi_secoes_modelo_id ON ppi_secoes(modelo_id);
CREATE INDEX IF NOT EXISTS idx_ppi_secoes_ordem ON ppi_secoes(ordem);
CREATE INDEX IF NOT EXISTS idx_ppi_secoes_ativo ON ppi_secoes(ativo);
CREATE INDEX IF NOT EXISTS idx_ppi_pontos_secao_id ON ppi_pontos(secao_id);
CREATE INDEX IF NOT EXISTS idx_ppi_pontos_tipo ON ppi_pontos(tipo);
CREATE INDEX IF NOT EXISTS idx_ppi_pontos_ordem ON ppi_pontos(ordem);
CREATE INDEX IF NOT EXISTS idx_ppi_pontos_ativo ON ppi_pontos(ativo);
CREATE INDEX IF NOT EXISTS idx_ppi_instancias_status ON ppi_instancias(status);
CREATE INDEX IF NOT EXISTS idx_ppi_instancias_prioridade ON ppi_instancias(prioridade);
CREATE INDEX IF NOT EXISTS idx_ppi_instancias_obra_id ON ppi_instancias(obra_id);
CREATE INDEX IF NOT EXISTS idx_ppi_instancias_user_id ON ppi_instancias(user_id);
CREATE INDEX IF NOT EXISTS idx_ppi_instancias_data_planeada ON ppi_instancias(data_planeada);
CREATE INDEX IF NOT EXISTS idx_ppi_respostas_instancia_id ON ppi_respostas(instancia_id);
CREATE INDEX IF NOT EXISTS idx_ppi_respostas_ponto_id ON ppi_respostas(ponto_id);
CREATE INDEX IF NOT EXISTS idx_ppi_respostas_conforme ON ppi_respostas(conforme);
CREATE INDEX IF NOT EXISTS idx_ppi_historico_instancia_id ON ppi_historico(instancia_id);
CREATE INDEX IF NOT EXISTS idx_ppi_historico_acao ON ppi_historico(acao);
CREATE INDEX IF NOT EXISTS idx_ppi_historico_created_at ON ppi_historico(created_at);

-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA DE TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ppi_modelos_updated_at BEFORE UPDATE ON ppi_modelos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ppi_secoes_updated_at BEFORE UPDATE ON ppi_secoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ppi_pontos_updated_at BEFORE UPDATE ON ppi_pontos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ppi_instancias_updated_at BEFORE UPDATE ON ppi_instancias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ppi_respostas_updated_at BEFORE UPDATE ON ppi_respostas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE ppi_modelos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppi_secoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppi_pontos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppi_instancias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppi_respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppi_historico ENABLE ROW LEVEL SECURITY;

-- Políticas para ppi_modelos
CREATE POLICY "Usuários podem ver modelos ativos" ON ppi_modelos FOR SELECT USING (ativo = true);
CREATE POLICY "Usuários podem criar seus próprios modelos" ON ppi_modelos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem editar seus próprios modelos" ON ppi_modelos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar seus próprios modelos" ON ppi_modelos FOR DELETE USING (auth.uid() = user_id);

-- Políticas para ppi_secoes
CREATE POLICY "Usuários podem ver seções ativas" ON ppi_secoes FOR SELECT USING (ativo = true);
CREATE POLICY "Usuários podem criar seções" ON ppi_secoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuários podem editar seções" ON ppi_secoes FOR UPDATE USING (true);
CREATE POLICY "Usuários podem deletar seções" ON ppi_secoes FOR DELETE USING (true);

-- Políticas para ppi_pontos
CREATE POLICY "Usuários podem ver pontos ativos" ON ppi_pontos FOR SELECT USING (ativo = true);
CREATE POLICY "Usuários podem criar pontos" ON ppi_pontos FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuários podem editar pontos" ON ppi_pontos FOR UPDATE USING (true);
CREATE POLICY "Usuários podem deletar pontos" ON ppi_pontos FOR DELETE USING (true);

-- Políticas para ppi_instancias
CREATE POLICY "Usuários podem ver suas próprias instâncias" ON ppi_instancias FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar suas próprias instâncias" ON ppi_instancias FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem editar suas próprias instâncias" ON ppi_instancias FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar suas próprias instâncias" ON ppi_instancias FOR DELETE USING (auth.uid() = user_id);

-- Políticas para ppi_respostas
CREATE POLICY "Usuários podem ver respostas de suas instâncias" ON ppi_respostas FOR SELECT USING (
    EXISTS (SELECT 1 FROM ppi_instancias WHERE id = ppi_respostas.instancia_id AND user_id = auth.uid())
);
CREATE POLICY "Usuários podem criar respostas" ON ppi_respostas FOR INSERT WITH CHECK (true);
CREATE POLICY "Usuários podem editar respostas" ON ppi_respostas FOR UPDATE USING (true);
CREATE POLICY "Usuários podem deletar respostas" ON ppi_respostas FOR DELETE USING (true);

-- Políticas para ppi_historico
CREATE POLICY "Usuários podem ver histórico de suas instâncias" ON ppi_historico FOR SELECT USING (
    EXISTS (SELECT 1 FROM ppi_instancias WHERE id = ppi_historico.instancia_id AND user_id = auth.uid())
);
CREATE POLICY "Sistema pode criar histórico" ON ppi_historico FOR INSERT WITH CHECK (true);

-- DADOS DE EXEMPLO
INSERT INTO ppi_modelos (codigo, nome, descricao, categoria, versao, ativo, tags, user_id) VALUES
('CCG-001', 'Controle de Qualidade Geral', 'Modelo padrão para controle de qualidade geral', 'CCG', '1.0', true, ARRAY['qualidade', 'controle'], auth.uid())
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO ppi_secoes (modelo_id, codigo, nome, descricao, ordem, obrigatorio, ativo) 
SELECT 
    m.id,
    'SEC-001',
    'Informações Gerais',
    'Informações básicas do projeto',
    1,
    true,
    true
FROM ppi_modelos m WHERE m.codigo = 'CCG-001'
ON CONFLICT (modelo_id, codigo) DO NOTHING;

INSERT INTO ppi_secoes (modelo_id, codigo, nome, descricao, ordem, obrigatorio, ativo) 
SELECT 
    m.id,
    'SEC-002',
    'Inspeção Visual',
    'Verificações visuais do projeto',
    2,
    true,
    true
FROM ppi_modelos m WHERE m.codigo = 'CCG-001'
ON CONFLICT (modelo_id, codigo) DO NOTHING;

INSERT INTO ppi_pontos (secao_id, codigo, titulo, descricao, tipo, obrigatorio, ordem, opcoes, ativo)
SELECT 
    s.id,
    'PONTO-001',
    'Projeto aprovado',
    'Verificar se o projeto foi aprovado',
    'checkbox',
    true,
    1,
    '[]'::jsonb,
    true
FROM ppi_secoes s 
JOIN ppi_modelos m ON s.modelo_id = m.id 
WHERE m.codigo = 'CCG-001' AND s.codigo = 'SEC-001'
ON CONFLICT (secao_id, codigo) DO NOTHING;

INSERT INTO ppi_pontos (secao_id, codigo, titulo, descricao, tipo, obrigatorio, ordem, opcoes, ativo)
SELECT 
    s.id,
    'PONTO-002',
    'Documentação completa',
    'Verificar se toda documentação está presente',
    'checkbox',
    true,
    2,
    '[]'::jsonb,
    true
FROM ppi_secoes s 
JOIN ppi_modelos m ON s.modelo_id = m.id 
WHERE m.codigo = 'CCG-001' AND s.codigo = 'SEC-001'
ON CONFLICT (secao_id, codigo) DO NOTHING;

INSERT INTO ppi_pontos (secao_id, codigo, titulo, descricao, tipo, obrigatorio, ordem, opcoes, ativo)
SELECT 
    s.id,
    'PONTO-003',
    'Estado da superfície',
    'Avaliar o estado da superfície',
    'select',
    true,
    1,
    '["Excelente", "Bom", "Regular", "Ruim"]'::jsonb,
    true
FROM ppi_secoes s 
JOIN ppi_modelos m ON s.modelo_id = m.id 
WHERE m.codigo = 'CCG-001' AND s.codigo = 'SEC-002'
ON CONFLICT (secao_id, codigo) DO NOTHING;

INSERT INTO ppi_instancias (codigo, modelo_id, titulo, descricao, status, prioridade, responsavel, user_id)
SELECT 
    'PIE-2024-001',
    m.id,
    'Controle de Qualidade - Obra Principal',
    'Inspeção de qualidade na obra principal',
    'em_andamento',
    'alta',
    'João Silva',
    auth.uid()
FROM ppi_modelos m WHERE m.codigo = 'CCG-001'
ON CONFLICT (codigo) DO NOTHING;

-- FUNÇÕES ÚTEIS
CREATE OR REPLACE FUNCTION gerar_codigo_pie()
RETURNS TEXT AS $$
DECLARE
    ano_atual TEXT;
    proximo_numero INTEGER;
    codigo TEXT;
BEGIN
    ano_atual := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(codigo FROM 9) AS INTEGER)), 0) + 1
    INTO proximo_numero
    FROM ppi_instancias
    WHERE codigo LIKE 'PIE-' || ano_atual || '-%';
    
    codigo := 'PIE-' || ano_atual || '-' || LPAD(proximo_numero::TEXT, 3, '0');
    
    RETURN codigo;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calcular_estatisticas_pie(instancia_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    total_pontos INTEGER;
    pontos_preenchidos INTEGER;
    pontos_conformes INTEGER;
    pontos_nao_conformes INTEGER;
    resultado JSONB;
BEGIN
    SELECT COUNT(*)
    INTO total_pontos
    FROM ppi_pontos p
    JOIN ppi_secoes s ON p.secao_id = s.id
    JOIN ppi_modelos m ON s.modelo_id = m.id
    JOIN ppi_instancias i ON i.modelo_id = m.id
    WHERE i.id = instancia_uuid AND p.ativo = true;
    
    SELECT COUNT(*)
    INTO pontos_preenchidos
    FROM ppi_respostas r
    WHERE r.instancia_id = instancia_uuid;
    
    SELECT COUNT(*)
    INTO pontos_conformes
    FROM ppi_respostas r
    WHERE r.instancia_id = instancia_uuid AND r.conforme = true;
    
    SELECT COUNT(*)
    INTO pontos_nao_conformes
    FROM ppi_respostas r
    WHERE r.instancia_id = instancia_uuid AND r.conforme = false;
    
    resultado := jsonb_build_object(
        'total_pontos', total_pontos,
        'pontos_preenchidos', pontos_preenchidos,
        'pontos_conformes', pontos_conformes,
        'pontos_nao_conformes', pontos_nao_conformes,
        'percentagem_conclusao', CASE 
            WHEN total_pontos > 0 THEN ROUND((pontos_preenchidos::DECIMAL / total_pontos) * 100, 2)
            ELSE 0
        END
    );
    
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- VIEWS ÚTEIS
CREATE OR REPLACE VIEW v_instancias_com_estatisticas AS
SELECT 
    i.*,
    m.nome as modelo_nome,
    m.categoria as modelo_categoria,
    o.nome as obra_nome,
    calcular_estatisticas_pie(i.id) as estatisticas
FROM ppi_instancias i
LEFT JOIN ppi_modelos m ON i.modelo_id = m.id
LEFT JOIN obras o ON i.obra_id = o.id;

CREATE OR REPLACE VIEW v_relatorio_pie_completo AS
SELECT 
    i.id as instancia_id,
    i.codigo as instancia_codigo,
    i.titulo as instancia_titulo,
    i.status as instancia_status,
    i.prioridade as instancia_prioridade,
    i.data_planeada,
    i.responsavel as instancia_responsavel,
    m.nome as modelo_nome,
    m.categoria as modelo_categoria,
    o.nome as obra_nome,
    s.codigo as secao_codigo,
    s.nome as secao_nome,
    s.ordem as secao_ordem,
    p.codigo as ponto_codigo,
    p.titulo as ponto_titulo,
    p.tipo as ponto_tipo,
    p.obrigatorio as ponto_obrigatorio,
    p.ordem as ponto_ordem,
    r.valor,
    r.valor_numerico,
    r.valor_booleano,
    r.valor_data,
    r.conforme,
    r.observacoes as resposta_observacoes,
    r.data_resposta,
    r.responsavel as resposta_responsavel
FROM ppi_instancias i
LEFT JOIN ppi_modelos m ON i.modelo_id = m.id
LEFT JOIN obras o ON i.obra_id = o.id
LEFT JOIN ppi_secoes s ON m.id = s.modelo_id
LEFT JOIN ppi_pontos p ON s.id = p.secao_id
LEFT JOIN ppi_respostas r ON (i.id = r.instancia_id AND p.id = r.ponto_id)
WHERE s.ativo = true AND p.ativo = true
ORDER BY i.created_at DESC, s.ordem, p.ordem; 