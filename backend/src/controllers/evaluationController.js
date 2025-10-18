const PatientService = require('../services/PatientService');
const { factors, symptomInfo } = require('../../data/probabilities');

exports.showEvaluation = async (req, res) => {
    const patientId = req.params.id;
    console.log('=== DEBUG: showEvaluation ===');
    console.log('Patient ID recebido:', patientId);
    
    try {
        console.log('Tentando obter avaliação do paciente...');
        const evaluation = await PatientService.evaluatePatientRisk(patientId);
        console.log('Avaliação obtida:', evaluation);
        
        const renderData = {
            patient: evaluation.patient,
            risk: (evaluation.riskProbability * 100).toFixed(2), 
            availableFactors: Object.keys(factors),
            symptomInfo: symptomInfo,
            labResult: evaluation.labResult
        };
        
        console.log('Dados para renderização:', renderData);
        
        res.render('evaluation-screen', renderData);
    } catch (error) {
        console.error('=== ERRO na avaliação ===');
        console.error('Erro completo:', error);
        console.error('Stack trace:', error.stack);
        res.status(404).send('Erro na avaliação: ' + error.message);
    }
};

exports.updateFactors = (req, res) => {
    const patientId = req.params.id;
    let { factors } = req.body;
    
    console.log('Dados recebidos do formulário:', req.body); // Log completo
    console.log('Factors antes do processamento:', factors);
    console.log('Tipo de factors:', typeof factors);
    
    // Garantir que factors seja sempre um array
    if (!factors) {
        factors = []; // Nenhum fator selecionado
    } else if (typeof factors === 'string') {
        factors = [factors]; // Um único fator selecionado
    }
    // Se factors já for um array, mantém como está
    
    console.log('Factors após processamento:', factors); // Para debug
    
    try {
        const updatedPatient = PatientService.updatePatient(patientId, { factors: factors });
        console.log('Paciente atualizado:', updatedPatient);
        
        if (updatedPatient) {
            res.redirect(`/patients/${patientId}/evaluate`); 
        } else {
            res.status(404).send('Paciente não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao atualizar paciente:', error);
        res.status(400).send('Erro ao atualizar fatores: ' + error.message);
    }
};