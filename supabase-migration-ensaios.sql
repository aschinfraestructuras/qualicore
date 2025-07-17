-- Migração para criar a tabela de Ensaios
-- Execute este script no SQL Editor do Supabase

-- Criar a tabela ensaios
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

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_ensaios_user_id ON ensaios(user_id);
CREATE INDEX IF NOT EXISTS idx_ensaios_codigo ON ensaios(codigo);
CREATE INDEX IF NOT EXISTS idx_ensaios_tipo ON ensaios(tipo);
CREATE INDEX IF NOT EXISTS idx_ensaios_estado ON ensaios(estado);
CREATE INDEX IF NOT EXISTS idx_ensaios_conforme ON ensaios(conforme);
CREATE INDEX IF NOT EXISTS idx_ensaios_data_ensaio ON ensaios(data_ensaio);
CREATE INDEX IF NOT EXISTS idx_ensaios_material_id ON ensaios(material_id);
CREATE INDEX IF NOT EXISTS idx_ensaios_obra_id ON ensaios(obra_id);

-- Trigger para atualizar updated_at automaticamente
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

-- Habilitar Row Level Security (RLS)
ALTER TABLE ensaios ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver seus próprios ensaios" ON ensaios
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios ensaios" ON ensaios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios ensaios" ON ensaios
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios ensaios" ON ensaios
    FOR DELETE USING (auth.uid() = user_id);

-- Inserir dados de exemplo
INSERT INTO ensaios (codigo, tipo, descricao, resultado, estado, conforme, laboratorio, data_ensaio, data_resultado, observacoes) VALUES
('ENS-001', 'Compressão', 'Ensaio de compressão em concreto', '25 MPa', 'aprovado', true, 'Lab Central', '2024-01-15', '2024-01-20', 'Resultado dentro dos parâmetros especificados'),
('ENS-002', 'Tração', 'Ensaio de tração em aço', '450 MPa', 'aprovado', true, 'Lab Especializado', '2024-01-18', '2024-01-25', 'Material atende às especificações'),
('ENS-003', 'Flexão', 'Ensaio de flexão em viga', '4.2 kN', 'reprovado', false, 'Lab Central', '2024-01-20', '2024-01-22', 'Resultado abaixo do especificado'),
('ENS-004', 'Densidade', 'Ensaio de densidade do solo', '1.85 g/cm³', 'aprovado', true, 'Lab Geotécnico', '2024-01-25', '2024-01-28', 'Densidade adequada para o projeto'),
('ENS-005', 'Umidade', 'Ensaio de umidade do solo', '12.5%', 'pendente', false, 'Lab Geotécnico', '2024-01-30', NULL, 'Aguardando resultado');

-- Verificar se a tabela foi criada
SELECT 'Tabela ensaios criada com sucesso!' as status; 