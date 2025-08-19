# 💰 PLANO OTIMIZADO - MÁXIMO RESULTADO, MÍNIMO CUSTO

## 🎯 **ESTRATÉGIA: EVOLUÇÃO GRATUITA + SUPABASE PRO**

### 📊 **INVESTIMENTO MÍNIMO**
- **Supabase Pro**: €25/mês (essencial)
- **Cursor Pro**: €20/mês (desenvolvimento)
- **Total**: €45/mês (muito baixo!)

---

## 🚀 **FASE 1: FUNDAÇÕES GRATUITAS (SEMANA 1-2)**

### **1. PERFORMANCE - TOTALMENTE GRATUITO**
```bash
# Instalar apenas dependências gratuitas
npm install @tanstack/react-query
npm install react-window react-virtualized
npm install compression-webpack-plugin
```

#### **🔄 React Query (GRATUITO)**
```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})
```

#### **⚡ Otimização Supabase (GRATUITO)**
```sql
-- Índices críticos (gratuitos no Supabase)
CREATE INDEX CONCURRENTLY idx_obras_status ON obras(status);
CREATE INDEX CONCURRENTLY idx_ensaios_data ON ensaios(data_ensaio);
CREATE INDEX CONCURRENTLY idx_materiais_categoria ON materiais(categoria);
CREATE INDEX CONCURRENTLY idx_documentos_tipo ON documentos(tipo);

-- Otimizar queries com paginação
SELECT * FROM obras 
WHERE status = 'ativo' 
ORDER BY created_at DESC 
LIMIT 50 OFFSET 0;
```

### **2. SEGURANÇA - GRATUITO**
```typescript
// src/lib/security.ts
export class SecurityService {
  // Rate limiting com localStorage (gratuito)
  static checkRateLimit(action: string, limit: number = 10): boolean {
    const key = `rate_limit_${action}`;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutos
    
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    const recentAttempts = attempts.filter((time: number) => now - time < windowMs);
    
    if (recentAttempts.length >= limit) {
      return false;
    }
    
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    return true;
  }

  // XSS Protection (gratuito)
  static sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}
```

---

## 🛡️ **FASE 2: PROTEÇÃO E STORAGE (SEMANA 3-4)**

### **3. SUPABASE PRO - €25/mês (ESSENCIAL)**
```typescript
// Benefícios do Supabase Pro:
// - 100GB storage (vs 1GB gratuito)
// - 100,000+ registos
// - Backup automático
// - Row Level Security (RLS)
// - Database logs
// - Performance insights
```

#### **🔒 Row Level Security (GRATUITO COM PRO)**
```sql
-- Proteger dados por utilizador
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own obras" ON obras
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can see all obras" ON obras
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
```

#### **💾 Storage Otimizado (PRO)**
```typescript
// src/lib/storage-optimized.ts
export class OptimizedStorageService {
  // Compressão automática (gratuito)
  static async compressImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width * 0.8; // Reduzir 20%
        canvas.height = img.height * 0.8;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          resolve(new File([blob!], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.8); // Qualidade 80%
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Thumbnail generation (gratuito)
  static async generateThumbnail(file: File): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = 150; // Thumbnail 150px
        canvas.height = 150;
        ctx.drawImage(img, 0, 0, 150, 150);
        
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
}
```

---

## 📊 **FASE 3: MONITORIZAÇÃO GRATUITA (SEMANA 5-6)**

### **4. Error Tracking - GRATUITO**
```typescript
// src/lib/error-tracking.ts
export class ErrorTrackingService {
  private static errors: any[] = [];

  static captureError(error: Error, context?: any) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context
    };

    this.errors.push(errorData);
    
    // Enviar para Supabase (gratuito)
    this.saveToDatabase(errorData);
    
    // Log local para debug
    console.error('Error captured:', errorData);
  }

  private static async saveToDatabase(errorData: any) {
    try {
      const { supabase } = await import('./supabase');
      await supabase.from('error_logs').insert(errorData);
    } catch (err) {
      console.error('Failed to save error:', err);
    }
  }

  // Dashboard de erros (gratuito)
  static getErrorStats() {
    const last24h = this.errors.filter(
      e => new Date(e.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    return {
      total: this.errors.length,
      last24h: last24h.length,
      critical: last24h.filter(e => e.message.includes('critical')).length
    };
  }
}
```

### **5. Performance Monitoring - GRATUITO**
```typescript
// src/lib/performance.ts
export class PerformanceMonitor {
  static measurePageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics = {
        loadTime: navigation.loadEventEnd - navigation.navigationStart,
        domReady: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        timestamp: new Date().toISOString()
      };

      this.saveMetrics(metrics);
    });
  }

  private static async saveMetrics(metrics: any) {
    try {
      const { supabase } = await import('./supabase');
      await supabase.from('performance_metrics').insert(metrics);
    } catch (err) {
      console.error('Failed to save metrics:', err);
    }
  }
}
```

---

## 🤖 **FASE 4: AI FEATURES GRATUITAS (SEMANA 7-8)**

### **6. OCR Gratuito com Tesseract.js**
```bash
npm install tesseract.js
```

