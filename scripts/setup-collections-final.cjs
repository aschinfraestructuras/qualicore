const https = require('https');
const http = require('http');

// Configuration
const POCKETBASE_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'sitecore.quality@gmail.com';
const ADMIN_PASSWORD = 'Hercules2.1';

// Simple HTTP client
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function setupCollections() {
  try {
    console.log('🔗 Conectando ao PocketBase...');
    
    // Test connection
    const healthCheck = await makeRequest(`${POCKETBASE_URL}/api/health`);
    if (healthCheck.status !== 200) {
      throw new Error('PocketBase não está acessível');
    }
    console.log('✅ PocketBase está acessível');
    
    // Authenticate - CORRECTED ENDPOINT
    console.log('🔐 Autenticando...');
    const authResponse = await makeRequest(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      body: {
        identity: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      }
    });
    
    if (authResponse.status !== 200) {
      console.log('❌ Falha na autenticação. Tentando endpoint alternativo...');
      
      // Try alternative endpoint
      const authResponse2 = await makeRequest(`${POCKETBASE_URL}/api/admins/auth`, {
        method: 'POST',
        body: {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD
        }
      });
      
      if (authResponse2.status !== 200) {
        throw new Error('Falha na autenticação: ' + JSON.stringify(authResponse2.data));
      }
      
      console.log('✅ Autenticação bem-sucedida (endpoint alternativo)!');
    } else {
      console.log('✅ Autenticação bem-sucedida!');
    }
    
    // Autenticação bem-sucedida!
    let adminToken = (authResponse.status === 200 ? authResponse.data.token : authResponse2.data.token);

    // Função para criar coleção se não existir
    async function createCollection(name, schema) {
      const res = await makeRequest(`${POCKETBASE_URL}/api/collections`, {
        method: 'POST',
        headers: { 'Authorization': adminToken ? `Bearer ${adminToken}` : undefined },
        body: {
          name,
          type: 'base',
          schema,
        }
      });
      if (res.status === 200) {
        console.log(`✅ Coleção '${name}' criada!`);
      } else if (res.data?.code === 400 && res.data?.data?.name?.code === 'validation_collection_name_exists') {
        console.log(`⚠️  Coleção '${name}' já existe.`);
      } else {
        console.log(`❌ Erro ao criar coleção '${name}':`, res.data);
      }
    }

    // Criar coleção 'obras'
    await createCollection('obras', [
      { name: 'codigo', type: 'text', required: true },
      { name: 'nome', type: 'text', required: true },
      { name: 'cliente', type: 'text' },
      { name: 'localizacao', type: 'text' },
      { name: 'data_inicio', type: 'date' },
      { name: 'data_fim_prevista', type: 'date' },
      { name: 'valor_contrato', type: 'number' },
      { name: 'valor_executado', type: 'number' },
      { name: 'percentual_execucao', type: 'number' },
      { name: 'status', type: 'select', options: { values: ['planeamento','em_execucao','paralisada','concluida','cancelada'] } },
      { name: 'tipo_obra', type: 'select', options: { values: ['residencial','comercial','industrial','infraestrutura'] } },
      { name: 'categoria', type: 'text' },
      { name: 'responsavel_tecnico', type: 'text' },
      { name: 'coordenador_obra', type: 'text' },
      { name: 'fiscal_obra', type: 'text' },
      { name: 'engenheiro_responsavel', type: 'text' },
      { name: 'arquiteto', type: 'text' },
      { name: 'zonas', type: 'json' },
      { name: 'fases', type: 'json' },
      { name: 'equipas', type: 'json' },
      { name: 'observacoes', type: 'text' }
    ]);

    console.log('\n🎯 Para iniciar a aplicação:');
    console.log('   npm run dev');
    return;
    
    // For now, let's create collections manually via the admin interface
    console.log('\n📋 Como o endpoint de autenticação não está funcionando,');
    console.log('vou criar as coleções manualmente via interface admin.');
    
    console.log('\n🔗 Abra o PocketBase Admin:');
    console.log(`   ${POCKETBASE_URL}/_/`);
    console.log('\n📧 Login com:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    
    console.log('\n📝 Coleções a criar:');
    console.log('   1. documentos');
    console.log('   2. checklists');
    console.log('   3. ensaios');
    console.log('   4. fornecedores');
    console.log('   5. materiais');
    console.log('   6. nao_conformidades');
    
    console.log('\n💡 Instruções:');
    console.log('   1. Vá para "Collections" no menu lateral');
    console.log('   2. Clique em "New collection"');
    console.log('   3. Crie cada coleção com os campos necessários');
    console.log('   4. Depois execute: npm run dev');
    
    console.log('\n🎯 Para iniciar a aplicação:');
    console.log('   npm run dev');
    
  } catch (error) {
    console.error('❌ Erro durante o setup:', error.message);
    
    if (error.message.includes('Failed to fetch')) {
      console.log('\n💡 Certifique-se de que:');
      console.log('   1. O PocketBase está a correr em', POCKETBASE_URL);
      console.log('   2. O servidor está acessível');
      console.log('   3. Não há firewall a bloquear a conexão');
    }
  }
}

// Run the setup
setupCollections(); 