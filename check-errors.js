// Script para verificar erros no site
const puppeteer = require('puppeteer');

async function checkSiteErrors() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Capturar erros do console
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({
        type: 'Console Error',
        message: msg.text(),
        location: msg.location()
      });
    }
  });

  // Capturar erros de rede
  page.on('pageerror', error => {
    errors.push({
      type: 'Page Error',
      message: error.message,
      stack: error.stack
    });
  });

  try {
    console.log('🔍 Verificando erros no site...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Aguardar um pouco para capturar erros dinâmicos
    await page.waitForTimeout(3000);
    
    if (errors.length === 0) {
      console.log('✅ Nenhum erro encontrado!');
    } else {
      console.log(`❌ Encontrados ${errors.length} erros:`);
      errors.forEach((error, index) => {
        console.log(`\n${index + 1}. ${error.type}:`);
        console.log(`   Mensagem: ${error.message}`);
        if (error.location) {
          console.log(`   Localização: ${error.location.url}:${error.location.lineNumber}`);
        }
      });
    }
  } catch (error) {
    console.error('❌ Erro ao verificar o site:', error.message);
  }
  
  await browser.close();
}

checkSiteErrors();
