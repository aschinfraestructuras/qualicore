# Executar SQL para Criar Tabela checklist_pontos

## Passos para executar o SQL:

1. **Aceder ao Supabase Dashboard**
   - Vá para https://supabase.com/dashboard
   - Selecione o seu projeto

2. **Abrir o SQL Editor**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Copiar e colar o SQL**
   - Abra o ficheiro `CREATE-CHECKLIST-PONTOS-TABLE.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase

4. **Executar o SQL**
   - Clique no botão "Run" (▶️)
   - Aguarde a execução

5. **Verificar se foi criado**
   - Vá para "Table Editor" no menu lateral
   - Deve ver a nova tabela `checklist_pontos`

## Conteúdo do SQL:

```sql
-- Criar tabela checklist_pontos
CREATE TABLE IF NOT EXISTS checklist_pontos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  checklist_id UUID NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  tipo TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  responsavel TEXT NOT NULL,
  status TEXT DEFAULT 'pendente',
  data_inspecao TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  anexos JSONB DEFAULT '[]',
  comentarios JSONB DEFAULT '[]',
  linha_tempo JSONB DEFAULT '[]',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_checklist_pontos_checklist_id ON checklist_pontos(checklist_id);
CREATE INDEX IF NOT EXISTS idx_checklist_pontos_user_id ON checklist_pontos(user_id);

-- Habilitar RLS
ALTER TABLE checklist_pontos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own checklist points" ON checklist_pontos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own checklist points" ON checklist_pontos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist points" ON checklist_pontos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checklist points" ON checklist_pontos
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_checklist_pontos_updated_at
  BEFORE UPDATE ON checklist_pontos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Após executar o SQL:

1. **Testar a aplicação**
   - Volte à aplicação React
   - Tente criar um novo checklist com pontos de inspeção
   - Os erros devem desaparecer

2. **Se ainda houver problemas**
   - Verifique se a tabela foi criada corretamente
   - Verifique se as políticas RLS foram aplicadas
   - Teste novamente a criação de checklists

## Problemas resolvidos:

✅ **Tabela checklist_pontos criada**
✅ **Campos inválidos filtrados em Não Conformidades**
✅ **Validação de datas vazias em checklists**
✅ **Import circular removido**
✅ **Campos obrigatórios validados**
