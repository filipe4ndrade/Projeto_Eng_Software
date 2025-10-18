const patientStore = require('../../data/patientStore');
const externalLabApi = require('../../api-mock/externalLabApi');
const { P_D, factors } = require('../../data/probabilities');

class PatientService {

  
    static getAllPatients() {
         return patientStore.findAll();
         }

    static getPatientById(id) {
         return patientStore.findById(id);
         }

    static createPatient(patientData) { 
        return patientStore.create(patientData);
     }

    static updatePatient(id, updates) {
         return patientStore.update(id, updates); 
        }

    static deletePatient(id) { 
        return patientStore.remove(id); 
    }

    

    static #calculateBayesSingle(factor, current_P_D) {
        const factorData = factors[factor];
        if (!factorData) return current_P_D;

        const P_S_given_D = factorData.P_S_given_D;
        const P_S_given_not_D = factorData.P_S_given_not_D;
        const current_P_not_D = 1 - current_P_D;

        // P(S) = P(S|D)*P(D) + P(S|não D)*P(não D)
        const P_S = (P_S_given_D * current_P_D) + (P_S_given_not_D * current_P_not_D);

        if (P_S === 0) return current_P_D;

        // P(D|S) = [ P(S|D) * P(D) ] / P(S)
        return (P_S_given_D * current_P_D) / P_S;
    }

    static #evaluateRiskInternal(patientFactors) {
        let currentProbability = P_D; // Começa com a prevalência 

        for (const factor of patientFactors) {
            currentProbability = PatientService.#calculateBayesSingle(factor, currentProbability);
        }
        return currentProbability;
    }


    static async evaluatePatientRisk(patientId) {
        const patient = PatientService.getPatientById(patientId); // Usa o static
        if (!patient) {
            throw new Error('Paciente não encontrado');
        }

        // 1. Aplica o Teorema Bayesiano Localmente
        const probability = PatientService.#evaluateRiskInternal(patient.factors);
        
        // 2. Mock da Comunicação com API Externa (agora passa o risco calculado)
        const labResult = await externalLabApi.getLabResult(patientId, probability);
        
        return {
            patient,
            riskProbability: probability,
            labResult: labResult.result
        };
    }
}

module.exports = PatientService;