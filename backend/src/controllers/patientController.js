const PatientService = require('../services/PatientService');


exports.listPatients = (req, res) => {
    const patients = PatientService.getAllPatients();

    res.render('list-patients', { patients: patients }); 
};


exports.showNewPatientForm = (req, res) => {
    res.render('new-patient');
};


exports.createPatient = (req, res) => {
    try {
        const newPatient = PatientService.createPatient(req.body);

        // Redireciona para a lista de pacientes após criar
        res.redirect('/patients'); 
    } catch (error) {
        res.status(400).send('Erro ao criar paciente: ' + error.message);
    }
};

exports.deletePatient = (req, res) => {
    const success = PatientService.deletePatient(req.params.id);
    if (success) {
        res.status(204).send(); 
    } else {
        res.status(404).send('Paciente não encontrado.');
    }
};