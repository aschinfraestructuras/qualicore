const https = require("https");
const http = require("http");

// Configuration
const POCKETBASE_URL = "http://127.0.0.1:8090";
const ADMIN_EMAIL = "sitecore.quality@gmail.com";
const ADMIN_PASSWORD = "Hercules2.1";

// Simple HTTP client
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === "https:";
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const req = client.request(requestOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testPocketBase() {
  try {
    console.log("🔗 Testando conectividade com PocketBase...\n");

    // Test 1: Health check
    console.log("1. Testando health check...");
    const healthCheck = await makeRequest(`${POCKETBASE_URL}/api/health`);
    console.log(`   Status: ${healthCheck.status}`);
    console.log(`   Response:`, healthCheck.data);
    console.log("");

    // Test 2: Admin auth endpoint
    console.log("2. Testando endpoint de autenticação...");
    try {
      const authResponse = await makeRequest(
        `${POCKETBASE_URL}/api/admins/auth-with-password`,
        {
          method: "POST",
          body: {
            identity: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
          },
        },
      );
      console.log(`   Status: ${authResponse.status}`);
      console.log(`   Response:`, authResponse.data);
    } catch (error) {
      console.log(`   Erro: ${error.message}`);
    }
    console.log("");

    // Test 3: Collections endpoint
    console.log("3. Testando endpoint de coleções...");
    try {
      const collectionsResponse = await makeRequest(
        `${POCKETBASE_URL}/api/collections`,
      );
      console.log(`   Status: ${collectionsResponse.status}`);
      console.log(`   Response:`, collectionsResponse.data);
    } catch (error) {
      console.log(`   Erro: ${error.message}`);
    }
    console.log("");

    // Test 4: Admin interface
    console.log("4. Testando interface admin...");
    try {
      const adminResponse = await makeRequest(`${POCKETBASE_URL}/_/`);
      console.log(`   Status: ${adminResponse.status}`);
      console.log(
        `   Interface admin acessível: ${adminResponse.status === 200}`,
      );
    } catch (error) {
      console.log(`   Erro: ${error.message}`);
    }
    console.log("");

    console.log("📋 URLs importantes:");
    console.log(`   PocketBase: ${POCKETBASE_URL}`);
    console.log(`   Admin: ${POCKETBASE_URL}/_/`);
    console.log(`   API: ${POCKETBASE_URL}/api/`);
  } catch (error) {
    console.error("❌ Erro durante o teste:", error.message);
  }
}

// Run the test
testPocketBase();
