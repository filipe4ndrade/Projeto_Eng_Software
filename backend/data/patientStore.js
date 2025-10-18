const Patient = require('../src/models/Patient');

let patients = [
    new Patient('João Silva', 35, 'M', 'p1', ['febre']),
    new Patient('Maria Souza', 42, 'F', 'p2', ['fadiga_extrema', 'dor_cabeca']),
    new Patient('Pedro Santos', 60, 'M', 'p3', []),
    new Patient('Alex Santos', 28, 'O', 'p4', ['tosse_seca']),
];


exports.findAll = () => {
    return patients;
};

exports.findById = (id) => {
    return patients.find(p => p.id === id);
};

exports.create = (patientData) => {
    const newId = 'p' + (patients.length + 1); 
    const newPatient = Patient.fromObject({ ...patientData, id: newId });
    patients.push(newPatient);
    return newPatient;
};


exports.update = (id, updates) => {
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    // Criar um novo objeto Patient com os dados atualizados
    const updatedData = { 
        ...patients[index], 
        ...updates, 
        id: id,
        factors: updates.factors || patients[index].factors || []
    };
    
    const updatedPatient = Patient.fromObject(updatedData);
    patients[index] = updatedPatient;
    return patients[index];
};

exports.remove = (id) => {
    const initialLength = patients.length;
    patients = patients.filter(p => p.id !== id);
    return patients.length < initialLength;
};