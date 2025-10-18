const http = require('http');

function checkServer(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Timeout: Servidor não respondeu em ${timeout}ms`));
        }, timeout);

        const req = http.get(url, (res) => {
            clearTimeout(timer);
            console.log(`Servidor respondeu com status: ${res.statusCode}`);
            resolve(true);
        });

        req.on('error', (err) => {
            clearTimeout(timer);
            console.log(`Erro ao conectar: ${err.message}`);
            reject(err);
        });
    });
}

async function main() {
    const serverUrl = 'http://localhost:3000';
    console.log(`Verificando servidor em ${serverUrl}...`);
    
    try {
        await checkServer(serverUrl);
        console.log('Servidor está funcionando! Pode executar os testes.');
        process.exit(0);
    } catch (error) {
        console.log('Servidor não está rodando.');
        console.log('Inicie o servidor com: cd backend && npm start');
        process.exit(1);
    }
}

main();