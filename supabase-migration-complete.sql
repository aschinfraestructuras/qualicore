-- =====================================================
-- MIGRAÇÃO COMPLETA PARA SUPABASE - QUALICORE
-- =====================================================
-- Execute estes scripts no SQL Editor do Supabase
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABELA OBRAS (PROJETOS)
-- =====================================================

CREATE TABLE public.obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  cliente TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim_prevista DATE NOT NULL,
  data_fim_real DATE,
  valor_contrato DECIMAL(15,2) NOT NULL DEFAULT 0,
  valor_executado DECIMAL(15,2) NOT NULL DEFAULT 0,
  percentual_execucao DECIMAL(5,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'planeamento' CHECK (status IN ('planeamento', 'em_execucao', 'paralisada', 'concluida', 'cancelada')),
  tipo_obra TEXT NOT NULL DEFAULT 'residencial' CHECK (tipo_obra IN ('residencial', 'comercial', 'industrial', 'infraestrutura', 'reabilitacao', 'outro')),
  categoria TEXT NOT NULL DEFAULT 'media' CHECK (categoria IN ('pequena', 'media', 'grande', 'mega')),
  responsavel_tecnico TEXT NOT NULL,
  coordenador_obra TEXT NOT NULL,
  fiscal_obra TEXT NOT NULL,
  engenheiro_responsavel TEXT NOT NULL,
  arquiteto TEXT NOT NULL,
  fornecedores_principais TEXT[] DEFAULT '{}',
  observacoes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_obras_user_id ON public.obras(user_id);
CREATE INDEX idx_obras_status ON public.obras(status);
CREATE INDEX idx_obras_codigo ON public.obras(codigo);
CREATE INDEX idx_obras_cliente ON public.obras(cliente);

-- Permissões RLS para obras
ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Obras: usuário pode ver suas próprias obras" ON public.obras
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Obras: usuário pode criar suas próprias obras" ON public.obras
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Obras: usuário pode editar suas próprias obras" ON public.obras
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Obras: usuário pode deletar suas próprias obras" ON public.obras
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 2. TABELA FORNECEDORES
-- =====================================================

CREATE TABLE public.fornecedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  nif TEXT NOT NULL UNIQUE,
  morada TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  contacto TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'ativo' CHECK (estado IN ('ativo', 'inativo')),
  website TEXT,
  certificacoes TEXT,
  produtos_servicos TEXT,
  observacoes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_fornecedores_user_id ON public.fornecedores(user_id);
CREATE INDEX idx_fornecedores_nif ON public.fornecedores(nif);
CREATE INDEX idx_fornecedores_nome ON public.fornecedores(nome);
CREATE INDEX idx_fornecedores_estado ON public.fornecedores(estado);

ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fornecedores: usuário pode ver seus fornecedores" ON public.fornecedores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Fornecedores: usuário pode criar seus fornecedores" ON public.fornecedores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Fornecedores: usuário pode editar seus fornecedores" ON public.fornecedores
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Fornecedores: usuário pode deletar seus fornecedores" ON public.fornecedores
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 3. TABELA MATERIAIS
-- =====================================================

CREATE TABLE public.materiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('betao', 'aco', 'agregado', 'cimento', 'outro')),
  fornecedor_id UUID REFERENCES public.fornecedores(id) ON DELETE SET NULL,
  certificado_id TEXT,
  data_rececao DATE NOT NULL,
  quantidade DECIMAL(10,2) NOT NULL,
  unidade TEXT NOT NULL,
  lote TEXT NOT NULL,
  responsavel TEXT NOT NULL,
  zona TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendente' CHECK (estado IN ('pendente', 'em_analise', 'aprovado', 'reprovado', 'concluido')),
  observacoes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_materiais_user_id ON public.materiais(user_id);
CREATE INDEX idx_materiais_fornecedor_id ON public.materiais(fornecedor_id);
CREATE INDEX idx_materiais_codigo ON public.materiais(codigo);
CREATE INDEX idx_materiais_tipo ON public.materiais(tipo);
CREATE INDEX idx_materiais_estado ON public.materiais(estado);

ALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Materiais: usuário pode ver seus materiais" ON public.materiais
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Materiais: usuário pode criar seus materiais" ON public.materiais
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Materiais: usuário pode editar seus materiais" ON public.materiais
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Materiais: usuário pode deletar seus materiais" ON public.materiais
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 4. TABELA ENSAIOS
-- =====================================================

