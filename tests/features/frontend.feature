Feature: Sistema COVID-19 - Testes de Aceitação

  Scenario: Acessar página inicial do sistema
    Given que o servidor está funcionando
    When eu acesso a página "/"
    Then eu devo ver o título contendo "Sistema"

  Scenario: Verificar lista de pacientes
    Given que o servidor está funcionando
    When eu acesso a página "/patients"
    Then eu devo ver o título contendo "Pacientes"
    And eu devo ver o botão "Novo Cadastro"
    And eu devo ver o botão "Avaliar Risco"

  Scenario: Verificar formulário de cadastro
    Given que o servidor está funcionando
    When eu acesso a página "/patients/new"
    Then eu devo ver o título contendo "Novo"
    And eu devo ver o botão "Cadastrar Paciente"
    And eu devo ver o botão "Cancelar"

  Scenario: Navegação entre páginas
    Given que o servidor está funcionando
    When eu acesso a página "/patients"
    Then eu devo ver o título contendo "Pacientes"
    When eu acesso a página "/patients/new"
    Then eu devo ver o título contendo "Novo"