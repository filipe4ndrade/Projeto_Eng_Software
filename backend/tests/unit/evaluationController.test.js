const evaluationController = require("../../src/controllers/evaluationController");

// Mock do PatientService
const mockPatientService = {
    evaluatePatientRisk: jest.fn(),
    updatePatient: jest.fn()
};

// Mock das probabilidades
const mockProbabilities = {
    factors: {
        febre: { P_S_given_D: 0.87, P_S_given_not_D: 0.12 },
        tosse_seca: { P_S_given_D: 0.68, P_S_given_not_D: 0.08 }
    },
    symptomInfo: {
        febre: "Temperatura elevada",
        tosse_seca: "Tosse persistente sem catarro"
    }
};

jest.mock('../../src/services/PatientService', () => mockPatientService);
jest.mock('../../data/probabilities', () => mockProbabilities);

describe("Evaluation Controller", () => {
    let req, res;
    
    // Mock do console para evitar logs nos testes
    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        console.log.mockRestore();
        console.error.mockRestore();
    });

    beforeEach(() => {
        req = { 
            params: {}, 
            body: {} 
        };
        res = {
            render: jest.fn(),
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe("showEvaluation", () => {
        it("deve renderizar avaliação de paciente com sucesso", async () => {
            req.params.id = "p1";
            const mockEvaluation = {
                patient: { id: "p1", name: "João", factors: ["febre"] },
                riskProbability: 0.35,
                labResult: "negative"
            };
            mockPatientService.evaluatePatientRisk.mockResolvedValue(mockEvaluation);

            await evaluationController.showEvaluation(req, res);

            expect(mockPatientService.evaluatePatientRisk).toHaveBeenCalledWith("p1");
            expect(res.render).toHaveBeenCalledWith('evaluation-screen', {
                patient: mockEvaluation.patient,
                risk: "35.00",
                availableFactors: ["febre", "tosse_seca"],
                symptomInfo: mockProbabilities.symptomInfo,
                labResult: "negative"
            });
        });

        it("deve lidar com erro de paciente não encontrado", async () => {
            req.params.id = "inexistente";
            mockPatientService.evaluatePatientRisk.mockRejectedValue(
                new Error("Paciente não encontrado")
            );

            await evaluationController.showEvaluation(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("Erro na avaliação: Paciente não encontrado");
        });

        it("deve formatar risco como porcentagem", async () => {
            req.params.id = "p1";
            const mockEvaluation = {
                patient: { id: "p1", name: "João", factors: [] },
                riskProbability: 0.7832,
                labResult: "positive"
            };
            mockPatientService.evaluatePatientRisk.mockResolvedValue(mockEvaluation);

            await evaluationController.showEvaluation(req, res);

            const renderCall = res.render.mock.calls[0];
            expect(renderCall[1].risk).toBe("78.32");
        });
    });

    describe("updateFactors", () => {
        it("deve atualizar fatores e redirecionar", () => {
            req.params.id = "p1";
            req.body.factors = ["febre", "tosse_seca"];
            const mockUpdated = { id: "p1", name: "João", factors: ["febre", "tosse_seca"] };
            mockPatientService.updatePatient.mockReturnValue(mockUpdated);

            evaluationController.updateFactors(req, res);

            expect(mockPatientService.updatePatient).toHaveBeenCalledWith("p1", {
                factors: ["febre", "tosse_seca"]
            });
            expect(res.redirect).toHaveBeenCalledWith("/patients/p1/evaluate");
        });

        it("deve lidar com fator único como string", () => {
            req.params.id = "p1";
            req.body.factors = "febre"; // String única
            const mockUpdated = { id: "p1", name: "João", factors: ["febre"] };
            mockPatientService.updatePatient.mockReturnValue(mockUpdated);

            evaluationController.updateFactors(req, res);

            expect(mockPatientService.updatePatient).toHaveBeenCalledWith("p1", {
                factors: ["febre"]
            });
        });

        it("deve lidar com nenhum fator selecionado", () => {
            req.params.id = "p1";
            req.body = {}; // Sem factors
            const mockUpdated = { id: "p1", name: "João", factors: [] };
            mockPatientService.updatePatient.mockReturnValue(mockUpdated);

            evaluationController.updateFactors(req, res);

            expect(mockPatientService.updatePatient).toHaveBeenCalledWith("p1", {
                factors: []
            });
        });

        it("deve retornar 404 para paciente inexistente", () => {
            req.params.id = "inexistente";
            req.body.factors = ["febre"];
            mockPatientService.updatePatient.mockReturnValue(null);

            evaluationController.updateFactors(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("Paciente não encontrado.");
        });

        it("deve lidar com erro na atualização", () => {
            req.params.id = "p1";
            req.body.factors = ["febre"];
            mockPatientService.updatePatient.mockImplementation(() => {
                throw new Error("Erro interno");
            });

            evaluationController.updateFactors(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("Erro ao atualizar fatores: Erro interno");
        });
    });
});