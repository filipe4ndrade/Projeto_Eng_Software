const express = require('express');
const router = express.Router();
const patientController = require('../src/controllers/patientController');
const evaluationController = require('../src/controllers/evaluationController');


// Tela 1: Listar todos os pacientes
router.get('/', patientController.listPatients); 

// Tela 2: Mostrar formulário para novo paciente
router.get('/new', patientController.showNewPatientForm);

// Criar novo paciente
router.post('/', patientController.createPatient); 

// Remover paciente (Usando API)
router.delete('/api/:id', patientController.deletePatient); 

// Tela 3: Mostrar a avaliação de risco do paciente
router.get('/:id/evaluate', evaluationController.showEvaluation);

// Atualizar fatores de risco
router.post('/:id/factors', evaluationController.updateFactors);

module.exports = router;