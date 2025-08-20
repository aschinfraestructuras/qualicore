# 📋 INSTRUÇÕES PARA EXECUTAR NO SUPABASE

## 🚀 **PASSO 1: Executar as Views SQL**

1. **Aceder ao Supabase Dashboard:**
   - Vai para: `supabase.com/dashboard/project/mjgvjpqcdsmvervcxjig`
   - Clica em **"SQL Editor"** no menu lateral

2. **Executar o Script:**
   - Copia todo o conteúdo do ficheiro `kpi_views.sql`
   - Cola no SQL Editor do Supabase
   - Clica em **"Run"** para executar

3. **Verificar as Views Criadas:**
   - Vai para **"Table Editor"** no menu lateral
   - Deves ver as seguintes views criadas:
     - `kpi_daily_stats`
     - `kpi_today`
     - `kpi_7d`
     - `kpi_30d`
     - `kpi_nc_categorias`
     - `kpi_sla_laboratorio`
     - `kpi_trends_30d`
     - `kpi_global`

## 🎯 **PASSO 2: Testar as Views**

Executa estas queries para testar:

```sql
-- Testar KPI hoje
SELECT * FROM kpi_today;

-- Testar KPI 7 dias
SELECT * FROM kpi_7d;

-- Testar KPI 30 dias
SELECT * FROM kpi_30d;

-- Testar NC categorias
SELECT * FROM kpi_nc_categorias;

-- Testar SLA laboratório
SELECT * FROM kpi_sla_laboratorio;

-- Testar dados globais
SELECT * FROM kpi_global;
```

## ✅ **PASSO 3: Verificar Resultados**

Se tudo estiver correto, vais ver:
- **Dados reais** dos teus ensaios
- **Métricas calculadas** automaticamente
- **Percentagens de qualidade** baseadas nos teus dados
- **Estatísticas por laboratório**

## 🔄 **PASSO 4: Atualizar o Site**

Depois de executar as views:
1. Faz commit das alterações
2. O dashboard vai mostrar **KPIs em tempo real** com os teus dados reais!

---

## 🎉 **RESULTADO ESPERADO**

O dashboard vai mostrar:
- **Qualidade %** baseada nos teus ensaios reais
- **Ensaios realizados** nos últimos 7/30 dias
- **NCs abertas** baseadas nos dados reais
- **Taxa de aprovação** dos laboratórios
- **Métricas globais** do sistema

**Queres que execute agora?** 🚀
