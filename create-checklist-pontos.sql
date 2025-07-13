-- Criar tabela para pontos de inspeção de checklists
CREATE TABLE IF NOT EXISTS checklist_pontos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    checklist_id UUID NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    tipo TEXT,
    localizacao TEXT,
    responsavel TEXT,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'reprovado', 'correcao')),
    data_inspecao TIMESTAMP WITH TIME ZONE,
    observacoes TEXT,
    anexos JSONB DEFAULT '[]',
    comentarios JSONB DEFAULT '[]',
    linha_tempo JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_checklist_pontos_checklist_id ON checklist_pontos(checklist_id);
CREATE INDEX IF NOT EXISTS idx_checklist_pontos_status ON checklist_pontos(status);

-- Habilitar RLS (Row Level Security)
ALTER TABLE checklist_pontos ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios pontos
CREATE POLICY "Users can view own checklist pontos" ON checklist_pontos
    FOR SELECT USING (
        checklist_id IN (
            SELECT id FROM checklists WHERE user_id = auth.uid()
        )
    );

-- Política para usuários inserirem seus próprios pontos
CREATE POLICY "Users can insert own checklist pontos" ON checklist_pontos
    FOR INSERT WITH CHECK (
        checklist_id IN (
            SELECT id FROM checklists WHERE user_id = auth.uid()
        )
    );

-- Política para usuários atualizarem seus próprios pontos
CREATE POLICY "Users can update own checklist pontos" ON checklist_pontos
    FOR UPDATE USING (
        checklist_id IN (
            SELECT id FROM checklists WHERE user_id = auth.uid()
        )
    );

-- Política para usuários deletarem seus próprios pontos
CREATE POLICY "Users can delete own checklist pontos" ON checklist_pontos
    FOR DELETE USING (
        checklist_id IN (
            SELECT id FROM checklists WHERE user_id = auth.uid()
        )
    );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_checklist_pontos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_checklist_pontos_updated_at
    BEFORE UPDATE ON checklist_pontos
    FOR EACH ROW
    EXECUTE FUNCTION update_checklist_pontos_updated_at(); 