CREATE TABLE public.ensaios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL,
  material_id UUID REFERENCES public.materiais(id) ON DELETE SET NULL,
  resultado TEXT NOT NULL,
  valor_obtido DECIMAL(10,2) NOT NULL,
  valor_esperado DECIMAL(10,2) NOT NULL,
  unidade TEXT NOT NULL,
  laboratorio TEXT NOT NULL,
  data_ensaio DATE NOT NULL,
  conforme BOOLEAN NOT NULL DEFAULT false,
  responsavel TEXT NOT NULL,
  zona TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendente' CHECK (estado IN ('pendente', 'em_analise', 'aprovado', 'reprovado', 'concluido')),
  observacoes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ensaios_user_id ON public.ensaios(user_id);
CREATE INDEX idx_ensaios_material_id ON public.ensaios(material_id);
CREATE INDEX idx_ensaios_codigo ON public.ensaios(codigo);
CREATE INDEX idx_ensaios_tipo ON public.ensaios(tipo);
CREATE INDEX idx_ensaios_conforme ON public.ensaios(conforme);
CREATE INDEX idx_ensaios_estado ON public.ensaios(estado);

ALTER TABLE public.ensaios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ensaios: usuário pode ver seus ensaios" ON public.ensaios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Ensaios: usuário pode criar seus ensaios" ON public.ensaios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Ensaios: usuário pode editar seus ensaios" ON public.ensaios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Ensaios: usuário pode deletar seus ensaios" ON public.ensaios
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 5. TABELA CHECKLISTS
-- =====================================================

CREATE TABLE public.checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  obra_id UUID REFERENCES public.obras(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'concluido', 'aprovado', 'reprovado')),
  responsavel TEXT NOT NULL,
  zona TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendente' CHECK (estado IN ('pendente', 'em_analise', 'aprovado', 'reprovado', 'concluido')),
  observacoes TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_checklists_user_id ON public.checklists(user_id);
CREATE INDEX idx_checklists_obra_id ON public.checklists(obra_id);
CREATE INDEX idx_checklists_codigo ON public.checklists(codigo);
CREATE INDEX idx_checklists_status ON public.checklists(status);
CREATE INDEX idx_checklists_estado ON public.checklists(estado);

ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Checklists: usuário pode ver seus checklists" ON public.checklists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Checklists: usuário pode criar seus checklists" ON public.checklists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Checklists: usuário pode editar seus checklists" ON public.checklists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Checklists: usuário pode deletar seus checklists" ON public.checklists
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 6. TABELA DOCUMENTOS
-- =====================================================

