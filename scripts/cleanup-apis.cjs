const fs = require("fs");
const path = require("path");

// Função para processar um arquivo
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    // Substituir imports antigos
    const replacements = [
      // PocketBase imports
      {
        from: "import { .* } from '@/lib/pocketbase'",
        to: "// Removed pocketbase import",
      },
      {
        from: "import .* from '@/lib/pocketbase'",
        to: "// Removed pocketbase import",
      },

      // API imports
      { from: "import { .* } from '@/lib/api'", to: "// Removed api import" },
      { from: "import .* from '@/lib/api'", to: "// Removed api import" },

      // Data API imports
      {
        from: "import { .* } from '@/lib/data-api'",
        to: "// Removed data-api import",
      },
      {
        from: "import .* from '@/lib/data-api'",
        to: "// Removed data-api import",
      },

      // Substituir tipos antigos por tipos do Supabase
      { from: "EnsaioRecord", to: "Ensaio" },
      { from: "DocumentoRecord", to: "Documento" },
      { from: "ChecklistRecord", to: "Checklist" },
      { from: "MaterialRecord", to: "Material" },
      { from: "FornecedorRecord", to: "Fornecedor" },
      { from: "NaoConformidadeRecord", to: "NaoConformidade" },
      { from: "ObraRecord", to: "Obra" },
    ];

    replacements.forEach(({ from, to }) => {
      const regex = new RegExp(from, "g");
      if (regex.test(content)) {
        content = content.replace(regex, to);
        modified = true;
      }
    });

    // Adicionar imports corretos se necessário
    if (
      content.includes("Ensaio") ||
      content.includes("Documento") ||
      content.includes("Checklist") ||
      content.includes("Material") ||
      content.includes("Fornecedor") ||
      content.includes("NaoConformidade") ||
      content.includes("Obra")
    ) {
      if (
        !content.includes("import {") ||
        !content.includes("from '@/types'")
      ) {
        const importStatement =
          "import { Ensaio, Documento, Checklist, Material, Fornecedor, NaoConformidade, Obra } from '@/types'\n";
        content = importStatement + content;
        modified = true;
      }
    }

    // Adicionar imports da API do Supabase se necessário
    if (
      content.includes("ensaiosAPI") ||
      content.includes("documentosAPI") ||
      content.includes("checklistsAPI") ||
      content.includes("materiaisAPI") ||
      content.includes("fornecedoresAPI") ||
      content.includes("naoConformidadesAPI") ||
      content.includes("obrasAPI")
    ) {
      if (
        !content.includes("import {") ||
        !content.includes("from '@/lib/supabase-api'")
      ) {
        const apiImport =
          "import { ensaiosAPI, documentosAPI, checklistsAPI, materiaisAPI, fornecedoresAPI, naoConformidadesAPI, obrasAPI } from '@/lib/supabase-api'\n";
        content = apiImport + content;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Função para processar diretório recursivamente
function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.startsWith(".") &&
      file !== "node_modules"
    ) {
      processDirectory(filePath);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      processFile(filePath);
    }
  });
}

// Processar arquivos
console.log("🧹 Cleaning up API references...");
processDirectory("./src");
console.log("✅ Cleanup completed!");
