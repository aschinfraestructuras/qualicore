-- =====================================================
-- SISTEMA PPI (PONTOS DE INSPEÇÃO E ENSAIO) - SUPABASE
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS uuid-ossp
-- 1. TABELAS PRINCIPAIS
-- =====================================================

-- Tabela de modelos PPI (templates reutilizáveis)
CREATE TABLE IF NOT EXISTS ppi_modelos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(10) NOT NULL, -- CCG, E', 'CCM',custom'
    versao VARCHAR(20) DEFAULT '10,
    ativo BOOLEAN DEFAULT true,
    tags TEXT[], -- Para categorização e busca
    metadata JSONB, -- Dados adicionais flexíveis
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de seções dos modelos PPI
CREATE TABLE IF NOT EXISTS ppi_secoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    modelo_id UUID REFERENCES ppi_modelos(id) ON DELETE CASCADE,
    codigo VARCHAR(50) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    ordem INTEGER NOT NULL,
    obrigatorio BOOLEAN DEFAULT true,
    ativo BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(modelo_id, codigo)
);

-- Tabela de pontos de inspeção
CREATE TABLE IF NOT EXISTS ppi_pontos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    secao_id UUID REFERENCES ppi_secoes(id) ON DELETE CASCADE,
    codigo VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50) NULL, -- checkbox', radio,text',number,select,file, 'date'
    obrigatorio BOOLEAN DEFAULT true,
    ordem INTEGER NOT NULL,
    opcoes JSONB, -- Para campos select/radio
    validacao JSONB, -- Regras de validação
    dependencias JSONB, -- Pontos que devem ser preenchidos primeiro
    ativo BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(secao_id, codigo)
);

-- Tabela de instâncias PPI (checklists baseados em modelos)
CREATE TABLE IF NOT EXISTS ppi_instancias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    modelo_id UUID REFERENCES ppi_modelos(id) ON DELETE SET NULL,
    obra_id UUID REFERENCES obras(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status VARCHAR(50) DEFAULT 'rascunho', -- 'rascunho,em_andamento', 'concluido, aprovado, provado'
    prioridade VARCHAR(20) DEFAULT 'normal', -- baixa,normal', alta', urgente'
    data_planeada DATE,
    data_inicio TIMESTAMP WITH TIME ZONE,
    data_conclusao TIMESTAMP WITH TIME ZONE,
    responsavel VARCHAR(255),
    zona VARCHAR(255),
    observacoes TEXT,
    metadata JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de respostas dos pontos
CREATE TABLE IF NOT EXISTS ppi_respostas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4,
    instancia_id UUID REFERENCES ppi_instancias(id) ON DELETE CASCADE,
    ponto_id UUID REFERENCES ppi_pontos(id) ON DELETE CASCADE,
    valor TEXT,
    valor_numerico DECIMAL(10),
    valor_booleano BOOLEAN,
    valor_data DATE,
    valor_json JSONB,
    arquivos TEXT[], -- URLs dos arquivos
    observacoes TEXT,
    conforme BOOLEAN,
    responsavel VARCHAR(255),
    data_resposta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(instancia_id, ponto_id)
);