CREATE TABLE public.documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL CHECK (tipo IN ('projeto', 'especificacao', 'relatorio', 'certificado', 'rfi', 'procedimento', 'plano_ensaio', 'plano_qualidade', 'manual', 'instrucao_trabalho', 'formulario', 'registro', 'outro')),
  tipo_outro TEXT,
  versao TEXT NOT NULL,
  data_validade DATE,
  data_aprovacao DATE,
  data_revisao DATE,
  responsavel TEXT NOT NULL,
  zona TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendente' CHECK (estado IN ('pendente', 'em_analise', 'aprovado', 'reprovado', 'concluido')),
  aprovador TEXT,
  revisor TEXT,
  categoria TEXT CHECK (categoria IN ('tecnico', 'administrativo', 'seguranca', 'ambiente', 'qualidade', 'comercial', 'outro')),
  categoria_outro TEXT,
  observacoes TEXT,
  palavras_chave TEXT[] DEFAULT '{}',
  classificacao_confidencialidade TEXT CHECK (classificacao_confidencialidade IN ('publico', 'interno', 'confidencial', 'restrito')),
  distribuicao TEXT[] DEFAULT '{}',
  
  -- Campos específicos RFI
  numero_rfi TEXT,
  solicitante TEXT,
  data_solicitacao DATE,
  data_resposta DATE,
  prioridade TEXT CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  impacto_custo DECIMAL(15,2),
  impacto_prazo INTEGER,
  resposta TEXT,
  
  -- Campos específicos Procedimento
  escopo TEXT,
  responsabilidades TEXT[] DEFAULT '{}',
  recursos_necessarios TEXT[] DEFAULT '{}',
  criterios_aceitacao TEXT[] DEFAULT '{}',
  registros_obrigatorios TEXT[] DEFAULT '{}',
  frequencia_revisao TEXT,
  
  -- Campos específicos Plano de Ensaio
  material_ensaio TEXT,
  tipo_ensaio TEXT,
  normas_referencia TEXT[] DEFAULT '{}',
  equipamentos_necessarios TEXT[] DEFAULT '{}',
  laboratorio_responsavel TEXT,
  frequencia_ensaios TEXT,
  acoes_nao_conformidade TEXT[] DEFAULT '{}',
  
  -- Campos específicos Plano de Qualidade
  escopo_obra TEXT,
  objetivos_qualidade TEXT[] DEFAULT '{}',
  responsabilidades_qualidade TEXT[] DEFAULT '{}',
  recursos_qualidade TEXT[] DEFAULT '{}',
  controlos_qualidade TEXT[] DEFAULT '{}',
  indicadores_qualidade TEXT[] DEFAULT '{}',
  auditorias_planeadas TEXT[] DEFAULT '{}',
  acoes_melhoria TEXT[] DEFAULT '{}',
  
  -- Relacionamentos
  relacionado_obra_id UUID REFERENCES public.obras(id) ON DELETE SET NULL,
  relacionado_obra_outro TEXT,
  relacionado_zona_id UUID,
  relacionado_zona_outro TEXT,
  relacionado_ensaio_id UUID REFERENCES public.ensaios(id) ON DELETE SET NULL,
  relacionado_ensaio_outro TEXT,
  relacionado_material_id UUID REFERENCES public.materiais(id) ON DELETE SET NULL,
  relacionado_material_outro TEXT,
  relacionado_fornecedor_id UUID REFERENCES public.fornecedores(id) ON DELETE SET NULL,
  relacionado_fornecedor_outro TEXT,
  relacionado_checklist_id UUID REFERENCES public.checklists(id) ON DELETE SET NULL,
  relacionado_checklist_outro TEXT,
  
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documentos_user_id ON public.documentos(user_id);
CREATE INDEX idx_documentos_codigo ON public.documentos(codigo);
CREATE INDEX idx_documentos_tipo ON public.documentos(tipo);
CREATE INDEX idx_documentos_estado ON public.documentos(estado);
CREATE INDEX idx_documentos_responsavel ON public.documentos(responsavel);

ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Documentos: usuário pode ver seus documentos" ON public.documentos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Documentos: usuário pode criar seus documentos" ON public.documentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Documentos: usuário pode editar seus documentos" ON public.documentos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Documentos: usuário pode deletar seus documentos" ON public.documentos
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 7. TABELA NÃO CONFORMIDADES
-- =====================================================

CREATE TABLE public.nao_conformidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL CHECK (tipo IN ('material', 'execucao', 'documentacao', 'seguranca', 'ambiente', 'qualidade', 'prazo', 'custo', 'outro')),
  tipo_outro TEXT,
  severidade TEXT NOT NULL CHECK (severidade IN ('baixa', 'media', 'alta', 'critica')),
  categoria TEXT NOT NULL CHECK (categoria IN ('auditoria', 'inspecao', 'reclamacao', 'acidente', 'incidente', 'desvio', 'outro')),
  categoria_outro TEXT,
  data_deteccao DATE NOT NULL,
  data_resolucao DATE,
  data_limite_resolucao DATE,
  data_verificacao_eficacia DATE,
  descricao TEXT NOT NULL,
  causa_raiz TEXT,
  impacto TEXT NOT NULL CHECK (impacto IN ('baixo', 'medio', 'alto', 'critico')),
  area_afetada TEXT NOT NULL,
  responsavel_deteccao TEXT NOT NULL,
  responsavel_resolucao TEXT,
  responsavel_verificacao TEXT,
  acao_corretiva TEXT,
  acao_preventiva TEXT,
  medidas_implementadas TEXT[] DEFAULT '{}',
  custo_estimado DECIMAL(15,2),
  custo_real DECIMAL(15,2),
  custo_preventivo DECIMAL(15,2),
  observacoes TEXT,
  
  -- Relacionamentos
  relacionado_ensaio_id UUID REFERENCES public.ensaios(id) ON DELETE SET NULL,
  relacionado_ensaio_outro TEXT,
  relacionado_material_id UUID REFERENCES public.materiais(id) ON DELETE SET NULL,
  relacionado_material_outro TEXT,
  relacionado_checklist_id UUID REFERENCES public.checklists(id) ON DELETE SET NULL,
  relacionado_checklist_outro TEXT,
  relacionado_documento_id UUID REFERENCES public.documentos(id) ON DELETE SET NULL,
  relacionado_fornecedor_id UUID REFERENCES public.fornecedores(id) ON DELETE SET NULL,
  relacionado_fornecedor_outro TEXT,
  relacionado_obra_id UUID REFERENCES public.obras(id) ON DELETE SET NULL,
  relacionado_obra_outro TEXT,
  relacionado_zona_id UUID,
  relacionado_zona_outro TEXT,
  auditoria_id UUID,
  auditoria_outro TEXT,
  
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nao_conformidades_user_id ON public.nao_conformidades(user_id);
CREATE INDEX idx_nao_conformidades_codigo ON public.nao_conformidades(codigo);
CREATE INDEX idx_nao_conformidades_tipo ON public.nao_conformidades(tipo);
CREATE INDEX idx_nao_conformidades_severidade ON public.nao_conformidades(severidade);
CREATE INDEX idx_nao_conformidades_data_deteccao ON public.nao_conformidades(data_deteccao);

