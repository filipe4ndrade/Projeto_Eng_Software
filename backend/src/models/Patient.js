class Patient {

    constructor(name, age, gender, id = null, factors = []) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.factors = factors;
    }


    static fromObject(obj) {
        if (!obj.name || !obj.age || !obj.gender) {
            throw new Error('Dados do paciente incompletos.');
        }
        return new Patient(
            obj.name, 
            Number(obj.age), 
            obj.gender, 
            obj.id, 
            obj.factors || []
        );
    }
}

module.exports = Patient;