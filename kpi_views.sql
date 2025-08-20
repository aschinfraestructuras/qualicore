-- =====================================================
-- VIEWS MATERIALIZADAS PARA KPIs EM TEMPO REAL
-- QUALICORE - SUPABASE
-- =====================================================

-- 1. VIEW PARA MÉTRICAS DIÁRIAS
CREATE OR REPLACE VIEW kpi_daily_stats AS
SELECT 
    DATE(data_ensaio) as data,
    COUNT(*) as total_ensaios,
    COUNT(CASE WHEN conforme = true THEN 1 END) as aprovados,
    COUNT(CASE WHEN conforme = false THEN 1 END) as reprovados,
    COUNT(CASE WHEN estado = 'pendente' THEN 1 END) as pendentes,
    ROUND((COUNT(CASE WHEN conforme = true THEN 1 END) * 100.0 / NULLIF(COUNT(CASE WHEN conforme IS NOT NULL THEN 1 END), 0)), 2) as qualidade_percent,
    AVG(CASE WHEN conforme = true THEN valor_obtido END) as media_valores_aprovados,
    COUNT(DISTINCT laboratorio) as laboratorios_ativos,
    COUNT(DISTINCT responsavel) as responsaveis_ativos
FROM ensaios 
WHERE data_ensaio IS NOT NULL
GROUP BY DATE(data_ensaio)
ORDER BY data DESC;

-- 2. VIEW PARA KPIs ATUAIS (HOJE)
CREATE OR REPLACE VIEW kpi_today AS
SELECT 
    'today' as periodo,
    COUNT(*) as total_ensaios,
    COUNT(CASE WHEN conforme = true THEN 1 END) as aprovados,
    COUNT(CASE WHEN conforme = false THEN 1 END) as reprovados,
    COUNT(CASE WHEN estado = 'pendente' THEN 1 END) as pendentes,
    ROUND((COUNT(CASE WHEN conforme = true THEN 1 END) * 100.0 / NULLIF(COUNT(CASE WHEN conforme IS NOT NULL THEN 1 END), 0)), 2) as qualidade_percent,
    COUNT(DISTINCT tipo) as tipos_ensaios,
    COUNT(DISTINCT laboratorio) as laboratorios_ativos
FROM ensaios 
WHERE DATE(data_ensaio) = CURRENT_DATE;

-- 3. VIEW PARA KPIs ÚLTIMOS 7 DIAS
CREATE OR REPLACE VIEW kpi_7d AS
SELECT 
    '7d' as periodo,
    COUNT(*) as total_ensaios,
    COUNT(CASE WHEN conforme = true THEN 1 END) as aprovados,
    COUNT(CASE WHEN conforme = false THEN 1 END) as reprovados,
    COUNT(CASE WHEN estado = 'pendente' THEN 1 END) as pendentes,
    ROUND((COUNT(CASE WHEN conforme = true THEN 1 END) * 100.0 / NULLIF(COUNT(CASE WHEN conforme IS NOT NULL THEN 1 END), 0)), 2) as qualidade_percent,
    COUNT(DISTINCT tipo) as tipos_ensaios,
    COUNT(DISTINCT laboratorio) as laboratorios_ativos,
    AVG(CASE WHEN conforme = true THEN valor_obtido END) as media_valores_aprovados
FROM ensaios 
WHERE data_ensaio >= CURRENT_DATE - INTERVAL '7 days';

-- 4. VIEW PARA KPIs ÚLTIMOS 30 DIAS
CREATE OR REPLACE VIEW kpi_30d AS
SELECT 
    '30d' as periodo,
    COUNT(*) as total_ensaios,
    COUNT(CASE WHEN conforme = true THEN 1 END) as aprovados,
    COUNT(CASE WHEN conforme = false THEN 1 END) as reprovados,
    COUNT(CASE WHEN estado = 'pendente' THEN 1 END) as pendentes,
    ROUND((COUNT(CASE WHEN conforme = true THEN 1 END) * 100.0 / NULLIF(COUNT(CASE WHEN conforme IS NOT NULL THEN 1 END), 0)), 2) as qualidade_percent,
    COUNT(DISTINCT tipo) as tipos_ensaios,
    COUNT(DISTINCT laboratorio) as laboratorios_ativos,
    AVG(CASE WHEN conforme = true THEN valor_obtido END) as media_valores_aprovados