ALTER TABLE public.nao_conformidades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Não Conformidades: usuário pode ver suas NCs" ON public.nao_conformidades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Não Conformidades: usuário pode criar suas NCs" ON public.nao_conformidades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Não Conformidades: usuário pode editar suas NCs" ON public.nao_conformidades
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Não Conformidades: usuário pode deletar suas NCs" ON public.nao_conformidades
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 8. TABELA RFIS (REQUEST FOR INFORMATION)
-- =====================================================

CREATE TABLE public.rfis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  numero TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  solicitante TEXT NOT NULL,
  destinatario TEXT NOT NULL,
  data_solicitacao DATE NOT NULL,
  data_resposta DATE,
  prioridade TEXT NOT NULL CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'respondido', 'fechado')),
  resposta TEXT,
  impacto_custo DECIMAL(15,2),
  impacto_prazo INTEGER,
  observacoes TEXT,
  
  -- Relacionamentos
  relacionado_obra_id UUID REFERENCES public.obras(id) ON DELETE SET NULL,
  relacionado_zona_id UUID,
  relacionado_documento_id UUID REFERENCES public.documentos(id) ON DELETE SET NULL,
  relacionado_ensaio_id UUID REFERENCES public.ensaios(id) ON DELETE SET NULL,
  relacionado_material_id UUID REFERENCES public.materiais(id) ON DELETE SET NULL,
  
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rfis_user_id ON public.rfis(user_id);
CREATE INDEX idx_rfis_codigo ON public.rfis(codigo);
CREATE INDEX idx_rfis_numero ON public.rfis(numero);
CREATE INDEX idx_rfis_status ON public.rfis(status);
CREATE INDEX idx_rfis_prioridade ON public.rfis(prioridade);

ALTER TABLE public.rfis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RFIs: usuário pode ver seus RFIs" ON public.rfis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "RFIs: usuário pode criar seus RFIs" ON public.rfis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "RFIs: usuário pode editar seus RFIs" ON public.rfis
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "RFIs: usuário pode deletar seus RFIs" ON public.rfis
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 9. TABELA ZONAS (para gestão de zonas das obras)
-- =====================================================

CREATE TABLE public.zonas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  area DECIMAL(10,2),
  unidade_area TEXT DEFAULT 'm2',
  percentual_execucao DECIMAL(5,2) DEFAULT 0,
  data_inicio DATE,
  data_fim_prevista DATE,
  data_fim_real DATE,
  status TEXT DEFAULT 'nao_iniciada' CHECK (status IN ('nao_iniciada', 'em_execucao', 'concluida', 'paralisada')),
  responsavel TEXT,
  obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_zonas_user_id ON public.zonas(user_id);
CREATE INDEX idx_zonas_obra_id ON public.zonas(obra_id);
CREATE INDEX idx_zonas_status ON public.zonas(status);

