import { createClient } from '@supabase/supabase-js'

// Usar as mesmas credenciais do arquivo supabase.ts existente
const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

export const supabase = createClient(supabaseUrl, supabaseKey)

// Teste de conexão automático
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('trilhos').select('count').limit(1)
    
    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error)
      return false
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!')
    return true
  } catch (error) {
    console.error('❌ Erro ao testar conexão:', error)
    return false
  }
}

export default supabase
