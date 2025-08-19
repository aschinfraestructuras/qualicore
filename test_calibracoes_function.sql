-- Recriar a função get_calibracoes_stats
CREATE OR REPLACE FUNCTION get_calibracoes_stats()
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_equipamentos', (SELECT COUNT(*) FROM equipamentos),
    'equipamentos_ativos', (SELECT COUNT(*) FROM equipamentos WHERE estado = 'ativo'),
    'equipamentos_manutencao', (SELECT COUNT(*) FROM equipamentos WHERE estado = 'manutencao'),
    'equipamentos_avariados', (SELECT COUNT(*) FROM equipamentos WHERE estado = 'avariado'),
    'calibracoes_vencidas', (SELECT COUNT(*) FROM calibracoes WHERE data_proxima_calibracao < CURRENT_DATE AND resultado = 'aprovado'),
    'calibracoes_proximas_vencer', (SELECT COUNT(*) FROM calibracoes WHERE data_proxima_calibracao BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days' AND resultado = 'aprovado'),
    'manutencoes_pendentes', (SELECT COUNT(*) FROM manutencoes WHERE resultado IN ('pendente', 'em_andamento')),
    'inspecoes_pendentes', (SELECT COUNT(*) FROM inspecoes WHERE resultado = 'pendente'),
    'valor_total_equipamentos', (SELECT COALESCE(SUM(COALESCE(valor_atual, valor_aquisicao)), 0) FROM equipamentos),
    'custo_total_calibracoes', (SELECT COALESCE(SUM(custo), 0) FROM calibracoes),
    'custo_total_manutencoes', (SELECT COALESCE(SUM(custo), 0) FROM manutencoes)
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- Teste da função get_calibracoes_stats
SELECT get_calibracoes_stats();

-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('equipamentos', 'calibracoes', 'manutencoes', 'inspecoes');

-- Verificar se há dados nas tabelas
SELECT 'equipamentos' as tabela, COUNT(*) as total FROM equipamentos
UNION ALL
SELECT 'calibracoes' as tabela, COUNT(*) as total FROM calibracoes
UNION ALL
SELECT 'manutencoes' as tabela, COUNT(*) as total FROM manutencoes
UNION ALL
SELECT 'inspecoes' as tabela, COUNT(*) as total FROM inspecoes;

-- Verificar se a função existe
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'get_calibracoes_stats';

-- Verificar alguns dados de exemplo
SELECT codigo, nome, valor_aquisicao, valor_atual FROM equipamentos LIMIT 5;

-- Testar a soma dos valores diretamente
SELECT 
  SUM(valor_aquisicao) as total_valor_aquisicao,
  SUM(valor_atual) as total_valor_atual,
  SUM(COALESCE(valor_atual, valor_aquisicao)) as total_corrigido
FROM equipamentos;

-- Verificar se há valores NULL
SELECT 
  COUNT(*) as total_equipamentos,
  COUNT(valor_aquisicao) as equipamentos_com_valor_aquisicao,
  COUNT(valor_atual) as equipamentos_com_valor_atual,
  COUNT(COALESCE(valor_atual, valor_aquisicao)) as equipamentos_com_valor_total
FROM equipamentos;
