-- Test script para verificar o schema de Calibrações e Equipamentos
-- Execute este script no Supabase SQL Editor para verificar se tudo está funcionando

-- 1. Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'equipamentos', 
  'calibracoes', 
  'pontos_calibracao', 
  'manutencoes', 
  'inspecoes', 
  'criterios_inspecao',
  'fotos_equipamentos',
  'documentos_equipamentos',
  'fotos_calibracoes',
  'documentos_calibracoes',
  'fotos_manutencoes',
  'documentos_manutencoes',
  'fotos_inspecoes',
  'documentos_inspecoes'
)
ORDER BY table_name;

-- 2. Verificar se as colunas equipamento_id existem nas tabelas relacionadas
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND column_name = 'equipamento_id'
AND table_name IN ('calibracoes', 'manutencoes', 'inspecoes', 'fotos_equipamentos', 'documentos_equipamentos')
ORDER BY table_name;

-- 3. Verificar se há dados nas tabelas
SELECT 'equipamentos' as tabela, COUNT(*) as total FROM equipamentos
UNION ALL
SELECT 'calibracoes' as tabela, COUNT(*) as total FROM calibracoes
UNION ALL
SELECT 'manutencoes' as tabela, COUNT(*) as total FROM manutencoes
UNION ALL
SELECT 'inspecoes' as tabela, COUNT(*) as total FROM inspecoes
UNION ALL
SELECT 'pontos_calibracao' as tabela, COUNT(*) as total FROM pontos_calibracao
UNION ALL
SELECT 'criterios_inspecao' as tabela, COUNT(*) as total FROM criterios_inspecao;

-- 4. Testar a função de estatísticas
SELECT get_calibracoes_stats();

-- 5. Testar uma consulta simples com JOIN
SELECT 
  e.codigo,
  e.nome,
  c.numero_calibracao,
  c.data_calibracao,
  c.resultado
FROM equipamentos e
LEFT JOIN calibracoes c ON e.id = c.equipamento_id
LIMIT 5;

-- 6. Verificar se os índices foram criados
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('equipamentos', 'calibracoes', 'manutencoes', 'inspecoes')
ORDER BY tablename, indexname;
