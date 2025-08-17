import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!')
  console.error('Crie um arquivo .env.local com:')
  console.error('VITE_SUPABASE_URL=sua_url_do_supabase')
  console.error('VITE_SUPABASE_ANON_KEY=sua_chave_anonima')
}

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
