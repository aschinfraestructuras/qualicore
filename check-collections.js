const https = require('https');
const http = require('http');

const POCKETBASE_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'sitecore.quality@gmail.com';
const ADMIN_PASSWORD = 'Hercules2.1';

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

async function checkCollections() {
  try {
    console.log('🔗 Conectando ao PocketBase...');
    
    // Test connection
    const healthCheck = await makeRequest(`${POCKETBASE_URL}/api/health`);
    if (healthCheck.status !== 200) {
      throw new Error('PocketBase não está acessível');
    }
    console.log('✅ PocketBase está acessível');
    
    // Authenticate
    console.log('🔐 Autenticando...');
    const authResponse = await makeRequest(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
      method: 'POST',
      body: {
        identity: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      }
    });
    
    if (authResponse.status !== 200) {
      throw new Error('Falha na autenticação: ' + JSON.stringify(authResponse.data));
    }
    
    console.log('✅ Autenticação bem-sucedida!');
    const token = authResponse.data.token;
    
    // Get collections
    console.log('📋 Verificando coleções...');
    const collectionsResponse = await makeRequest(`${POCKETBASE_URL}/api/collections`, {
      headers: {
        'Authorization': token
      }
    });
    
    if (collectionsResponse.status !== 200) {
      throw new Error('Erro ao buscar coleções: ' + JSON.stringify(collectionsResponse.data));
    }
    
    const collections = collectionsResponse.data.items;
    console.log('\n📝 Coleções existentes:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name} (${collection.type})`);
    });
    
    const obrasExists = collections.some(c => c.name === 'obras');
    if (obrasExists) {
      console.log('\n✅ Coleção "obras" existe!');
    } else {
      console.log('\n❌ Coleção "obras" NÃO existe!');
      console.log('\n💡 Para criar a coleção "obras":');
      console.log('   1. Abra o PocketBase Admin: http://localhost:8090/_/');
      console.log('   2. Faça login com as credenciais admin');
      console.log('   3. Vá para "Collections"');
      console.log('   4. Clique em "New collection"');
      console.log('   5. Nome: obras');
      console.log('   6. Type: Base');
      console.log('   7. Adicione os campos necessários');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkCollections(); 