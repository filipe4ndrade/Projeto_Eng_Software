module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: [
        'backend/src/**/*.js',
        'backend/routes/**/*.js',
        'backend/controllers/**/*.js',
        'backend/data/**/*.js',
        '!backend/app.js', // Excluir ponto de entrada
        '!**/node_modules/**'
    ],
    coverageDirectory: 'tests/coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    setupFilesAfterEnv: [],
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    verbose: true,
    testTimeout: 10000, // 10 segundos para testes de integração
    collectCoverage: false, // Só coleta quando explicitamente solicitado
    roots: ['<rootDir>/backend', '<rootDir>/tests'],
    moduleDirectories: ['node_modules', '<rootDir>']
};