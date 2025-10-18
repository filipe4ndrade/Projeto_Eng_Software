const patientController = require("../../src/controllers/patientController");

// Mock do PatientService
const mockPatientService = {
    getAllPatients: jest.fn(),
    createPatient: jest.fn(),
    deletePatient: jest.fn()
};

jest.mock('../../src/services/PatientService', () => mockPatientService);

describe("Patient Controller", () => {
    let req, res;

    beforeEach(() => {
        req = { 
            body: {}, 
            params: {} 
        };
        res = {
            render: jest.fn(),
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe("listPatients", () => {
        it("deve renderizar lista de pacientes", () => {
            const mockPatients = [
                { id: "p1", name: "João", age: 35 },
                { id: "p2", name: "Maria", age: 28 }
            ];
            mockPatientService.getAllPatients.mockReturnValue(mockPatients);

            patientController.listPatients(req, res);

            expect(mockPatientService.getAllPatients).toHaveBeenCalled();
            expect(res.render).toHaveBeenCalledWith('list-patients', { patients: mockPatients });
        });

        it("deve lidar com lista vazia", () => {
            mockPatientService.getAllPatients.mockReturnValue([]);

            patientController.listPatients(req, res);

            expect(res.render).toHaveBeenCalledWith('list-patients', { patients: [] });
        });
    });

    describe("showNewPatientForm", () => {
        it("deve renderizar formulário de novo paciente", () => {
            patientController.showNewPatientForm(req, res);

            expect(res.render).toHaveBeenCalledWith('new-patient');
        });
    });

    describe("createPatient", () => {
        it("deve criar paciente e redirecionar", () => {
            req.body = { name: "Pedro", age: 40, gender: "M" };
            const mockCreated = { id: "p1", name: "Pedro", age: 40, gender: "M" };
            mockPatientService.createPatient.mockReturnValue(mockCreated);

            patientController.createPatient(req, res);

            expect(mockPatientService.createPatient).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/patients');
        });

        it("deve retornar erro para dados inválidos", () => {
            req.body = { name: "", age: "abc", gender: "X" };
            mockPatientService.createPatient.mockImplementation(() => {
                throw new Error("Dados inválidos");
            });

            patientController.createPatient(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("Erro ao criar paciente: Dados inválidos");
        });

        it("deve lidar com erro de sistema", () => {
            req.body = { name: "João", age: 30, gender: "M" };
            mockPatientService.createPatient.mockImplementation(() => {
                throw new Error("Erro interno");
            });

            patientController.createPatient(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("Erro ao criar paciente: Erro interno");
        });
    });

    describe("deletePatient", () => {
        it("deve deletar paciente existente", () => {
            req.params.id = "p1";
            mockPatientService.deletePatient.mockReturnValue(true);

            patientController.deletePatient(req, res);

            expect(mockPatientService.deletePatient).toHaveBeenCalledWith("p1");
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it("deve retornar 404 para paciente inexistente", () => {
            req.params.id = "inexistente";
            mockPatientService.deletePatient.mockReturnValue(false);

            patientController.deletePatient(req, res);

            expect(mockPatientService.deletePatient).toHaveBeenCalledWith("inexistente");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("Paciente não encontrado.");
        });

        it("deve processar IDs diferentes", () => {
            const testIds = ["p1", "p2", "p999", "abc123"];
            
            testIds.forEach(id => {
                req.params.id = id;
                mockPatientService.deletePatient.mockReturnValue(true);
                
                patientController.deletePatient(req, res);
                
                expect(mockPatientService.deletePatient).toHaveBeenCalledWith(id);
            });
        });
    });
});