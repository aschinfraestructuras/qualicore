const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupChecklistPontos() {
  console.log("🔧 Configurando tabela checklist_pontos...");

  try {
    // Ler o arquivo SQL
    const sql = fs.readFileSync("create-checklist-pontos.sql", "utf8");

    // Executar o SQL
    const { data, error } = await supabase.rpc("exec_sql", { sql });

    if (error) {
      console.log("❌ Erro ao executar SQL:", error.message);
      console.log("💡 Execute o SQL manualmente no Supabase SQL Editor:");
      console.log(sql);
    } else {
      console.log("✅ Tabela checklist_pontos criada com sucesso!");
    }
  } catch (error) {
    console.error("❌ Erro:", error.message);
    console.log("💡 Execute o SQL manualmente no Supabase SQL Editor");
  }
}

setupChecklistPontos();
