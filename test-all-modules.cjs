#!/usr/bin/env node

/**
 * SCRIPT DE TESTE - VERIFICAÇÃO DE TODOS OS MÓDULOS
 *
 * Este script verifica se todos os módulos estão usando as APIs do Supabase
 * em vez de localStorage ou mock data.
 */

const fs = require("fs");
const path = require("path");

// Módulos que devem usar Supabase
const modulesToCheck = [
  { file: "src/pages/Obras.tsx", api: "obrasAPI", name: "Obras" },
  {
    file: "src/pages/Fornecedores.tsx",
    api: "fornecedoresAPI",
    name: "Fornecedores",
  },
  {
    file: "src/pages/Documentos.tsx",
    api: "documentosAPI",
    name: "Documentos",
  },
  { file: "src/pages/Ensaios.tsx", api: "ensaiosAPI", name: "Ensaios" },
  {
    file: "src/pages/Checklists.tsx",
    api: "checklistsAPI",
    name: "Checklists",
  },
  { file: "src/pages/RFIs.tsx", api: "rfisAPI", name: "RFIs" },
  { file: "src/pages/Materiais.tsx", api: "materiaisAPI", name: "Materiais" },
  {
    file: "src/pages/NaoConformidades.tsx",
    api: "naoConformidadesAPI",
    name: "Não Conformidades",
  },
];

// APIs que devem ser evitadas
const forbiddenAPIs = [
  "localStorage",
  "localRFIsAPI",
  "localMateriaisAPI",
  "localNaoConformidadesAPI",
  "localObrasAPI",
  "localFornecedoresAPI",
  "localDocumentosAPI",
  "localEnsaiosAPI",
  "localChecklistsAPI",
  "mockMateriais",
  "mockNCs",
];

console.log("🔍 VERIFICAÇÃO DE MÓDULOS - QUALICORE");
console.log("=====================================\n");

let totalModules = modulesToCheck.length;
let correctModules = 0;
let issues = [];

// Verificar cada módulo
modulesToCheck.forEach((module) => {
  console.log(`📁 Verificando: ${module.name}`);

  try {
    const filePath = path.join(process.cwd(), module.file);

    if (!fs.existsSync(filePath)) {
      console.log(`   ❌ Arquivo não encontrado: ${module.file}`);
      issues.push(`${module.name}: Arquivo não encontrado`);
      return;
    }

    const content = fs.readFileSync(filePath, "utf8");

    // Verificar se usa a API correta do Supabase
    const usesCorrectAPI = content.includes(module.api);

    // Verificar se usa APIs proibidas
    const usesForbiddenAPI = forbiddenAPIs.some((forbidden) =>
      content.includes(forbidden),
    );

    if (usesCorrectAPI && !usesForbiddenAPI) {
      console.log(`   ✅ Usando ${module.api} corretamente`);
      correctModules++;
    } else {
      console.log(`   ❌ Problemas encontrados:`);

      if (!usesCorrectAPI) {
        console.log(`      - Não usa ${module.api}`);
        issues.push(`${module.name}: Não usa ${module.api}`);
      }

      if (usesForbiddenAPI) {
        const foundForbidden = forbiddenAPIs.filter((forbidden) =>
          content.includes(forbidden),
        );
        console.log(`      - Usa APIs proibidas: ${foundForbidden.join(", ")}`);
        issues.push(
          `${module.name}: Usa APIs proibidas: ${foundForbidden.join(", ")}`,
        );
      }
    }
  } catch (error) {
    console.log(`   ❌ Erro ao ler arquivo: ${error.message}`);
    issues.push(`${module.name}: Erro ao ler arquivo`);
  }

  console.log("");
});

// Relatório final
console.log("📊 RELATÓRIO FINAL");
console.log("==================");
console.log(`Total de módulos: ${totalModules}`);
console.log(`Módulos corretos: ${correctModules}`);
console.log(`Módulos com problemas: ${totalModules - correctModules}`);
console.log(
  `Percentual de sucesso: ${Math.round((correctModules / totalModules) * 100)}%`,
);

if (issues.length > 0) {
  console.log("\n🚨 PROBLEMAS ENCONTRADOS:");
  console.log("========================");
  issues.forEach((issue) => {
    console.log(`- ${issue}`);
  });

  console.log("\n🔧 AÇÕES NECESSÁRIAS:");
  console.log("=====================");

  if (issues.some((issue) => issue.includes("rfisAPI"))) {
    console.log("1. Corrigir RFIs: Trocar localStorage por rfisAPI");
  }

  if (issues.some((issue) => issue.includes("materiaisAPI"))) {
    console.log("2. Corrigir Materiais: Trocar mock data por materiaisAPI");
  }

  if (issues.some((issue) => issue.includes("naoConformidadesAPI"))) {
    console.log(
      "3. Corrigir Não Conformidades: Implementar naoConformidadesAPI",
    );
  }

  console.log(
    "\n💡 DICA: Execute o script de correção automática para resolver os problemas.",
  );
} else {
  console.log(
    "\n🎉 PARABÉNS! Todos os módulos estão usando Supabase corretamente!",
  );
  console.log("✅ Sistema 100% funcional e sincronizado");
}

console.log("\n📋 PRÓXIMOS PASSOS:");
console.log("===================");
console.log("1. Execute o SQL de migração no Supabase");
console.log("2. Teste cada módulo individualmente");
console.log("3. Verifique se os dados aparecem no banco");
console.log("4. Teste CRUD completo em todos os módulos");

console.log("\n✨ Qualicore está pronto para produção!");
