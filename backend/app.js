// backend/app.js
const express = require('express');
const path = require('path');
const patientRoutes = require('./routes/patientRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views')); // Views ficam no frontend

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend/public')));

app.use('/patients', patientRoutes);

app.get('/', (req, res) => {
    res.redirect('/patients');
});

// Se o arquivo for executado diretamente, inicia o servidor
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🦠 Sistema de Triagem COVID-19 rodando em http://localhost:${PORT}`);
        console.log(`📋 Ponto de entrada: http://localhost:${PORT}/patients`);
    });
}

module.exports = app;