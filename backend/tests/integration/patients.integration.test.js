const request = require('supertest');
const express = require('express');
const path = require('path');

// Importar a aplicação
const app = require('../../app');

// Importar dependências para resetar estado
const patientStore = require('../../data/patientStore');

describe('Testes de Integração - Sistema COVID-19', () => {
    let originalPatients;

    beforeEach(() => {
        // Backup e limpeza do store para testes isolados
        originalPatients = [...patientStore.findAll()];
        
        const allPatients = patientStore.findAll();
        allPatients.forEach(patient => {
            patientStore.remove(patient.id);
        });
    });

    afterEach(() => {
        // Limpar estado após cada teste
        const allPatients = patientStore.findAll();
        allPatients.forEach(patient => {
            patientStore.remove(patient.id);
        });
    });

    describe('Integração das Rotas de Pacientes', () => {
        
        it('deve acessar a página inicial do sistema', async () => {
            const response = await request(app)
                .get('/')
                .expect(302); // Redirect para /patients
            
            expect(response.headers.location).toBe('/patients');
        });

        it('deve listar pacientes na página principal', async () => {
            // Criar alguns pacientes de teste
            patientStore.create({ name: 'João Silva', age: 30, gender: 'M' });
            patientStore.create({ name: 'Maria Santos', age: 25, gender: 'F' });

            const response = await request(app)
                .get('/patients')
                .expect(200);

            expect(response.text).toContain('João Silva');
            expect(response.text).toContain('Maria Santos');
            expect(response.text).toContain('Pacientes COVID-19');
        });

        it('deve acessar formulário de cadastro', async () => {
            const response = await request(app)
                .get('/patients/new')
                .expect(200);

            expect(response.text).toContain('Novo Paciente');
            expect(response.text).toContain('form');
            expect(response.text).toContain('name="name"');
            expect(response.text).toContain('name="age"');
            expect(response.text).toContain('name="gender"');
        });

        it('deve criar novo paciente via POST', async () => {
            const patientData = {
                name: 'Carlos Teste',
                age: '35',
                gender: 'M'
            };

            const response = await request(app)
                .post('/patients')
                .send(patientData)
                .expect(302); // Redirect após criação

            expect(response.headers.location).toBe('/patients');

            // Verificar se foi criado no store
            const patients = patientStore.findAll();
            expect(patients).toHaveLength(1);
            expect(patients[0].name).toBe('Carlos Teste');
            expect(patients[0].age).toBe(35);
            expect(patients[0].gender).toBe('M');
        });

        it('deve deletar paciente existente', async () => {
            // Criar paciente
            const patient = patientStore.create({ name: 'João Delete', age: 40, gender: 'M' });

            const response = await request(app)
                .delete(`/patients/api/${patient.id}`)
                .expect(204);

            // Verificar se foi removido
            const found = patientStore.findById(patient.id);
            expect(found).toBeUndefined();
        });
    });

    describe('Integração das Rotas de Avaliação', () => {
        
        it('deve acessar página de avaliação de paciente', async () => {
            // Criar paciente
            const patient = patientStore.create({ name: 'Pedro Avaliação', age: 28, gender: 'M' });

            const response = await request(app)
                .get(`/patients/${patient.id}/evaluate`)
                .expect(200);

            expect(response.text).toContain('Avaliação de Risco COVID-19');
            expect(response.text).toContain('Pedro Avaliação');
            expect(response.text).toContain('checkbox');
        });

        it('deve atualizar sintomas do paciente', async () => {
            // Criar paciente
            const patient = patientStore.create({ name: 'Ana Sintomas', age: 32, gender: 'F' });

            const symptomsData = {
                factors: ['febre', 'tosse', 'dificuldade_respiratoria']
            };

            const response = await request(app)
                .post(`/patients/${patient.id}/factors`)
                .send(symptomsData)
                .expect(302);

            expect(response.headers.location).toBe(`/patients/${patient.id}/evaluate`);

            // Verificar se sintomas foram salvos
            const updatedPatient = patientStore.findById(patient.id);
            expect(updatedPatient.factors).toEqual(['febre', 'tosse', 'dificuldade_respiratoria']);
        });

        it('deve calcular risco corretamente baseado nos sintomas', async () => {
            // Criar paciente com sintomas de alto risco
            const patient = patientStore.create({ 
                name: 'Roberto Alto Risco', 
                age: 65, 
                gender: 'M',
                factors: ['febre', 'tosse', 'dificuldade_respiratoria', 'perda_olfato']
            });

            const response = await request(app)
                .get(`/patients/${patient.id}/evaluate`)
                .expect(200);

            // Deve mostrar o risco calculado na página
            expect(response.text).toContain('Roberto Alto Risco');
            expect(response.text).toMatch(/\d+\.\d+%/); // Deve conter percentual
        });
    });

    describe('Integração de Fluxo Completo', () => {
        
        it('deve executar fluxo completo: criar → avaliar → listar', async () => {
            // 1. Criar paciente
            const patientData = {
                name: 'Fluxo Completo',
                age: '45',
                gender: 'F'
            };

            await request(app)
                .post('/patients')
                .send(patientData)
                .expect(302);

            // 2. Verificar se aparece na lista
            const listResponse = await request(app)
                .get('/patients')
                .expect(200);

            expect(listResponse.text).toContain('Fluxo Completo');

            // 3. Encontrar o paciente criado
            const patients = patientStore.findAll();
            const patient = patients.find(p => p.name === 'Fluxo Completo');
            expect(patient).toBeDefined();

            // 4. Acessar avaliação
            const evalResponse = await request(app)
                .get(`/patients/${patient.id}/evaluate`)
                .expect(200);

            expect(evalResponse.text).toContain('Fluxo Completo');

            // 5. Adicionar sintomas
            await request(app)
                .post(`/patients/${patient.id}/factors`)
                .send({ factors: ['febre', 'tosse'] })
                .expect(302);

            // 6. Verificar sintomas salvos
            const updatedPatient = patientStore.findById(patient.id);
            expect(updatedPatient.factors).toEqual(['febre', 'tosse']);
        });
    });

    describe('Tratamento de Erros de Integração', () => {
        
        it('deve retornar 404 para paciente inexistente na avaliação', async () => {
            await request(app)
                .get('/patients/inexistente/evaluate')
                .expect(404);
        });

        it('deve retornar 404 para deletar paciente inexistente', async () => {
            await request(app)
                .delete('/patients/api/inexistente')
                .expect(404);
        });

        it('deve tratar dados inválidos no cadastro', async () => {
            const invalidData = {
                name: '', // Nome vazio
                age: 'invalid',
                gender: 'X'
            };

            // Dependendo da validação implementada, pode retornar erro ou redirecionar
            const response = await request(app)
                .post('/patients')
                .send(invalidData);

            // Verificar que não foi criado paciente inválido
            const patients = patientStore.findAll();
            expect(patients).toHaveLength(0);
        });
    });
});