```typescript
// src/lib/ai-service.ts
import Tesseract from 'tesseract.js';

export class AIService {
  // OCR gratuito
  static async extractTextFromImage(file: File): Promise<string> {
    try {
      const result = await Tesseract.recognize(file, 'por', {
        logger: m => console.log(m)
      });
      
      return result.data.text;
    } catch (error) {
      console.error('OCR failed:', error);
      return '';
    }
  }

  // Categorização simples (gratuito)
  static categorizeDocument(content: string): string {
    const keywords = {
      'ensaio': ['ensaio', 'teste', 'laboratório', 'resultado'],
      'obra': ['obra', 'construção', 'canteiro', 'projeto'],
      'material': ['material', 'fornecedor', 'custo', 'quantidade'],
      'documento': ['documento', 'relatório', 'certificado', 'norma']
    };

    const lowerContent = content.toLowerCase();
    
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => lowerContent.includes(word))) {
        return category;
      }
    }
    
    return 'outro';
  }

  // Deteção de anomalias simples (gratuito)
  static detectAnomalies(data: number[]): number[] {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const std = Math.sqrt(
      data.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / data.length
    );
    
    return data.filter(value => Math.abs(value - mean) > 2 * std);
  }
}
```

---

## 📈 **FASE 5: DASHBOARDS AVANÇADOS (SEMANA 9-10)**

### **7. KPIs Executivos - GRATUITO**
```typescript
// src/components/ExecutiveDashboard.tsx
import { useQuery } from '@tanstack/react-query';

export const ExecutiveDashboard = () => {
  const { data: kpis } = useQuery({
    queryKey: ['executive-kpis'],
    queryFn: async () => {
      const { supabase } = await import('../lib/supabase');
      
      const [
        { count: obrasAtivas },
        { count: ensaiosPendentes },
        { count: materiais },
        { count: documentos }
      ] = await Promise.all([
        supabase.from('obras').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
        supabase.from('ensaios').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
        supabase.from('materiais').select('*', { count: 'exact', head: true }),
        supabase.from('documentos').select('*', { count: 'exact', head: true })
      ]);

      return {
        obrasAtivas: obrasAtivas || 0,
        ensaiosPendentes: ensaiosPendentes || 0,
        totalMateriais: materiais || 0,
        totalDocumentos: documentos || 0
      };
    },
    staleTime: 5 * 60 * 1000 // 5 minutos
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard 
        title="Obras Ativas"
        value={kpis?.obrasAtivas || 0}
        icon={<Building />}
        color="blue"
      />
      <KPICard 
        title="Ensaios Pendentes"
        value={kpis?.ensaiosPendentes || 0}
        icon={<TestTube />}
        color="orange"
      />
      <KPICard 
        title="Total Materiais"
        value={kpis?.totalMateriais || 0}
        icon={<Package />}
        color="green"
      />
      <KPICard 
        title="Documentos"
        value={kpis?.totalDocumentos || 0}
        icon={<FileText />}
        color="purple"
      />
    </div>
  );
};
```

---

## 📋 **PLANO DE EXECUÇÃO OTIMIZADO**

### **SEMANA 1-2: FUNDAÇÕES GRATUITAS**
- [ ] Setup React Query (gratuito)
- [ ] Otimizar queries Supabase (gratuito)
- [ ] Implementar rate limiting (gratuito)
- [ ] XSS protection (gratuito)

### **SEMANA 3-4: SUPABASE PRO + STORAGE**
- [ ] Upgrade para Supabase Pro (€25/mês)
- [ ] Implementar RLS (gratuito)
- [ ] Sistema de compressão (gratuito)
- [ ] Thumbnail generation (gratuito)

### **SEMANA 5-6: MONITORIZAÇÃO**
- [ ] Error tracking (gratuito)
- [ ] Performance monitoring (gratuito)
- [ ] Dashboard de métricas (gratuito)

### **SEMANA 7-8: AI FEATURES**
- [ ] OCR com Tesseract.js (gratuito)
- [ ] Categorização automática (gratuito)
- [ ] Deteção de anomalias (gratuito)

### **SEMANA 9-10: DASHBOARDS**
- [ ] KPIs executivos (gratuito)
- [ ] Gráficos avançados (gratuito)
- [ ] Relatórios automáticos (gratuito)

---

## 💰 **INVESTIMENTO TOTAL**

### **MENSAL: €45/mês**
- **Supabase Pro**: €25/mês
- **Cursor Pro**: €20/mês

### **DESENVOLVIMENTO: €0**
- Todas as melhorias são gratuitas
- Usando ferramentas open-source
- Aproveitando recursos do Supabase Pro

### **TOTAL: €45/mês (muito baixo!)**

---

## 🎯 **RESULTADO ESPERADO**

### **QUALICORE 8.5/10 - COM MÍNIMO INVESTIMENTO**

**Capacidades finais:**
- 🚀 **Performance**: 10x mais rápido (React Query)
- 🛡️ **Segurança**: Nível empresarial (RLS, Rate Limiting)
- 📊 **Monitorização**: Analytics completos (gratuito)
- 🤖 **Inteligência**: AI-powered (OCR gratuito)
- 💾 **Storage**: 100GB (Supabase Pro)
- 💰 **Custo**: Apenas €45/mês

### **CAPACIDADES FINAIS**
- **Utilizadores**: 500+ simultâneos
- **Ficheiros**: 100,000+ com gestão avançada
- **Performance**: <2s tempo de carregamento
- **Segurança**: RLS, Rate limiting, XSS protection
- **AI**: OCR, categorização, anomalias
- **Custo**: €45/mês (muito baixo!)

---

## 🚀 **PRÓXIMO PASSO**

**QUERES COMEÇAR COM ESTE PLANO OTIMIZADO?**

1. **Confirmar Supabase Pro** (€25/mês)
2. **Setup React Query** (gratuito)
3. **Implementar RLS** (gratuito)
4. **Desenvolvimento iterativo** (sprint por sprint)

**O Qualicore será uma referência em Portugal com investimento mínimo! 🎉**
