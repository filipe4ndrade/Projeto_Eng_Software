// Probabilidade a Priori (Prevalência P(D))
const P_D = 0.05; // 5% de prevalência base da COVID-19 na população (varia por região/período)
const P_not_D = 1 - P_D; // 95% de chance de NÃO ter COVID-19

// Probabilidades Condicionais para COVID-19
// P(S|D): Sensibilidade - Probabilidade de ter o sintoma SE TIVER COVID-19
// P(S|not_D): Taxa de Falso Positivo - Probabilidade de ter o sintoma SEM TER COVID-19

const factors = {
    'febre': {
        P_S_given_D: 0.87,    // 87% dos pacientes COVID+ têm febre
        P_S_given_not_D: 0.12 // 12% das pessoas sem COVID têm febre (outras causas)
    },
    'tosse_seca': {
        P_S_given_D: 0.68,    // 68% dos pacientes COVID+ têm tosse seca
        P_S_given_not_D: 0.08 // 8% das pessoas sem COVID têm tosse seca persistente
    },
    'perda_olfato_paladar': {
        P_S_given_D: 0.64,    // 64% dos pacientes COVID+ perdem olfato/paladar
        P_S_given_not_D: 0.02 // 2% das pessoas sem COVID têm perda súbita de olfato/paladar
    },
    'fadiga_extrema': {
        P_S_given_D: 0.62,    // 62% dos pacientes COVID+ têm fadiga extrema
        P_S_given_not_D: 0.25 // 25% das pessoas podem ter fadiga por outras causas
    },
    'dificuldade_respirar': {
        P_S_given_D: 0.55,    // 55% dos pacientes COVID+ têm dificuldade para respirar
        P_S_given_not_D: 0.03 // 3% das pessoas sem COVID têm dispneia súbita
    },
    'dor_corpo': {
        P_S_given_D: 0.44,    // 44% dos pacientes COVID+ têm dores no corpo
        P_S_given_not_D: 0.18 // 18% das pessoas podem ter dores musculares por outras causas
    },
    'dor_garganta': {
        P_S_given_D: 0.40,    // 40% dos pacientes COVID+ têm dor de garganta
        P_S_given_not_D: 0.15 // 15% das pessoas têm dor de garganta por outras causas
    },
    'dor_cabeca': {
        P_S_given_D: 0.36,    // 36% dos pacientes COVID+ têm dor de cabeça
        P_S_given_not_D: 0.22 // 22% das pessoas têm dor de cabeça por outras causas
    },
    'congestao_nasal': {
        P_S_given_D: 0.28,    // 28% dos pacientes COVID+ têm congestão nasal
        P_S_given_not_D: 0.20 // 20% das pessoas têm congestão por outras causas (alergias, etc.)
    },
    'nausea_vomito': {
        P_S_given_D: 0.16,    // 16% dos pacientes COVID+ têm náusea/vômito
        P_S_given_not_D: 0.08 // 8% das pessoas têm náusea/vômito por outras causas
    },
    'contato_confirmado': {
        P_S_given_D: 0.75,    // 75% dos pacientes COVID+ tiveram contato conhecido
        P_S_given_not_D: 0.05 // 5% das pessoas sem COVID reportam contato (falso positivo)
    },
    'idade_acima_60': {
        P_S_given_D: 0.35,    // 35% dos casos são em pessoas acima de 60 anos
        P_S_given_not_D: 0.25 // 25% da população testada está nesta faixa etária
    }
};

// Dados informativos sobre os sintomas
const symptomInfo = {
    'febre': {
        description: 'Temperatura corporal acima de 37.8°C',
        severity: 'Alto indicador'
    },
    'tosse_seca': {
        description: 'Tosse persistente sem expectoração',
        severity: 'Alto indicador'
    },
    'perda_olfato_paladar': {
        description: 'Perda súbita do olfato (anosmia) ou paladar (ageusia)',
        severity: 'Muito alto indicador'
    },
    'fadiga_extrema': {
        description: 'Cansaço extremo desproporcional à atividade',
        severity: 'Moderado indicador'
    },
    'dificuldade_respirar': {
        description: 'Falta de ar ou respiração ofegante',
        severity: 'Alto indicador - Atenção médica imediata'
    },
    'dor_corpo': {
        description: 'Dores musculares generalizadas',
        severity: 'Moderado indicador'
    },
    'dor_garganta': {
        description: 'Irritação ou dor ao engolir',
        severity: 'Baixo indicador'
    },
    'dor_cabeca': {
        description: 'Cefaleia persistente',
        severity: 'Baixo indicador'
    },
    'congestao_nasal': {
        description: 'Nariz entupido ou coriza',
        severity: 'Baixo indicador'
    },
    'nausea_vomito': {
        description: 'Enjoo ou vômitos',
        severity: 'Baixo indicador'
    },
    'contato_confirmado': {
        description: 'Contato próximo com caso confirmado de COVID-19 nos últimos 14 dias',
        severity: 'Alto indicador epidemiológico'
    },
    'idade_acima_60': {
        description: 'Pessoa com 60 anos ou mais (grupo de risco)',
        severity: 'Fator de risco'
    }
};

module.exports = {
    P_D,
    P_not_D,
    factors,
    symptomInfo
};