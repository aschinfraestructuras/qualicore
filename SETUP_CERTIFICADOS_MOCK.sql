-- Script para adicionar dados mock à tabela certificados
-- Execute este script na Supabase SQL Editor

-- Desabilitar RLS temporariamente para inserção
ALTER TABLE certificados DISABLE ROW LEVEL SECURITY;

-- Inserir dados mock de certificados
INSERT INTO certificados (
  id,
  codigo,
  titulo,
  tipo,
  fornecedor,
  emissor,
  data_emissao,
  data_validade,
  status,
  classificacao_confidencialidade,
  descricao,
  observacoes,
  responsavel,
  documentos_anexos,
  created_at,
  updated_at
) VALUES 
-- Certificados de Materiais
(
  gen_random_uuid(),
  'CERT-MAT-2024-001',
  'Certificado de Qualidade - Aço Estrutural',
  'material',
  'Siderurgia Nacional SA',
  'Laboratório Nacional de Engenharia Civil',
  '2024-01-15',
  '2025-01-15',
  'valido',
  'publico',
  'Certificado de conformidade para aço estrutural classe S355',
  'Certificado válido para uso em estruturas ferroviárias',
  'Eng. Maria Santos',
  '[]',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'CERT-MAT-2024-002',
  'Certificado de Qualidade - Betão C35/45',
  'material',
  'Cimpor - Cimentos de Portugal',
  'Laboratório de Materiais de Construção',
  '2024-02-20',
  '2025-02-20',
  'valido',
  'publico',
  'Certificado de conformidade para betão classe C35/45',
  'Certificado válido para elementos estruturais',
  'Eng. João Silva',
  '[]',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'CERT-MAT-2024-003',
  'Certificado de Qualidade - Travessas Pré-fabricadas',
  'material',
  'Travessas Ferroviárias Lda',
  'Instituto Superior Técnico',
  '2024-03-10',
  '2025-03-10',
  'valido',
  'confidencial',
  'Certificado de conformidade para travessas pré-fabricadas',
  'Certificado válido para via férrea',
  'Eng. Pedro Costa',
  '[]',
  NOW(),
  NOW()
),

-- Certificados de Equipamentos
(
  gen_random_uuid(),
  'CERT-EQP-2024-001',
  'Certificado de Segurança - Grua Móvel',
  'equipamento',
  'Gruas Portugal SA',
  'Autoridade Nacional de Segurança Rodoviária',
  '2024-01-05',
  '2025-01-05',
  'valido',
  'publico',
  'Certificado de segurança para grua móvel 50 toneladas',
  'Equipamento aprovado para operações de elevação',
  'Téc. António Ferreira',
  '[]',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'CERT-EQP-2024-002',
  'Certificado de Calibração - Nível Laser',
  'equipamento',
  'Topografia Avançada Lda',
  'Instituto Português da Qualidade',
  '2024-02-15',
  '2024-08-15',
  'expirado',
  'interno',
  'Certificado de calibração para nível laser',
  'Equipamento precisa de nova calibração',
  'Top. Manuel Rodrigues',
  '[]',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'CERT-EQP-2024-003',
  'Certificado de Segurança - Betoneira',
  'equipamento',
  'Máquinas de Construção SA',
  'Autoridade para as Condições do Trabalho',
  '2024-03-01',
  '2025-03-01',
  'valido',
  'publico',
  'Certificado de segurança para betoneira 500L',
  'Equipamento aprovado para produção de betão',
  'Téc. Carlos Lima',
  '[]',
  NOW(),
  NOW()
),

-- Certificados de Serviços
(
  gen_random_uuid(),
  'CERT-SRV-2024-001',
  'Certificado de Qualidade - Ensaios Laboratoriais',
  'servico',
  'Laboratório de Ensaios Técnicos',
  'Instituto Português da Qualidade',
  '2024-01-10',
  '2026-01-10',
  'valido',
  'publico',
  'Certificado de qualidade para ensaios laboratoriais',
  'Laboratório acreditado para ensaios de materiais',
  'Dr. Ana Oliveira',
  '[]',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'CERT-SRV-2024-002',
  'Certificado de Competência - Soldadura',
  'servico',
  'Soldadura Profissional Lda',
  'Instituto de Soldadura e Qualidade',
  '2024-02-01',
  '2024-12-01',
  'pendente',
  'confidencial',
  'Certificado de competência para soldadura',
  'Aguardando renovação do certificado',
  'Sold. José Martins',
  '[]',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'CERT-SRV-2024-003',
  'Certificado de Qualidade - Topografia',
  'servico',
  'Topografia e Geodesia SA',
  'Direção-Geral do Território',
  '2024-03-20',
  '2025-03-20',
  'valido',
  'publico',
  'Certificado de qualidade para serviços de topografia',
  'Empresa acreditada para levantamentos topográficos',
  'Eng. Top. Francisco Santos',
  '[]',
  NOW(),
  NOW()
),

-- Certificados de Sistemas
(
  gen_random_uuid(),
  'CERT-SIS-2024-001',
  'Certificado ISO 9001 - Sistema de Gestão da Qualidade',
  'sistema',
  'ASCH Infraestructuras y Servicios SA',
  'Bureau Veritas',
  '2024-01-01',
  '2027-01-01',
  'valido',
  'publico',
  'Certificado ISO 9001 para sistema de gestão da qualidade',
  'Certificado válido para gestão de projetos ferroviários',
  'Eng. Diretor de Qualidade',
  '[]',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'CERT-SIS-2024-002',
  'Certificado ISO 14001 - Sistema de Gestão Ambiental',
  'sistema',
  'ASCH Infraestructuras y Servicios SA',
  'SGS Portugal',
  '2024-02-01',
  '2027-02-01',
  'valido',
  'publico',
  'Certificado ISO 14001 para sistema de gestão ambiental',
  'Certificado válido para gestão ambiental',
  'Eng. Diretor Ambiental',
  '[]',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'CERT-SIS-2024-003',
  'Certificado OHSAS 18001 - Sistema de Gestão de Segurança',
  'sistema',
  'ASCH Infraestructuras y Servicios SA',
  'TÜV Rheinland',
  '2024-03-01',
  '2027-03-01',
  'valido',
  'publico',
  'Certificado OHSAS 18001 para sistema de gestão de segurança',
  'Certificado válido para gestão de segurança e saúde',
  'Eng. Diretor de Segurança',
  '[]',
  NOW(),
  NOW()
);

-- Reabilitar RLS
ALTER TABLE certificados ENABLE ROW LEVEL SECURITY;

-- Verificar inserção
SELECT 
  codigo,
  titulo,
  tipo,
  fornecedor,
  status,
  data_validade,
  responsavel
FROM certificados 
ORDER BY created_at DESC;

-- Estatísticas dos certificados inseridos
SELECT 
  status,
  COUNT(*) as total,
  tipo,
  COUNT(*) as total_por_tipo
FROM certificados 
GROUP BY status, tipo
ORDER BY status, tipo;
