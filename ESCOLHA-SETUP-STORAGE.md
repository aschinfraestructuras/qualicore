# 🎯 ESCOLHA: Como Configurar Storage

## 📋 **Situação Atual:**
- ❌ Storage não está ativo no seu projeto Supabase
- ❌ Extensão "storage" não encontrada
- ❌ Políticas RLS não configuradas

## 🚀 **OPÇÃO 1: Configuração Automática (RECOMENDADO)**

### **Vantagens:**
- ✅ Executa tudo automaticamente
- ✅ Configura buckets, políticas e testes
- ✅ Menos chance de erro
- ✅ Mais rápido

### **Como usar:**
1. **Execute o script automático:**
   ```bash
   node setup-storage-automatico.cjs
   ```

2. **Se der erro, execute o SQL manualmente:**
   - Copie o conteúdo de `setup-storage-completo.sql`
   - Cole no SQL Editor do Supabase Dashboard
   - Execute

## 🔧 **OPÇÃO 2: Configuração Manual**

### **Vantagens:**
- ✅ Mais controle sobre cada passo
- ✅ Pode ver exatamente o que está acontecendo
- ✅ Melhor para aprender

### **Como usar:**
1. **Ativar Storage no Dashboard:**
   - Vá para Supabase Dashboard
   - Settings > General > Storage
   - Ative o recurso

2. **Executar SQL manualmente:**
   - Use o arquivo `setup-storage-completo.sql`
   - Execute no SQL Editor

## 🎯 **MINHA RECOMENDAÇÃO:**

### **Para você (que não tem experiência):**
**Use a OPÇÃO 1 (Automática)** porque:
- É mais simples
- Menos chance de erro
- Configura tudo de uma vez

### **Passos:**
1. **Execute:** `node setup-storage-automatico.cjs`
2. **Se funcionar:** Pronto! Storage configurado
3. **Se não funcionar:** Execute o SQL manualmente

## 🔍 **COMO SABER SE FUNCIONOU:**

### **Teste Rápido:**
```javascript
// No console do navegador
const testFile = new File(['Teste'], 'teste.txt', { type: 'text/plain' });

const { data, error } = await supabase
  .storage
  .from('documentos')
  .upload('teste.txt', testFile);

if (error) {
  console.log('❌ Erro:', error);
} else {
  console.log('✅ Sucesso:', data);
}
```

### **Sinais de Sucesso:**
- ✅ Buckets aparecem no Dashboard > Storage
- ✅ Upload de arquivo funciona
- ✅ Não há erros de RLS

## 🚨 **SE NADA FUNCIONAR:**

### **Problema:** Storage não está ativo no projeto
**Solução:**
1. Vá para Supabase Dashboard
2. Settings > General
3. Procure por "Storage" ou "File Storage"
4. Ative o recurso
5. Se não aparecer, pode ser limitação do plano gratuito

### **Problema:** Limitação do plano
**Solução:**
1. Verifique o plano atual do projeto
2. Storage pode estar limitado no plano gratuito
3. Considere fazer upgrade ou usar alternativa

## 📞 **QUAL OPÇÃO VOCÊ QUER TENTAR?**

**Digite:**
- `1` = Configuração automática
- `2` = Configuração manual
- `teste` = Testar se Storage está ativo

**Ou simplesmente execute:**
```bash
node setup-storage-automatico.cjs
``` 