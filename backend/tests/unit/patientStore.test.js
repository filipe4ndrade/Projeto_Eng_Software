const patientStore = require("../../data/patientStore");
const Patient = require("../../src/models/Patient");

describe("PatientStore", () => {
    let originalPatients;

    beforeEach(() => {
        // Backup dos pacientes originais
        originalPatients = [...patientStore.findAll()];
        
        // Limpar store de forma segura
        const allPatients = patientStore.findAll();
        allPatients.forEach(patient => {
            patientStore.remove(patient.id);
        });
    });

    afterEach(() => {
        // Restaurar estado original para não afetar outros testes
        const allPatients = patientStore.findAll();
        allPatients.forEach(patient => {
            patientStore.remove(patient.id);
        });
    });

    describe("CRUD Operations", () => {
        it("deve criar paciente com ID sequencial", () => {
            const patientData = { name: "João", age: 30, gender: "M" };

            const created = patientStore.create(patientData);

            expect(created.name).toBe("João");
            expect(created.age).toBe(30);
            expect(created.gender).toBe("M");
            expect(created.id).toBe("p1"); // Primeiro paciente após limpeza
        });

        it("deve encontrar paciente por ID", () => {
            const created = patientStore.create({ name: "Maria", age: 25, gender: "F" });
            
            const found = patientStore.findById(created.id);

            expect(found).toEqual(created);
        });

        it("deve retornar todos os pacientes", () => {
            const patient1 = patientStore.create({ name: "João", age: 30, gender: "M" });
            const patient2 = patientStore.create({ name: "Maria", age: 25, gender: "F" });

            const all = patientStore.findAll();

            expect(all).toHaveLength(2);
            expect(all).toContain(patient1);
            expect(all).toContain(patient2);
        });

        it("deve atualizar paciente existente", () => {
            const created = patientStore.create({ name: "João", age: 30, gender: "M" });
            const updates = { name: "João Silva", factors: ["febre"] };

            const updated = patientStore.update(created.id, updates);

            expect(updated.name).toBe("João Silva");
            expect(updated.factors).toEqual(["febre"]);
            expect(updated.id).toBe(created.id);
        });

        it("deve remover paciente existente", () => {
            const created = patientStore.create({ name: "João", age: 30, gender: "M" });

            const removed = patientStore.remove(created.id);

            expect(removed).toBe(true);
            expect(patientStore.findById(created.id)).toBeUndefined();
        });

        it("deve retornar false ao remover ID inexistente", () => {
            const result = patientStore.remove("inexistente");

            expect(result).toBe(false);
        });
    });
});