-- Tabela de histórico de alterações
CREATE TABLE IF NOT EXISTS ppi_historico (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4,
    instancia_id UUID REFERENCES ppi_instancias(id) ON DELETE CASCADE,
    acao VARCHAR(50) NOT NULL, -- 'criado, ualizado', status_alterado',resposta_adicionada'
    tabela_afetada VARCHAR(50), --instancia, resposta', 'secao'
    registro_id UUID,
    dados_anteriores JSONB,
    dados_novos JSONB,
    usuario_id UUID REFERENCES auth.users(id),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_ppi_modelos_user_id ON ppi_modelos(user_id);
CREATE INDEX IF NOT EXISTS idx_ppi_modelos_categoria ON ppi_modelos(categoria);
CREATE INDEX IF NOT EXISTS idx_ppi_modelos_ativo ON ppi_modelos(ativo);

CREATE INDEX IF NOT EXISTS idx_ppi_secoes_modelo_id ON ppi_secoes(modelo_id);
CREATE INDEX IF NOT EXISTS idx_ppi_secoes_ordem ON ppi_secoes(ordem);

CREATE INDEX IF NOT EXISTS idx_ppi_pontos_secao_id ON ppi_pontos(secao_id);
CREATE INDEX IF NOT EXISTS idx_ppi_pontos_ordem ON ppi_pontos(ordem);
CREATE INDEX IF NOT EXISTS idx_ppi_pontos_tipo ON ppi_pontos(tipo);

CREATE INDEX IF NOT EXISTS idx_ppi_instancias_user_id ON ppi_instancias(user_id);
CREATE INDEX IF NOT EXISTS idx_ppi_instancias_obra_id ON ppi_instancias(obra_id);
CREATE INDEX IF NOT EXISTS idx_ppi_instancias_modelo_id ON ppi_instancias(modelo_id);
CREATE INDEX IF NOT EXISTS idx_ppi_instancias_status ON ppi_instancias(status);
CREATE INDEX IF NOT EXISTS idx_ppi_instancias_data_planeada ON ppi_instancias(data_planeada);

CREATE INDEX IF NOT EXISTS idx_ppi_respostas_instancia_id ON ppi_respostas(instancia_id);
CREATE INDEX IF NOT EXISTS idx_ppi_respostas_ponto_id ON ppi_respostas(ponto_id);
CREATE INDEX IF NOT EXISTS idx_ppi_respostas_conforme ON ppi_respostas(conforme);

CREATE INDEX IF NOT EXISTS idx_ppi_historico_instancia_id ON ppi_historico(instancia_id);
CREATE INDEX IF NOT EXISTS idx_ppi_historico_acao ON ppi_historico(acao);
CREATE INDEX IF NOT EXISTS idx_ppi_historico_created_at ON ppi_historico(created_at);

-- =====================================================
-- 3FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_ppi_modelos_updated_at BEFORE UPDATE ON ppi_modelos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ppi_secoes_updated_at BEFORE UPDATE ON ppi_secoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ppi_pontos_updated_at BEFORE UPDATE ON ppi_pontos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ppi_instancias_updated_at BEFORE UPDATE ON ppi_instancias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ppi_respostas_updated_at BEFORE UPDATE ON ppi_respostas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para registrar histórico automaticamente
CREATE OR REPLACE FUNCTION registrar_historico_ppi()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO ppi_historico (instancia_id, acao, tabela_afetada, registro_id, dados_novos, usuario_id)
        VALUES (NEW.instancia_id, 'criado', TG_TABLE_NAME, NEW.id, to_jsonb(NEW), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO ppi_historico (instancia_id, acao, tabela_afetada, registro_id, dados_anteriores, dados_novos, usuario_id)
        VALUES (NEW.instancia_id, 'atualizado', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW), auth.uid());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Triggers para histórico
CREATE TRIGGER trigger_historico_instancias AFTER INSERT OR UPDATE ON ppi_instancias FOR EACH ROW EXECUTE FUNCTION registrar_historico_ppi();
CREATE TRIGGER trigger_historico_respostas AFTER INSERT OR UPDATE ON ppi_respostas FOR EACH ROW EXECUTE FUNCTION registrar_historico_ppi();

-- Função para gerar código único
CREATE OR REPLACE FUNCTION gerar_codigo_ppi(tipo VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    codigo VARCHAR;
    contador INTEGER;
BEGIN
    contador := 1;
    LOOP
        codigo := tipo || '-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(contador::TEXT, 4, '0');
        
        -- Verificar se já existe
        IF NOT EXISTS (SELECT 1 FROM ppi_instancias WHERE codigo = codigo) THEN
            RETURN codigo;
        END IF;
        
        contador := contador +1
    END LOOP;
END;
$$ language 'plpgsql';

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE ppi_modelos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppi_secoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppi_pontos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppi_instancias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppi_respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppi_historico ENABLE ROW LEVEL SECURITY;

-- Políticas para ppi_modelos
CREATE POLICY "Usuários podem ver seus próprios modelos" ON ppi_modelos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios modelos" ON ppi_modelos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios modelos" ON ppi_modelos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios modelos" ON ppi_modelos
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para ppi_secoes
CREATE POLICY "Usuários podem ver seções de seus modelos" ON ppi_secoes
    FOR SELECT USING (
        EXISTS (
            SELECT 1FROM ppi_modelos 
            WHERE ppi_modelos.id = ppi_secoes.modelo_id 
            AND ppi_modelos.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem criar seções em seus modelos" ON ppi_secoes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1FROM ppi_modelos 
            WHERE ppi_modelos.id = ppi_secoes.modelo_id 
            AND ppi_modelos.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem atualizar seções de seus modelos" ON ppi_secoes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1FROM ppi_modelos 
            WHERE ppi_modelos.id = ppi_secoes.modelo_id 
            AND ppi_modelos.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem deletar seções de seus modelos" ON ppi_secoes
    FOR DELETE USING (
        EXISTS (
            SELECT 1FROM ppi_modelos 
            WHERE ppi_modelos.id = ppi_secoes.modelo_id 
            AND ppi_modelos.user_id = auth.uid()
        )
    );

-- Políticas para ppi_pontos
CREATE POLICY "Usuários podem ver pontos de suas seções" ON ppi_pontos
    FOR SELECT USING (
        EXISTS (
            SELECT1 FROM ppi_secoes 
            JOIN ppi_modelos ON ppi_modelos.id = ppi_secoes.modelo_id
            WHERE ppi_secoes.id = ppi_pontos.secao_id 
            AND ppi_modelos.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem criar pontos em suas seções" ON ppi_pontos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT1 FROM ppi_secoes 
            JOIN ppi_modelos ON ppi_modelos.id = ppi_secoes.modelo_id
            WHERE ppi_secoes.id = ppi_pontos.secao_id 
            AND ppi_modelos.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem atualizar pontos de suas seções" ON ppi_pontos
    FOR UPDATE USING (
        EXISTS (
            SELECT1 FROM ppi_secoes 
            JOIN ppi_modelos ON ppi_modelos.id = ppi_secoes.modelo_id
            WHERE ppi_secoes.id = ppi_pontos.secao_id 
            AND ppi_modelos.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem deletar pontos de suas seções" ON ppi_pontos
    FOR DELETE USING (
        EXISTS (
            SELECT1 FROM ppi_secoes 
            JOIN ppi_modelos ON ppi_modelos.id = ppi_secoes.modelo_id
            WHERE ppi_secoes.id = ppi_pontos.secao_id 
            AND ppi_modelos.user_id = auth.uid()
        )
    );

-- Políticas para ppi_instancias
CREATE POLICY "Usuários podem ver suas próprias instâncias" ON ppi_instancias
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias instâncias" ON ppi_instancias
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias instâncias" ON ppi_instancias
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias instâncias" ON ppi_instancias
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para ppi_respostas
CREATE POLICY "Usuários podem ver respostas de suas instâncias" ON ppi_respostas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM ppi_instancias 
            WHERE ppi_instancias.id = ppi_respostas.instancia_id 
            AND ppi_instancias.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem criar respostas em suas instâncias" ON ppi_respostas
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM ppi_instancias 
            WHERE ppi_instancias.id = ppi_respostas.instancia_id 
            AND ppi_instancias.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem atualizar respostas de suas instâncias" ON ppi_respostas
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM ppi_instancias 
            WHERE ppi_instancias.id = ppi_respostas.instancia_id 
            AND ppi_instancias.user_id = auth.uid()
        )
    );

CREATE POLICY "Usuários podem deletar respostas de suas instâncias" ON ppi_respostas
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM ppi_instancias 
            WHERE ppi_instancias.id = ppi_respostas.instancia_id 
            AND ppi_instancias.user_id = auth.uid()
        )
    );

-- Políticas para ppi_historico
CREATE POLICY "Usuários podem ver histórico de suas instâncias" ON ppi_historico
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM ppi_instancias 
            WHERE ppi_instancias.id = ppi_historico.instancia_id 
            AND ppi_instancias.user_id = auth.uid()
        )
    );

-- =====================================================
--5. VIEWS ÚTEIS
-- =====================================================

-- View para estatísticas PPI
CREATE OR REPLACE VIEW ppi_estatisticas AS
SELECT 
    i.user_id,
    COUNT(*) as total_instancias,
    COUNT(CASE WHEN i.status = 'concluido' THEN 1 END) as instancias_concluidas,
    COUNT(CASE WHEN i.status = 'em_andamento' THEN 1 END) as instancias_em_andamento,
    COUNT(CASE WHEN i.status = 'rascunho' THEN 1 END) as instancias_rascunho,
    AVG(CASE WHEN i.data_conclusao IS NOT NULL THEN 
        EXTRACT(EPOCH FROM (i.data_conclusao - i.data_inicio))/86400
    END) as tempo_medio_dias
FROM ppi_instancias i
GROUP BY i.user_id;

-- View para progresso de instâncias
CREATE OR REPLACE VIEW ppi_progresso AS
SELECT 
    i.id as instancia_id,
    i.codigo,
    i.titulo,
    i.status,
    COUNT(p.id) as total_pontos,
    COUNT(r.id) as pontos_respondidos,
    ROUND(
        (COUNT(r.id)::DECIMAL / NULLIF(COUNT(p.id), 0) * 100, 2) as percentual_concluido,
    COUNT(CASE WHEN r.conforme = true THEN 1 END) as pontos_conformes,
    COUNT(CASE WHEN r.conforme = false THEN1 END) as pontos_nao_conformes
FROM ppi_instancias i
LEFT JOIN ppi_secoes s ON s.modelo_id = i.modelo_id
LEFT JOIN ppi_pontos p ON p.secao_id = s.id
LEFT JOIN ppi_respostas r ON r.instancia_id = i.id AND r.ponto_id = p.id
GROUP BY i.id, i.codigo, i.titulo, i.status;

-- =====================================================
--6. DADOS INICIAIS (MODELOS PADRÃO)
-- =====================================================

-- Inserir modelos padrão (apenas para demonstração)
-- Estes serão criados quando o usuário fizer login pela primeira vez

-- =====================================================
--7. FUNÇÕES DE API ÚTEIS
-- =====================================================

-- Função para duplicar um modelo
CREATE OR REPLACE FUNCTION duplicar_modelo_ppi(modelo_original_id UUID, novo_nome VARCHAR)
RETURNS UUID AS $$
DECLARE
    novo_modelo_id UUID;
    secao_record RECORD;
    ponto_record RECORD;
BEGIN
    -- Criar novo modelo
    INSERT INTO ppi_modelos (codigo, nome, descricao, categoria, versao, tags, metadata, user_id)
    SELECT 
        codigo || '_copy',
        novo_nome,
        descricao,
        categoria,
        versao,
        tags,
        metadata,
        auth.uid()
    FROM ppi_modelos 
    WHERE id = modelo_original_id
    RETURNING id INTO novo_modelo_id;
    
    -- Duplicar seções
    FOR secao_record IN 
        SELECT * FROM ppi_secoes WHERE modelo_id = modelo_original_id
    LOOP
        INSERT INTO ppi_secoes (modelo_id, codigo, nome, descricao, ordem, obrigatorio, ativo, metadata)
        VALUES (novo_modelo_id, secao_record.codigo, secao_record.nome, secao_record.descricao, 
                secao_record.ordem, secao_record.obrigatorio, secao_record.ativo, secao_record.metadata);
    END LOOP;
    
    -- Duplicar pontos
    FOR ponto_record IN 
        SELECT p.*, s.codigo as secao_codigo
        FROM ppi_pontos p
        JOIN ppi_secoes s ON s.id = p.secao_id
        WHERE s.modelo_id = modelo_original_id
    LOOP
        INSERT INTO ppi_pontos (secao_id, codigo, titulo, descricao, tipo, obrigatorio, ordem, 
                               opcoes, validacao, dependencias, ativo, metadata)
        SELECT 
            ns.id,
            ponto_record.codigo,
            ponto_record.titulo,
            ponto_record.descricao,
            ponto_record.tipo,
            ponto_record.obrigatorio,
            ponto_record.ordem,
            ponto_record.opcoes,
            ponto_record.validacao,
            ponto_record.dependencias,
            ponto_record.ativo,
            ponto_record.metadata
        FROM ppi_secoes ns
        WHERE ns.modelo_id = novo_modelo_id AND ns.codigo = ponto_record.secao_codigo;
    END LOOP;
    
    RETURN novo_modelo_id;
END;
$$ language plpgsql;

--Função para exportar modelo completo
CREATE OR REPLACE FUNCTION exportar_modelo_ppi(modelo_id UUID)
RETURNS JSONB AS $$
DECLARE
    resultado JSONB;
BEGIN
    SELECT jsonb_build_object(
        'modelo', to_jsonb(m.*),
        'secoes', (
            SELECT jsonb_agg(
                jsonb_build_object(
                   'secao', to_jsonb(s.*),            
                   'pontos', (
                        SELECT jsonb_agg(to_jsonb(p.*))
                        FROM ppi_pontos p
                        WHERE p.secao_id = s.id
                        ORDER BY p.ordem
                    )
                )
            )
            FROM ppi_secoes s
            WHERE s.modelo_id = m.id
            ORDER BY s.ordem
        )
    )
    INTO resultado
    FROM ppi_modelos m
    WHERE m.id = modelo_id AND m.user_id = auth.uid();
    
    RETURN resultado;
END;
$$ language 'plpgsql';

-- =====================================================
-- 8. COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE ppi_modelos IS 'Modelos/templates de PPI reutilizáveis';
COMMENT ON TABLE ppi_secoes IS 'Seções organizacionais dos modelos PPI';
COMMENT ON TABLE ppi_pontos IS 'Pontos individuais de inspeção/ensaio';
COMMENT ON TABLE ppi_instancias IS 'Instâncias de checklist baseadas em modelos';
COMMENT ON TABLE ppi_respostas IS 'Respostas dos usuários aos pontos de inspeção';
COMMENT ON TABLE ppi_historico IS 'Histórico completo de alterações para auditoria';
COMMENT ON COLUMN ppi_modelos.categoria IS 'CCG=Controlo de Gestão, CCE=Controlo de Execução, CCM=Controlo de Materiais';
COMMENT ON COLUMN ppi_pontos.tipo IS 'Tipo de campo: checkbox, radio, text, number, select, file, date';
COMMENT ON COLUMN ppi_instancias.status IS 'Status do checklist: rascunho, em_andamento, concluido, aprovado, reprovado';

-- =====================================================
-- FIM DO SCRIPT
-- ===================================================== 