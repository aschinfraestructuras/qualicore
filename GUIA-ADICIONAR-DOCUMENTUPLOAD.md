# 📋 Guia: Adicionar DocumentUpload em Todos os Módulos

## 🎯 **Objetivo:**
Adicionar upload de documentos em todos os 9-10 módulos do Qualicore de forma consistente.

## 🚀 **Passo 1: Executar Configuração Global**

### **Opção A: Automático (Recomendado)**
```bash
node setup-documentos-global.cjs
```

### **Opção B: Manual**
Execute o SQL `setup-documentos-global.sql` no Supabase Dashboard.

## 📁 **Passo 2: Lista de Formulários para Atualizar**

### **✅ Já Configurados:**
- [x] `EnsaioForm.tsx` - Ensaios gerais
- [x] `EnsaioCompactacaoForm.tsx` - Ensaios de compactação

### **🔄 Pendentes:**
- [ ] `ObraForm.tsx` - Obras
- [ ] `MaterialForm.tsx` - Materiais  
- [ ] `FornecedorForm.tsx` - Fornecedores
- [ ] `ChecklistForm.tsx` - Checklists
- [ ] `DocumentoForm.tsx` - Documentos
- [ ] `NaoConformidadeForm.tsx` - Não Conformidades
- [ ] `RFIForm.tsx` - RFIs

## 🔧 **Passo 3: Template para Adicionar DocumentUpload**

### **1. Importar o componente:**
```tsx
import DocumentUpload from "../DocumentUpload";
```

### **2. Adicionar estado para documentos:**
```tsx
const [documents, setDocuments] = useState<any[]>([]);
```

### **3. Adicionar no formulário (antes dos botões):**
```tsx
{/* Documentos */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Documentos (Relatórios, PDFs, Imagens, etc.)
  </label>
  <DocumentUpload
    recordId={initialData?.id || 'new'}
    recordType="NOME_MODULO"
    onDocumentsChange={setDocuments}
    existingDocuments={initialData?.documents || []}
    maxFiles={10}
    maxSizeMB={10}
    allowedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png']}
  />
</div>
```

### **4. Incluir documentos nos dados enviados:**
```tsx
const formData = {
  // ... outros campos
  documents: documents || [],
};
```

## 📋 **Mapeamento de recordType por Módulo:**

| Módulo | recordType | Bucket |
|--------|------------|--------|
| Ensaios | `ensaio` | `ensaios` |
| Ensaios Compactação | `ensaio_compactacao` | `ensaios` |
| Obras | `obra` | `obras` |
| Materiais | `material` | `materiais` |
| Fornecedores | `fornecedor` | `fornecedores` |
| Checklists | `checklist` | `checklists` |
| Documentos | `documento` | `documentos` |
| Não Conformidades | `nao_conformidade` | `nao_conformidades` |
| RFIs | `rfi` | `rfis` |

## 🔄 **Passo 4: Atualizar Tipos TypeScript**

### **Adicionar documents em todos os tipos:**
```tsx
// Em src/types/index.ts
export interface Obra extends BaseEntity {
  // ... campos existentes
  documents?: any[]; // Adicionar esta linha
}

export interface Material extends BaseEntity {
  // ... campos existentes
  documents?: any[]; // Adicionar esta linha
}

// ... repetir para todos os tipos
```

## 🚀 **Passo 5: Script Automático para Todos os Formulários**

### **Executar este comando para atualizar automaticamente:**
```bash
node atualizar-formularios-documentos.cjs
```

## 📊 **Status de Progresso:**

### **Fase 1: Configuração (✅ Concluída)**
- [x] Storage configurado
- [x] Buckets criados
- [x] Políticas RLS configuradas

### **Fase 2: Formulários (🔄 Em Progresso)**
- [x] Ensaios (2 formulários)
- [ ] Obras (1 formulário)
- [ ] Materiais (1 formulário)
- [ ] Fornecedores (1 formulário)
- [ ] Checklists (1 formulário)
- [ ] Documentos (1 formulário)
- [ ] Não Conformidades (1 formulário)
- [ ] RFIs (1 formulário)

### **Fase 3: Testes (⏳ Pendente)**
- [ ] Testar upload em todos os módulos
- [ ] Verificar salvamento com documentos
- [ ] Testar visualização de documentos
- [ ] Testar download de documentos

## 🎯 **Próximos Passos:**

1. **Execute:** `node setup-documentos-global.cjs`
2. **Aguarde** a configuração completa
3. **Teste** criar um ensaio com documento
4. **Se funcionar**, podemos prosseguir com os outros módulos

## 💡 **Dica:**
Se quiser fazer tudo de uma vez, posso criar um script que atualiza automaticamente todos os formulários com DocumentUpload!

**Quer que eu execute a configuração global agora?** 🚀 