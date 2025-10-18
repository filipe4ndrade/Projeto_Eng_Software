const Patient = require("../../src/models/Patient");

describe("Patient Model", () => {
    describe("Constructor", () => {
        it("deve criar paciente com dados válidos", () => {
            const patient = new Patient("João Silva", 35, "M", "p1");

            expect(patient.name).toBe("João Silva");
            expect(patient.age).toBe(35);
            expect(patient.gender).toBe("M");
            expect(patient.id).toBe("p1");
            expect(patient.factors).toEqual([]);
        });

        it("deve aceitar factors no constructor", () => {
            const factors = ["febre", "tosse_seca"];
            const patient = new Patient("Maria", 28, "F", "p2", factors);

            expect(patient.factors).toEqual(factors);
        });
    });

    describe("fromObject", () => {
        it("deve criar paciente a partir de objeto válido", () => {
            const obj = {
                name: "Ana Costa",
                age: "32",
                gender: "F",
                id: "p5"
            };

            const patient = Patient.fromObject(obj);

            expect(patient.name).toBe("Ana Costa");
            expect(patient.age).toBe(32); // Convertido para número
            expect(patient.gender).toBe("F");
            expect(patient.id).toBe("p5");
        });

        it("deve lançar erro para dados inválidos", () => {
            const invalidCases = [
                { name: "", age: "25", gender: "M", id: "test" },  // nome vazio
                { age: "25", gender: "M", id: "test" },  // sem nome
                { name: "Teste", gender: "M", id: "test" },  // sem age
                { name: "Teste", age: "25", id: "test" }  // sem gender
            ];

            invalidCases.forEach(data => {
                expect(() => Patient.fromObject(data)).toThrow("Dados do paciente incompletos");
            });
        });
    });
});