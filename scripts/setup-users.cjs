// Script para criar usuários de demo no PocketBase
const PocketBase = require('pocketbase/cjs')

const PB_URL = 'http://127.0.0.1:8090'
const ADMIN_EMAIL = 'sitecore.quality@gmail.com'
const ADMIN_PASSWORD = 'Hercules2.1'

const demoUsers = [
  {
    email: 'admin@qualicore.pt',
    password: 'admin123',
    passwordConfirm: 'admin123',
    nome: 'Administrador',
    perfil: 'admin',
    verified: true
  },
  {
    email: 'qualidade@qualicore.pt',
    password: 'qualidade123',
    passwordConfirm: 'qualidade123',
    nome: 'Engenheiro de Qualidade',
    perfil: 'qualidade',
    verified: true
  },
  {
    email: 'producao@qualicore.pt',
    password: 'producao123',
    passwordConfirm: 'producao123',
    nome: 'Responsável de Produção',
    perfil: 'producao',
    verified: true
  },
  {
    email: 'fiscal@qualicore.pt',
    password: 'fiscal123',
    passwordConfirm: 'fiscal123',
    nome: 'Fiscal de Obra',
    perfil: 'fiscal',
    verified: true
  }
]

async function setupUsers() {
  const pb = new PocketBase(PB_URL)
  
  try {
    // Login como admin
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD)
    console.log('✅ Login como admin realizado')
    
    // Verificar se a coleção users existe
    try {
      await pb.collections.getOne('users')
      console.log('✅ Coleção users encontrada')
    } catch (error) {
      console.log('❌ Coleção users não encontrada. Criando...')
      
      // Criar coleção users
      const usersCollection = {
        name: 'users',
        type: 'auth',
        schema: [
          {
            name: 'nome',
            type: 'text',
            required: true
          },
          {
            name: 'perfil',
            type: 'select',
            required: true,
            options: {
              values: ['admin', 'qualidade', 'producao', 'fiscal']
            }
          },
          {
            name: 'avatar',
            type: 'file',
            options: {
              maxSelect: 1,
              maxSize: 5242880,
              mimeTypes: ['image/jpeg', 'image/png', 'image/webp']
            }
          }
        ]
      }
      
      await pb.collections.create(usersCollection)
      console.log('✅ Coleção users criada')
    }
    
    // Criar usuários de demo
    for (const user of demoUsers) {
      try {
        await pb.collection('users').create(user)
        console.log(`✅ Usuário ${user.email} criado`)
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️ Usuário ${user.email} já existe`)
        } else {
          console.error(`❌ Erro ao criar usuário ${user.email}:`, error.message)
        }
      }
    }
    
    console.log('\n🎉 Setup de usuários concluído!')
    console.log('\n📋 Credenciais de acesso:')
    demoUsers.forEach(user => {
      console.log(`${user.perfil}: ${user.email} / ${user.password}`)
    })
    
  } catch (error) {
    console.error('❌ Erro no setup:', error.message)
  }
}

setupUsers() 