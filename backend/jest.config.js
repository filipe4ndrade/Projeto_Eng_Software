module.exports = {
  // Ambiente de teste
  testEnvironment: 'node',

  // Padrões de arquivos de teste
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/integration/**/*.test.js'
  ],

  // Coleta de cobertura
  collectCoverageFrom: [
    'src/**/*.js',
    'data/**/*.js',
    '!src/**/*.test.js',
    '!**/node_modules/**'
  ],

  // Formatos de relatório de cobertura
  coverageReporters: [
    'text',           // Console
    'lcov',          // Para ferramentas como VSCode
    'html',          // Relatório HTML
    'text-summary'   // Resumo no console
  ],

  // Limites mínimos de cobertura (ajustados para o projeto atual)
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 40,
      lines: 25,
      statements: 25
    }
  },

  // Diretório de saída para relatórios
  coverageDirectory: 'coverage',

  // Configurações adicionais
  verbose: true,
  
  // Setup para testes
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Transformações (se necessário no futuro)
  transform: {},

  // Timeout para testes (30s)
  testTimeout: 30000,

  // Limpeza automática de mocks
  clearMocks: true,
  restoreMocks: true,

  // Coleta de cobertura detalhada
  collectCoverage: false, // Só quando rodar npm run test:coverage
};