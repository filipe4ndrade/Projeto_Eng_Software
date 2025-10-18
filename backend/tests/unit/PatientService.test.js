const PatientService = require("../../src/services/PatientService");

// Mock manual das dependências
const mockPatientStore = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
};

const mockExternalLabApi = {
    getLabResult: jest.fn()
};

// Substituir as dependências
jest.mock('../../data/patientStore', () => mockPatientStore);
jest.mock('../../api-mock/externalLabApi', () => mockExternalLabApi);

describe("PatientService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("CRUD Operations", () => {
        it("deve retornar todos os pacientes", () => {
            const mockPatients = [
                { id: "p1", name: "João", factors: [] },
                { id: "p2", name: "Maria", factors: ["febre"] }
            ];
            mockPatientStore.findAll.mockReturnValue(mockPatients);

            const result = PatientService.getAllPatients();

            expect(result).toEqual(mockPatients);
            expect(mockPatientStore.findAll).toHaveBeenCalledTimes(1);
        });

        it("deve encontrar paciente por ID", () => {
            const mockPatient = { id: "p1", name: "João", factors: [] };
            mockPatientStore.findById.mockReturnValue(mockPatient);

            const result = PatientService.getPatientById("p1");

            expect(result).toEqual(mockPatient);
            expect(mockPatientStore.findById).toHaveBeenCalledWith("p1");
        });

        it("deve criar novo paciente", () => {
            const patientData = { name: "Pedro", age: 40, gender: "M" };
            const mockCreated = { id: "p1", ...patientData, factors: [] };
            mockPatientStore.create.mockReturnValue(mockCreated);

            const result = PatientService.createPatient(patientData);

            expect(result).toEqual(mockCreated);
            expect(mockPatientStore.create).toHaveBeenCalledWith(patientData);
        });

        it("deve atualizar paciente", () => {
            const updates = { name: "João Silva", factors: ["febre"] };
            const mockUpdated = { id: "p1", name: "João Silva", age: 30, factors: ["febre"] };
            mockPatientStore.update.mockReturnValue(mockUpdated);

            const result = PatientService.updatePatient("p1", updates);

            expect(result).toEqual(mockUpdated);
            expect(mockPatientStore.update).toHaveBeenCalledWith("p1", updates);
        });

        it("deve deletar paciente", () => {
            mockPatientStore.remove.mockReturnValue(true);

            const result = PatientService.deletePatient("p1");

            expect(result).toBe(true);
            expect(mockPatientStore.remove).toHaveBeenCalledWith("p1");
        });
    });

    describe("Risk Evaluation", () => {
        it("deve avaliar risco de paciente com sucesso", async () => {
            const mockPatient = { 
                id: "p1", 
                name: "João", 
                factors: ["febre", "tosse_seca"] 
            };
            const mockLabResult = { result: "positive", confidence: 0.85 };

            mockPatientStore.findById.mockReturnValue(mockPatient);
            mockExternalLabApi.getLabResult.mockResolvedValue(mockLabResult);

            const result = await PatientService.evaluatePatientRisk("p1");

            expect(result).toHaveProperty("patient", mockPatient);
            expect(result).toHaveProperty("riskProbability");
            expect(result).toHaveProperty("labResult", "positive");
            expect(typeof result.riskProbability).toBe("number");
            expect(result.riskProbability).toBeGreaterThan(0);
            expect(mockExternalLabApi.getLabResult).toHaveBeenCalledWith("p1", expect.any(Number));
        });

        it("deve lançar erro para paciente inexistente", async () => {
            mockPatientStore.findById.mockReturnValue(null);

            await expect(PatientService.evaluatePatientRisk("inexistente"))
                .rejects
                .toThrow("Paciente não encontrado");

            expect(mockPatientStore.findById).toHaveBeenCalledWith("inexistente");
        });

        it("deve calcular risco maior com múltiplos sintomas", async () => {
            const mockPatientComSintomas = { 
                id: "p1", 
                name: "João", 
                factors: ["febre", "tosse_seca", "dificuldade_respiratoria"] 
            };
            const mockPatientSemSintomas = { 
                id: "p2", 
                name: "Maria", 
                factors: [] 
            };
            const mockLabResult = { result: "positive", confidence: 0.85 };

            mockExternalLabApi.getLabResult.mockResolvedValue(mockLabResult);

            // Testar paciente com sintomas
            mockPatientStore.findById.mockReturnValueOnce(mockPatientComSintomas);
            const resultComSintomas = await PatientService.evaluatePatientRisk("p1");

            // Testar paciente sem sintomas
            mockPatientStore.findById.mockReturnValueOnce(mockPatientSemSintomas);
            const resultSemSintomas = await PatientService.evaluatePatientRisk("p2");

            expect(resultComSintomas.riskProbability).toBeGreaterThan(resultSemSintomas.riskProbability);
        });
    });
});