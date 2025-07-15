const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log("🔍 Testando autenticação...");

  try {
    // 1. Verificar sessão atual
    console.log("\n1. Verificando sessão atual...");
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.log("❌ Erro ao verificar sessão:", sessionError.message);
    } else if (session) {
      console.log("✅ Sessão encontrada!");
      console.log("   Usuário:", session.user.email);
      console.log("   ID:", session.user.id);
      console.log(
        "   Expira em:",
        new Date(session.expires_at * 1000).toLocaleString(),
      );
    } else {
      console.log("❌ Nenhuma sessão encontrada");
    }

    // 2. Verificar usuário atual
    console.log("\n2. Verificando usuário atual...");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.log("❌ Erro ao verificar usuário:", userError.message);
    } else if (user) {
      console.log("✅ Usuário encontrado!");
      console.log("   Email:", user.email);
      console.log("   ID:", user.id);
    } else {
      console.log("❌ Nenhum usuário encontrado");
    }

    // 3. Tentar fazer login com credenciais conhecidas
    console.log("\n3. Tentando login...");
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: "admin@qualicore.pt",
        password: "admin123",
      });

    if (loginError) {
      console.log("❌ Erro no login:", loginError.message);
    } else if (loginData.user) {
      console.log("✅ Login bem-sucedido!");
      console.log("   Usuário:", loginData.user.email);
      console.log("   ID:", loginData.user.id);

      // 4. Testar criação de um documento simples
      console.log("\n4. Testando criação de documento...");
      const { data: docData, error: docError } = await supabase
        .from("documentos")
        .insert([
          {
            codigo: "TEST-001",
            tipo: "projeto",
            versao: "1.0",
            responsavel: "Teste",
            zona: "Teste",
            estado: "pendente",
            user_id: loginData.user.id,
          },
        ])
        .select()
        .single();

      if (docError) {
        console.log("❌ Erro ao criar documento:", docError.message);
      } else {
        console.log("✅ Documento criado com sucesso!");
        console.log("   ID:", docData.id);
        console.log("   Código:", docData.codigo);
      }
    }
  } catch (error) {
    console.error("❌ Erro geral:", error.message);
  }
}

testAuth();
