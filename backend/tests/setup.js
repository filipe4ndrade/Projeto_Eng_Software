// Configuração global do Jest
global.console = {
  ...console,
  // Suprimir logs durante testes (opcional)
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};


jest.setTimeout(30000);

// Configuração global para testes
beforeEach(() => {
  // Limpar todos os mocks antes de cada teste
  jest.clearAllMocks();
});

afterEach(() => {
  // Restaurar mocks após cada teste
  jest.restoreAllMocks();
});