FROM ensaios 
WHERE data_ensaio >= CURRENT_DATE - INTERVAL '30 days';

-- 5. VIEW PARA NÃO CONFORMIDADES POR CATEGORIA
CREATE OR REPLACE VIEW kpi_nc_categorias AS
SELECT 
    tipo,
    COUNT(CASE WHEN conforme = false THEN 1 END) as nc_count,
    COUNT(*) as total_ensaios,
    ROUND((COUNT(CASE WHEN conforme = false THEN 1 END) * 100.0 / COUNT(*)), 2) as nc_percent
FROM ensaios 
WHERE data_ensaio >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY tipo
HAVING COUNT(CASE WHEN conforme = false THEN 1 END) > 0
ORDER BY nc_count DESC;

-- 6. VIEW PARA SLA LABORATÓRIO (simplificado - sem data_criacao)
CREATE OR REPLACE VIEW kpi_sla_laboratorio AS
SELECT 
    laboratorio,
    COUNT(*) as total_ensaios,
    COUNT(CASE WHEN estado = 'aprovado' THEN 1 END) as aprovados,
    COUNT(CASE WHEN estado = 'reprovado' THEN 1 END) as reprovados,
    COUNT(CASE WHEN estado = 'pendente' THEN 1 END) as pendentes,
    ROUND((COUNT(CASE WHEN estado = 'aprovado' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)), 2) as taxa_aprovacao,
    AVG(CASE WHEN conforme = true THEN valor_obtido END) as media_valores_aprovados
FROM ensaios 
WHERE data_ensaio >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY laboratorio
ORDER BY taxa_aprovacao DESC;

-- 7. VIEW PARA TENDÊNCIAS DIÁRIAS (últimos 30 dias)
CREATE OR REPLACE VIEW kpi_trends_30d AS
SELECT 
    DATE(data_ensaio) as data,
    COUNT(*) as total_ensaios,
    COUNT(CASE WHEN conforme = true THEN 1 END) as aprovados,
    COUNT(CASE WHEN conforme = false THEN 1 END) as reprovados,
    ROUND((COUNT(CASE WHEN conforme = true THEN 1 END) * 100.0 / NULLIF(COUNT(CASE WHEN conforme IS NOT NULL THEN 1 END), 0)), 2) as qualidade_percent
FROM ensaios 
WHERE data_ensaio >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(data_ensaio)
ORDER BY data ASC;

-- 8. VIEW PARA MÉTRICAS GLOBAIS
CREATE OR REPLACE VIEW kpi_global AS
SELECT 
    (SELECT COUNT(*) FROM ensaios) as total_ensaios_historico,
    (SELECT COUNT(*) FROM ensaios WHERE conforme = true) as total_aprovados_historico,
    (SELECT COUNT(*) FROM ensaios WHERE conforme = false) as total_reprovados_historico,
    (SELECT COUNT(*) FROM ensaios WHERE estado = 'pendente') as total_pendentes,
    (SELECT ROUND((COUNT(CASE WHEN conforme = true THEN 1 END) * 100.0 / NULLIF(COUNT(CASE WHEN conforme IS NOT NULL THEN 1 END), 0)), 2) FROM ensaios) as qualidade_global_percent,
    (SELECT COUNT(DISTINCT laboratorio) FROM ensaios) as total_laboratorios,
    (SELECT COUNT(DISTINCT tipo) FROM ensaios) as total_tipos_ensaios,
    (SELECT COUNT(DISTINCT zona) FROM ensaios WHERE zona IS NOT NULL) as total_zonas;

-- =====================================================
-- FIM DAS VIEWS
-- =====================================================