ALTER TABLE public.zonas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Zonas: usuário pode ver suas zonas" ON public.zonas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Zonas: usuário pode criar suas zonas" ON public.zonas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Zonas: usuário pode editar suas zonas" ON public.zonas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Zonas: usuário pode deletar suas zonas" ON public.zonas
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- FUNÇÕES DE ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Função para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualização automática
CREATE TRIGGER update_obras_updated_at BEFORE UPDATE ON public.obras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fornecedores_updated_at BEFORE UPDATE ON public.fornecedores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materiais_updated_at BEFORE UPDATE ON public.materiais FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ensaios_updated_at BEFORE UPDATE ON public.ensaios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_checklists_updated_at BEFORE UPDATE ON public.checklists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documentos_updated_at BEFORE UPDATE ON public.documentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nao_conformidades_updated_at BEFORE UPDATE ON public.nao_conformidades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rfis_updated_at BEFORE UPDATE ON public.rfis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_zonas_updated_at BEFORE UPDATE ON public.zonas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÕES ÚTEIS PARA O SISTEMA
-- =====================================================

-- Função para gerar códigos únicos
CREATE OR REPLACE FUNCTION generate_unique_code(table_name TEXT, prefix TEXT)
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  counter INTEGER := 1;
BEGIN
  LOOP
    new_code := prefix || '-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
    
    -- Verificar se o código já existe
    EXECUTE format('SELECT COUNT(*) FROM %I WHERE codigo = $1', table_name) INTO counter;
    
    IF counter = 0 THEN
      RETURN new_code;
    END IF;
    
    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS ÚTEIS PARA RELATÓRIOS
-- =====================================================

-- View para estatísticas gerais
CREATE VIEW estatisticas_gerais AS
SELECT 
  (SELECT COUNT(*) FROM obras WHERE user_id = auth.uid()) as total_obras,
  (SELECT COUNT(*) FROM fornecedores WHERE user_id = auth.uid()) as total_fornecedores,
  (SELECT COUNT(*) FROM materiais WHERE user_id = auth.uid()) as total_materiais,
  (SELECT COUNT(*) FROM ensaios WHERE user_id = auth.uid()) as total_ensaios,
  (SELECT COUNT(*) FROM checklists WHERE user_id = auth.uid()) as total_checklists,
  (SELECT COUNT(*) FROM documentos WHERE user_id = auth.uid()) as total_documentos,
  (SELECT COUNT(*) FROM nao_conformidades WHERE user_id = auth.uid()) as total_nao_conformidades,
  (SELECT COUNT(*) FROM rfis WHERE user_id = auth.uid()) as total_rfis;

-- View para ensaios não conformes
CREATE VIEW ensaios_nao_conformes AS
SELECT 
  e.*,
  m.nome as material_nome,
  m.codigo as material_codigo
FROM ensaios e
LEFT JOIN materiais m ON e.material_id = m.id
WHERE e.conforme = false AND e.user_id = auth.uid();

-- View para não conformidades por severidade
CREATE VIEW nc_por_severidade AS
SELECT 
  severidade,
  COUNT(*) as total,
  COUNT(CASE WHEN data_resolucao IS NOT NULL THEN 1 END) as resolvidas,
  COUNT(CASE WHEN data_resolucao IS NULL THEN 1 END) as pendentes
FROM nao_conformidades 
WHERE user_id = auth.uid()
GROUP BY severidade;

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE public.obras IS 'Tabela principal para gestão de obras/projetos';
COMMENT ON TABLE public.fornecedores IS 'Cadastro de fornecedores e prestadores de serviços';
COMMENT ON TABLE public.materiais IS 'Gestão de materiais de construção e stocks';
COMMENT ON TABLE public.ensaios IS 'Ensaios laboratoriais e testes de qualidade';
COMMENT ON TABLE public.checklists IS 'Checklists de inspeção e verificação';
COMMENT ON TABLE public.documentos IS 'Gestão documental do sistema';
COMMENT ON TABLE public.nao_conformidades IS 'Registro de não conformidades e ações corretivas';
COMMENT ON TABLE public.rfis IS 'Requests for Information - Pedidos de esclarecimento';
COMMENT ON TABLE public.zonas IS 'Zonas específicas dentro das obras';

-- =====================================================
-- FIM DO SCRIPT
-- ===================================================== 