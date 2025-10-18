# 🦠 Sistema de Triagem COVID-19 (SARDo)

Sistema de Avaliação de Risco de Doenças utilizando o **Teorema de Bayes** para calcular probabilidades de infecção por COVID-19 baseado em sintomas e fatores de risco.

## 🎯 Sobre o Projeto

Este sistema implementa um algoritmo bayesiano inteligente para avaliar o risco de COVID-19 em pacientes com base em seus sintomas relatados. Utiliza probabilidades médicas reais para fornecer uma estimativa percentual precisa do risco de infecção.

### ✨ Características Principais

- **🧮 Cálculo Bayesiano**: Algoritmo baseado em probabilidades condicionais reais
- **⚕️ 12 Sintomas Médicos**: Baseados em estudos epidemiológicos oficiais
- **🧪 API Mock de Laboratório**: Simula resultados correlacionados de testes
- **🎨 Interface Intuitiva**: Design limpo e responsivo
- **📋 CRUD Completo**: Gerenciamento completo de pacientes
- **🌈 Inclusivo**: Opções de gênero Masculino/Feminino/Outro

## 🚀 Como Executar

### 📋 Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **npm** (geralmente incluído com Node.js)

### ⚡ Instalação Rápida

```bash
# 1. Clone o repositório
git clone https://github.com/filipe4ndrade/Projeto_Eng_Software.git
cd Projeto_Eng_Software

# 2. Instale as dependências
npm install

# 3. Execute o servidor
npm start

# 4. Acesse no navegador
# http://localhost:3000
```

O sistema iniciará automaticamente e redirecionará para a lista de pacientes.

## 🎮 Como Usar o Sistema

### 1. 📋 Lista de Pacientes
- Visualize todos os pacientes cadastrados
- **"Novo Cadastro"** - Adicionar novos pacientes
- **"Avaliar Risco"** - Iniciar avaliação para cada paciente
- **"Excluir"** - Remover pacientes do sistema

### 2. ➕ Cadastro de Paciente
- **Nome**: Campo obrigatório (texto livre)
- **Idade**: Número entre 0-120 anos
- **Gênero**: Masculino, Feminino ou Outro

### 3. 🩺 Avaliação de Risco
- **Dados do Paciente**: Exibe informações cadastradas
- **Risco Calculado**: Percentual baseado no Teorema de Bayes
- **Seleção de Sintomas**: Checkboxes para 12 sintomas COVID-19
- **Resultado do Laboratório**: Simulação de teste médico correlacionado
- **Análise Combinada**: Comparação entre cálculo bayesiano e teste

## 🧮 Como Funciona o Algoritmo Bayesiano

### 📊 Fórmula Base
```
P(COVID|Sintomas) = [P(Sintomas|COVID) × P(COVID)] / P(Sintomas)
```

### 🔄 Processo de Cálculo

1. **Probabilidade Inicial**: 5% (prevalência populacional)
2. **Para cada sintoma selecionado**:
   - Aplica o Teorema de Bayes iterativamente
   - Atualiza a probabilidade posterior
3. **Resultado Final**: Porcentagem de risco COVID-19

### 💡 Exemplo Prático
```javascript
// Paciente com febre (87% sensibilidade)
Risco inicial: 5% → Após febre: ~31%

// Adiciona tosse seca (68% sensibilidade)  
~31% → Após tosse: ~74%

// Adiciona perda olfato (64% sensibilidade, alta especificidade)
~74% → Resultado final: ~96%
```

## 📊 Sintomas e Probabilidades Médicas

| Sintoma | Sensibilidade | Especificidade | Taxa Falso + |
|---------|---------------|----------------|---------------|
| 🌡️ Febre | 87% | 88% | 12% |
| 😷 Tosse Seca | 68% | 92% | 8% |
| 👃 Perda Olfato/Paladar | 64% | 98% | 2% |
| 😴 Fadiga Extrema | 62% | 75% | 25% |
| 💨 Dificuldade Respirar | 55% | 97% | 3% |
| 💪 Dor no Corpo | 44% | 82% | 18% |
| 🗣️ Dor de Garganta | 40% | 85% | 15% |
| 🤕 Dor de Cabeça | 36% | 78% | 22% |
| 👃 Congestão Nasal | 28% | 80% | 20% |
| 🤢 Náusea/Vômito | 16% | 92% | 8% |
| 🤝 Contato Confirmado | 75% | 95% | 5% |
| � Idade Acima 60 | 35% | 75% | 25% |


## 🧪 Testes Automatizados

### 🎯 Cobertura Completa
```bash
# Testes unitários (Jest)
npm run test:unit

# Testes de integração (Supertest)
npm run test:integration  

# Testes de aceitação (Cucumber + Puppeteer)
npm run test:acceptance

# Todos os testes + cobertura
npm test
```

### 📊 Resultados Atuais
- ✅ **Testes Unitários**: 32 passando
- ✅ **Testes Integração**: 12 passando  
- ✅ **Testes Aceitação**: 4 cenários, 18 steps passando
- 📈 **Cobertura**: 95%+ das funções principais

## 🔧 Tecnologias Utilizadas

### Backend
- **Node.js + Express.js**: Servidor web robusto
- **EJS**: Template engine para renderização HTML

### Frontend  
- **HTML5 + CSS3**: Interface responsiva e acessível
- **JavaScript**: Interatividade e validações

### Testes
- **Jest**: Testes unitários e de integração
- **Cucumber + Puppeteer**: Testes de aceitação end-to-end
- **Supertest**: Testes de API HTTP

### Dados
- **In-Memory Store**: Armazenamento simples para fins acadêmicos
- **Mock APIs**: Simulação de dependências externas

## 🤝 Contribuição

```bash
# 1. Fork o projeto no GitHub
# 2. Crie uma branch para sua feature
git checkout -b feature/nova-funcionalidade

# 3. Commit suas mudanças
git commit -am 'Adiciona nova funcionalidade'

# 4. Push para a branch
git push origin feature/nova-funcionalidade

# 5. Abra um Pull Request
```

## 🎓 Contexto Acadêmico

**Disciplina**: Engenharia de Software  
**Instituição**: IFSudesteMG  

⚕️ **Aviso Médico**: Este sistema é **exclusivamente educacional** e não deve ser usado para diagnósticos médicos reais. Sempre consulte profissionais de saúde qualificados.