const { Given, When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');

// Timeout de 2 minutos
setDefaultTimeout(120 * 1000);

const baseUrl = 'http://localhost:3000';
let browser;
let page;

Before(async function () {
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
});

After(async function () {
    if (browser) {
        await browser.close();
    }
});

// Steps básicos para testar o frontend
Given('que o servidor está funcionando', async function () {
    const response = await page.goto(baseUrl);
    if (response.status() >= 400) {
        throw new Error(`Servidor não está funcionando: ${response.status()}`);
    }
});

When('eu acesso a página {string}', async function (path) {
    const fullUrl = `${baseUrl}${path}`;
    console.log(`Acessando: ${fullUrl}`);
    
    const response = await page.goto(fullUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });
    
    // Aguarda carregamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`Status: ${response.status()}, Título: ${await page.title()}`);
});

Then('eu devo ver o título contendo {string}', async function (expectedText) {
    const title = await page.title();
    if (!title.toLowerCase().includes(expectedText.toLowerCase())) {
        throw new Error(`Título esperado conter "${expectedText}", mas encontrado: "${title}"`);
    }
});

Then('eu devo ver o botão {string}', async function (buttonText) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const elements = await page.$$eval('button, input[type="submit"], a', 
        elements => elements.map(el => el.textContent?.trim() || el.value || ''));
    
    const found = elements.some(text => 
        text.includes(buttonText) || text.toLowerCase().includes(buttonText.toLowerCase())
    );
    
    if (!found) {
        throw new Error(`Botão "${buttonText}" não encontrado. Botões disponíveis: ${elements.join(', ')}`);
    }
});

When('eu preencho o campo {string} com {string}', async function (fieldName, value) {
    const field = await page.$(`input[name="${fieldName}"], input[id="${fieldName}"], textarea[name="${fieldName}"]`);
    if (!field) {
        throw new Error(`Campo "${fieldName}" não encontrado`);
    }
    await field.clear();
    await field.type(value);
});

When('eu clico no botão {string}', async function (buttonText) {
    const button = await page.$x(`//button[contains(text(), "${buttonText}")]`);
    if (button.length > 0) {
        await button[0].click();
    } else {
        throw new Error(`Botão "${buttonText}" não encontrado para clicar`);
    }
});