const http = require('http');

const POCKETBASE_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'sitecore.quality@gmail.com';
const ADMIN_PASSWORD = 'Hercules2.1';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = http;
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

// Função para autenticar tentando ambos os endpoints
async function authenticate() {
  // Primeiro tenta o endpoint mais novo
  let auth = await makeRequest(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
    method: 'POST',
    body: { identity: ADMIN_EMAIL, password: ADMIN_PASSWORD }
  });
  if (auth.status === 404) {
    // Tenta o endpoint alternativo
    auth = await makeRequest(`${POCKETBASE_URL}/api/admins/auth`, {
      method: 'POST',
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
    });
  }
  return auth;
}

async function main() {
  // 1. Autenticar
  const auth = await authenticate();
  if (auth.status !== 200) {
    console.error('Erro ao autenticar:', auth.data);
    process.exit(1);
  }
  const token = auth.data.token;

  // 2. Criar coleção "obras"
  const body = {
    name: "obras",
    type: "base",
    schema: [
      { name: "codigo", type: "text", required: true },
      { name: "nome", type: "text", required: true },
      { name: "cliente", type: "text" },
      { name: "localizacao", type: "text" },
      { name: "data_inicio", type: "date" },
      { name: "data_fim_prevista", type: "date" },
      { name: "valor_contrato", type: "number" },
      { name: "valor_executado", type: "number" },
      { name: "percentual_execucao", type: "number" },
      { name: "status", type: "select", options: { values: ["planeamento", "em_execucao", "paralisada", "concluida", "cancelada"] } },
      { name: "tipo_obra", type: "select", options: { values: ["residencial", "comercial", "industrial", "infraestrutura", "reabilitacao", "outro"] } },
      { name: "categoria", type: "select", options: { values: ["pequena", "media", "grande", "mega"] } },
      { name: "responsavel_tecnico", type: "text" },
      { name: "coordenador_obra", type: "text" },
      { name: "fiscal_obra", type: "text" },
      { name: "engenheiro_responsavel", type: "text" },
      { name: "arquiteto", type: "text" },
      { name: "zonas", type: "json" },
      { name: "fases", type: "json" },
      { name: "equipas", type: "json" },
      { name: "fornecedores_principais", type: "json" },
      { name: "riscos", type: "json" },
      { name: "indicadores", type: "json" },
      { name: "responsavel", type: "text" },
      { name: "zona", type: "text" },
      { name: "estado", type: "text" },
      { name: "observacoes", type: "text" }
    ]
  };

  const create = await makeRequest(`${POCKETBASE_URL}/api/collections`, {
    method: 'POST',
    headers: { 'Authorization': token },
    body
  });

  if (create.status === 200) {
    console.log('✅ Coleção "obras" criada com sucesso!');
  } else if (create.status === 400 && create.data?.data?.name?.code === "validation_collection_name_exists") {
    console.log('⚠️  Coleção "obras" já existe.');
  } else {
    console.error('Erro ao criar coleção:', create.data);
  }
}

main(); 