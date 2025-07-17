-- Migração completa para criar as tabelas obras e ensaios
-- Execute este script no SQL Editor do Supabase

-- =====================================================
-- 1. CRIAR TABELA OBRAS (se não existir)
-- =====================================================
CREATE TABLE IF NOT EXISTS obras (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    localizacao TEXT,
    cliente TEXT,
    data_inicio DATE,
    data_fim DATE,
    status TEXT DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'suspensa', 'cancelada')),
    descricao TEXT,
    valor_contrato DECIMAL(15,2),
    responsavel TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. CRIAR TABELA ENSAIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS ensaios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo TEXT NOT NULL,
    tipo TEXT NOT NULL,
    descricao TEXT,
    resultado TEXT,
    estado TEXT NOT NULL DEFAULT 'pendente' CHECK (estado IN ('pendente', 'em_analise', 'aprovado', 'reprovado', 'concluido')),
    conforme BOOLEAN DEFAULT false,
    laboratorio TEXT,
    data_ensaio DATE,
    data_resultado DATE,
    material_id UUID REFERENCES materiais(id) ON DELETE SET NULL,
    obra_id UUID REFERENCES obras(id) ON DELETE SET NULL,
    observacoes TEXT,
    anexos TEXT[],
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_obras_user_id ON obras(user_id);
CREATE INDEX IF NOT EXISTS idx_obras_status ON obras(status);
CREATE INDEX IF NOT EXISTS idx_ensaios_user_id ON ensaios(user_id);
CREATE INDEX IF NOT EXISTS idx_ensaios_obra_id ON ensaios(obra_id);
CREATE INDEX IF NOT EXISTS idx_ensaios_material_id ON ensaios(material_id);
CREATE INDEX IF NOT EXISTS idx_ensaios_estado ON ensaios(estado);
CREATE INDEX IF NOT EXISTS idx_ensaios_codigo ON ensaios(codigo);

-- =====================================================
-- 4. CRIAR TRIGGERS PARA ATUALIZAR TIMESTAMPS
-- =====================================================

-- Trigger para obras
CREATE OR REPLACE FUNCTION update_obras_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_obras_updated_at
    BEFORE UPDATE ON obras
    FOR EACH ROW
    EXECUTE FUNCTION update_obras_updated_at();

-- Trigger para ensaios
CREATE OR REPLACE FUNCTION update_ensaios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ensaios_updated_at
    BEFORE UPDATE ON ensaios
    FOR EACH ROW
    EXECUTE FUNCTION update_ensaios_updated_at();

-- =====================================================
-- 5. CONFIGURAR ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE ensaios ENABLE ROW LEVEL SECURITY;

-- Políticas para obras
CREATE POLICY "Usuários podem ver suas próprias obras" ON obras
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias obras" ON obras
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias obras" ON obras
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias obras" ON obras
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para ensaios
CREATE POLICY "Usuários podem ver seus próprios ensaios" ON ensaios
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios ensaios" ON ensaios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios ensaios" ON ensaios
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios ensaios" ON ensaios
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 6. INSERIR DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================

-- Inserir obra de exemplo
INSERT INTO obras (nome, localizacao, cliente, data_inicio, status, descricao, valor_contrato, responsavel)
VALUES (
    'Residencial Solar',
    'São Paulo, SP',
    'Construtora ABC',
    '2024-01-15',
    'ativa',
    'Complexo residencial com 200 apartamentos',
    15000000.00,
    'João Silva'
) ON CONFLICT DO NOTHING;

-- Inserir ensaio de exemplo
INSERT INTO ensaios (codigo, tipo, descricao, resultado, estado, conforme, laboratorio, data_ensaio, obra_id)
VALUES (
    'ENS-001',
    'Resistência à Compressão',
    'Ensaio de resistência à compressão do concreto',
    '35 MPa',
    'aprovado',
    true,
    'Laboratório Técnico',
    '2024-01-20',
    (SELECT id FROM obras WHERE nome = 'Residencial Solar' LIMIT 1)
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. MENSAGEM DE CONFIRMAÇÃO
-- =====================================================
SELECT 'Migração concluída com sucesso! Tabelas obras e ensaios criadas.' as status; 