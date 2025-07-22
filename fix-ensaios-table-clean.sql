SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'ensaios'
) as table_exists;

CREATE TABLE IF NOT EXISTS public.ensaios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    codigo TEXT NOT NULL,
    tipo TEXT NOT NULL,
    descricao TEXT,
    data_ensaio DATE NOT NULL,
    laboratorio TEXT NOT NULL,
    responsavel TEXT NOT NULL,
    valor_esperado DECIMAL(10,2),
    valor_obtido DECIMAL(10,2),
    unidade TEXT,
    conforme BOOLEAN DEFAULT false,
    estado TEXT DEFAULT 'pendente',
    zona TEXT,
    observacoes TEXT,
    material_id UUID REFERENCES public.materiais(id) ON DELETE SET NULL,
    resultado TEXT,
    documents JSONB DEFAULT '[]'::jsonb,
    seguimento JSONB DEFAULT '[]'::jsonb,
    contextoAdicional JSONB DEFAULT '[]'::jsonb
);

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ensaios' AND column_name = 'documents') THEN
        ALTER TABLE public.ensaios ADD COLUMN documents JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ensaios' AND column_name = 'seguimento') THEN
        ALTER TABLE public.ensaios ADD COLUMN seguimento JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ensaios' AND column_name = 'contextoAdicional') THEN
        ALTER TABLE public.ensaios ADD COLUMN "contextoAdicional" JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ensaios_user_id ON public.ensaios(user_id);
CREATE INDEX IF NOT EXISTS idx_ensaios_codigo ON public.ensaios(codigo);
CREATE INDEX IF NOT EXISTS idx_ensaios_tipo ON public.ensaios(tipo);
CREATE INDEX IF NOT EXISTS idx_ensaios_estado ON public.ensaios(estado);
CREATE INDEX IF NOT EXISTS idx_ensaios_data_ensaio ON public.ensaios(data_ensaio);
CREATE INDEX IF NOT EXISTS idx_ensaios_material_id ON public.ensaios(material_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_ensaios_updated_at ON public.ensaios;
CREATE TRIGGER update_ensaios_updated_at 
    BEFORE UPDATE ON public.ensaios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.ensaios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ensaios" ON public.ensaios;
CREATE POLICY "Users can view own ensaios" ON public.ensaios
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ensaios" ON public.ensaios;
CREATE POLICY "Users can insert own ensaios" ON public.ensaios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ensaios" ON public.ensaios;
CREATE POLICY "Users can update own ensaios" ON public.ensaios
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own ensaios" ON public.ensaios;
CREATE POLICY "Users can delete own ensaios" ON public.ensaios
    FOR DELETE USING (auth.uid() = user_id);

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'ensaios'
ORDER BY ordinal_position; 