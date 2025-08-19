#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Iniciando Limpeza Segura do Qualicore...\n');

const SRC_DIR = path.join(__dirname, '..', 'src');

// Lista de imports que NUNCA devem ser removidos
const CRITICAL_IMPORTS = [
  'react', 'react-dom', 'react-router-dom', 'framer-motion',
  'lucide-react', 'recharts', 'react-hook-form', 'zod',
  'zustand', 'react-hot-toast', 'supabase', 'vite'
];

// Lista de variáveis que NUNCA devem ser removidas
const CRITICAL_VARIABLES = [
  'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef',
  'useNavigate', 'useParams', 'useLocation', 'useContext',
  'children', 'props', 'state', 'setState', 'loading', 'error',
  'data', 'setData', 'handleSubmit', 'onSubmit', 'onClick'
];

// Função para verificar se um arquivo é seguro para limpeza
function isSafeToClean(filePath) {
  const unsafeFiles = [
    'App.tsx', 'main.tsx', 'index.tsx', 'router.tsx',
    'supabase.ts', 'auth.ts', 'types.ts', 'index.ts'
  ];
  
  const fileName = path.basename(filePath);
  return !unsafeFiles.includes(fileName);
}

// Função para remover imports não utilizados de forma segura
function removeUnusedImports(content, filePath) {
  if (!isSafeToClean(filePath)) {
    console.log(`⚠️  Pulando arquivo crítico: ${path.basename(filePath)}`);
    return content;
  }

  let modified = false;
  
  // Remover imports do Lucide React não utilizados
  const lucideImports = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"]/g);
  if (lucideImports) {
    lucideImports.forEach(importStatement => {
      const match = importStatement.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"]/);
      if (match) {
        const imports = match[1].split(',').map(imp => imp.trim());
        const usedImports = [];
        
        imports.forEach(imp => {
          // Verificar se o import é usado no arquivo
          const importName = imp.replace(/\s+as\s+\w+/, '').trim();
          if (content.includes(importName) && !importName.match(/^[A-Z]/)) {
            usedImports.push(imp);
          }
        });
        
        if (usedImports.length !== imports.length) {
          const newImport = `import { ${usedImports.join(', ')} } from "lucide-react";`;
          content = content.replace(importStatement, newImport);
          modified = true;
          console.log(`✅ Removidos imports não utilizados do Lucide em ${path.basename(filePath)}`);
        }
      }
    });
  }
  
  return { content, modified };
}

// Função para remover variáveis não utilizadas de forma segura
function removeUnusedVariables(content, filePath) {
  if (!isSafeToClean(filePath)) {
    return content;
  }

  let modified = false;
  
  // Remover variáveis não utilizadas em useState
  const useStatePattern = /const\s*\[\s*(\w+)\s*,\s*set\w+\s*\]\s*=\s*useState/g;
  let match;
  
  while ((match = useStatePattern.exec(content)) !== null) {
    const varName = match[1];
    const setterName = `set${varName.charAt(0).toUpperCase() + varName.slice(1)}`;
    
    // Verificar se a variável é realmente não utilizada
    const varUsage = content.match(new RegExp(`\\b${varName}\\b`, 'g'));
    const setterUsage = content.match(new RegExp(`\\b${setterName}\\b`, 'g'));
    
    if (varUsage && varUsage.length === 1 && (!setterUsage || setterUsage.length === 1)) {
      // Apenas a declaração, não utilizada
      const fullMatch = match[0];
      const nextSemicolon = content.indexOf(';', match.index);
      const lineToRemove = content.substring(match.index, nextSemicolon + 1);
      
      if (!CRITICAL_VARIABLES.includes(varName)) {
        content = content.replace(lineToRemove, '');
        modified = true;
        console.log(`✅ Removida variável não utilizada: ${varName} em ${path.basename(filePath)}`);
      }
    }
  }
  
  return { content, modified };
}

// Função para processar um arquivo
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    console.log(`🔍 Processando: ${fileName}`);
    
    // Aplicar limpeza segura
    let { content: cleanedContent, modified: importsModified } = removeUnusedImports(content, filePath);
    let { content: finalContent, modified: varsModified } = removeUnusedVariables(cleanedContent, filePath);
    
    if (importsModified || varsModified) {
      // Fazer backup antes de modificar
      const backupPath = filePath + '.backup';
      fs.writeFileSync(backupPath, content);
      
      // Escrever arquivo limpo
      fs.writeFileSync(filePath, finalContent);
      console.log(`✅ Limpeza aplicada em: ${fileName}`);
    } else {
      console.log(`ℹ️  Nenhuma mudança necessária em: ${fileName}`);
    }
    
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
}

// Função para processar diretório recursivamente
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Pular node_modules e outros diretórios não relevantes
      if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
        processDirectory(fullPath);
      }
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      processFile(fullPath);
    }
  });
}

// Executar limpeza
console.log('🚀 Iniciando processo de limpeza segura...\n');

// Fazer backup do diretório src
const backupDir = path.join(__dirname, '..', 'backup-src-' + Date.now());
fs.mkdirSync(backupDir, { recursive: true });

console.log(`📦 Criando backup em: ${backupDir}`);

// Copiar src para backup
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

copyDirectory(SRC_DIR, path.join(backupDir, 'src'));

// Processar arquivos
processDirectory(SRC_DIR);

console.log('\n✅ Limpeza segura concluída!');
console.log(`📦 Backup salvo em: ${backupDir}`);
console.log('\n🔍 Para reverter mudanças, use:');
console.log(`cp -r ${backupDir}/src/* src/`);

// Verificar se o build ainda funciona
console.log('\n🧪 Testando se o build ainda funciona...');
try {
  const { execSync } = await import('child_process');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build bem-sucedido após limpeza!');
} catch (error) {
  console.log('❌ Build falhou após limpeza. Restaurando backup...');
  copyDirectory(path.join(backupDir, 'src'), SRC_DIR);
  console.log('✅ Backup restaurado. Site funcional novamente.');
}
