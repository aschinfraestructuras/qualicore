// Script de teste para verificar a configuração do Supabase
// Execute com: node test-supabase.cjs

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log("🧪 Testando configuração do Supabase...\n");

  try {
    // Teste 1: Verificar conexão
    console.log("1️⃣ Testando conexão...");
    const { data, error } = await supabase
      .from("obras")
      .select("count")
      .limit(1);
    if (error) {
      console.log("❌ Erro na conexão:", error.message);
      return;
    }
    console.log("✅ Conexão estabelecida com sucesso");

    // Teste 2: Verificar tabelas
    console.log("\n2️⃣ Verificando tabelas...");
    const tables = [
      "obras",
      "fornecedores",
      "materiais",
      "ensaios",
      "checklists",
      "documentos",
      "nao_conformidades",
      "rfis",
      "zonas",
    ];

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select("id").limit(1);
        if (error) {
          console.log(`❌ Tabela ${table}: ${error.message}`);
        } else {
          console.log(`✅ Tabela ${table}: OK`);
        }
      } catch (err) {
        console.log(`❌ Tabela ${table}: ${err.message}`);
      }
    }

    // Teste 3: Verificar autenticação
    console.log("\n3️⃣ Testando autenticação...");
    const { data: authData, error: authError } =
      await supabase.auth.getSession();
    if (authError) {
      console.log("❌ Erro na autenticação:", authError.message);
    } else {
      console.log("✅ Autenticação configurada corretamente");
    }

    // Teste 4: Verificar RLS
    console.log("\n4️⃣ Verificando RLS...");
    try {
      const { error } = await supabase.from("obras").select("*");
      if (error && error.message.includes("permission")) {
        console.log(
          "✅ RLS está ativo (esperado para usuário não autenticado)",
        );
      } else {
        console.log("⚠️ RLS pode não estar configurado corretamente");
      }
    } catch (err) {
      console.log("✅ RLS está ativo");
    }

    console.log("\n🎉 Teste concluído!");
    console.log("\n📋 Próximos passos:");
    console.log("1. Execute o script SQL completo no Supabase");
    console.log("2. Configure a autenticação no dashboard");
    console.log("3. Teste o registro de usuário");
    console.log("4. Teste as funcionalidades do frontend");
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
  }
}

// Executar teste
testSupabase();
