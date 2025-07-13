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
  obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
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
  auditoria_id TEXT,
  auditoria_outro TEXT,
  
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nao_conformidades_user_id ON public.nao_conformidades(user_id);
CREATE INDEX idx_nao_conformidades_codigo ON public.nao_conformidades(codigo);
CREATE INDEX idx_nao_conformidades_tipo ON public.nao_conformidades(tipo);
CREATE INDEX idx_nao_conformidades_severidade ON public.nao_conformidades(severidade);

ALTER TABLE public.nao_conformidades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "NC: usuário pode ver suas não conformidades" ON public.nao_conformidades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "NC: usuário pode criar suas não conformidades" ON public.nao_conformidades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "NC: usuário pode editar suas não conformidades" ON public.nao_conformidades
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "NC: usuário pode deletar suas não conformidades" ON public.nao_conformidades
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 8. TABELA RFIS
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
-- 9. FUNÇÕES DE ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_obras_updated_at BEFORE UPDATE ON public.obras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fornecedores_updated_at BEFORE UPDATE ON public.fornecedores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materiais_updated_at BEFORE UPDATE ON public.materiais FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ensaios_updated_at BEFORE UPDATE ON public.ensaios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_checklists_updated_at BEFORE UPDATE ON public.checklists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documentos_updated_at BEFORE UPDATE ON public.documentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nao_conformidades_updated_at BEFORE UPDATE ON public.nao_conformidades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rfis_updated_at BEFORE UPDATE ON public.rfis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. MENSAGEM DE SUCESSO
-- =====================================================

SELECT '🎉 Migração para Supabase concluída com sucesso!' as status; 