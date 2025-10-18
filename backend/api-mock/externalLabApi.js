exports.getLabResult = (patientId, riskProbability = null) => {
    return new Promise(resolve => {
        
        setTimeout(() => {
            let isPositive;
            let confidence;
            
            if (riskProbability !== null) {
                // Correlaciona resultado com risco COVID-19 calculado
                
                if (riskProbability > 0.20) { // Risco muito alto (>20%)
                    isPositive = Math.random() < 0.88; // 88% chance de positivo
                    confidence = isPositive ? 0.94 + Math.random() * 0.05 : 0.91 + Math.random() * 0.06;
                } else if (riskProbability > 0.10) { // Risco alto (10-20%)
                    isPositive = Math.random() < 0.70; // 70% chance de positivo
                    confidence = isPositive ? 0.89 + Math.random() * 0.08 : 0.88 + Math.random() * 0.09;
                } else if (riskProbability > 0.05) { // Risco médio (5-10%)
                    isPositive = Math.random() < 0.35; // 35% chance de positivo
                    confidence = isPositive ? 0.85 + Math.random() * 0.10 : 0.90 + Math.random() * 0.08;
                } else { // Risco baixo (<5%)
                    isPositive = Math.random() < 0.12; // 12% chance de positivo
                    confidence = isPositive ? 0.78 + Math.random() * 0.15 : 0.93 + Math.random() * 0.06;
                }
            } else {
                // Fallback para o comportamento anterior
                const idNumber = parseInt(patientId.replace('p', ''));
                isPositive = idNumber % 2 !== 0;
                confidence = isPositive ? 0.95 : 0.93;
            }
            
            // Simula diferentes tipos de teste baseado na probabilidade
            let testType;
            if (riskProbability > 0.15) {
                testType = 'RT-PCR COVID-19 (Prioritário)';
            } else if (riskProbability > 0.05) {
                testType = 'Teste Rápido Antígeno COVID-19';
            } else {
                testType = 'RT-PCR COVID-19 (Triagem)';
            }
            
            resolve({
                success: true,
                result: {
                    testType: testType,
                    positive: isPositive,
                    confidence: confidence,
                    interpretation: isPositive ? 
                        'Detectado material genético do SARS-CoV-2' : 
                        'Não detectado material genético do SARS-CoV-2',
                    recommendations: isPositive ? 
                        'Isolamento imediato e acompanhamento médico' :
                        'Manter medidas preventivas e monitorar sintomas'
                }
            });
        }, 800); // Simula tempo real de processamento laboratorial
    });
};