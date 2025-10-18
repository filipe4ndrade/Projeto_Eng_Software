const { P_D, factors } = require("../../data/probabilities");

describe("Probabilities Data", () => {
    describe("Prevalência", () => {
        it("deve ter prevalência definida", () => {
            expect(P_D).toBeDefined();
            expect(typeof P_D).toBe("number");
            expect(P_D).toBeGreaterThan(0);
            expect(P_D).toBeLessThan(1);
        });

        it("deve ter prevalência realista para COVID-19", () => {
            // Prevalência típica de COVID-19 varia entre 1% e 20%
            expect(P_D).toBeGreaterThanOrEqual(0.01);
            expect(P_D).toBeLessThanOrEqual(0.20);
        });
    });

    describe("Factors Structure", () => {
        it("deve ter fatores definidos", () => {
            expect(factors).toBeDefined();
            expect(typeof factors).toBe("object");
            expect(Object.keys(factors).length).toBeGreaterThan(0);
        });

        it("deve conter fatores essenciais de COVID-19", () => {
            const expectedFactors = [
                "febre",
                "tosse_seca", 
                "perda_olfato_paladar",
                "dificuldade_respirar" // Nome correto no arquivo
            ];

            expectedFactors.forEach(factor => {
                expect(factors).toHaveProperty(factor);
            });
        });

        it("cada fator deve ter estrutura correta", () => {
            Object.keys(factors).forEach(factorName => {
                const factor = factors[factorName];
                
                expect(factor).toHaveProperty("P_S_given_D");
                expect(factor).toHaveProperty("P_S_given_not_D");
                
                expect(typeof factor.P_S_given_D).toBe("number");
                expect(typeof factor.P_S_given_not_D).toBe("number");
                
                // Probabilidades devem estar entre 0 e 1
                expect(factor.P_S_given_D).toBeGreaterThanOrEqual(0);
                expect(factor.P_S_given_D).toBeLessThanOrEqual(1);
                expect(factor.P_S_given_not_D).toBeGreaterThanOrEqual(0);
                expect(factor.P_S_given_not_D).toBeLessThanOrEqual(1);
            });
        });

        it("sensibilidade deve ser maior que falso positivo", () => {
            Object.keys(factors).forEach(factorName => {
                const factor = factors[factorName];
                // P(S|D) deve ser maior que P(S|not_D) para ser um bom indicador
                expect(factor.P_S_given_D).toBeGreaterThan(factor.P_S_given_not_D);
            });
        });
    });

    describe("Specific Factors", () => {
        it("febre deve ter valores realistas", () => {
            const febre = factors.febre;
            expect(febre.P_S_given_D).toBeGreaterThan(0.8); // Febre é muito comum em COVID
            expect(febre.P_S_given_not_D).toBeLessThan(0.2); // Febre sem COVID é menos comum
        });

        it("perda_olfato_paladar deve ser específica", () => {
            const olfato = factors.perda_olfato_paladar;
            expect(olfato.P_S_given_D).toBeGreaterThan(0.5); // Sintoma comum em COVID
            expect(olfato.P_S_given_not_D).toBeLessThan(0.1); // Muito específico de COVID
        });

        it("tosse_seca deve ter valores moderados", () => {
            const tosse = factors.tosse_seca;
            expect(tosse.P_S_given_D).toBeGreaterThan(0.5);
            expect(tosse.P_S_given_not_D).toBeLessThan(0.15);
        });
    });

    describe("Data Consistency", () => {
        it("deve ter pelo menos 8 fatores para avaliação completa", () => {
            expect(Object.keys(factors).length).toBeGreaterThanOrEqual(8);
        });

        it("nenhum fator deve ter probabilidade zero", () => {
            Object.keys(factors).forEach(factorName => {
                const factor = factors[factorName];
                expect(factor.P_S_given_D).toBeGreaterThan(0);
                expect(factor.P_S_given_not_D).toBeGreaterThanOrEqual(0);
            });
        });

        it("fatores devem ser informativos (sensibilidade > 0.15)", () => {
            Object.keys(factors).forEach(factorName => {
                const factor = factors[factorName];
                // Cada fator deve ter pelo menos 15% de sensibilidade para ser útil
                expect(factor.P_S_given_D).toBeGreaterThan(0.15);
            });
        });
    });
});