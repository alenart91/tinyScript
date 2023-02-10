class Environment {
    constructor(enclave = null) {
        this.values = new Map();
        this.enclave = enclave;
    }

    define(name, value) {
        this.values.set(name, value);
    }


    retrieve(name) {
        // console.log(this.values);
        if(this.values.has(name)) return this.values.get(name);

         // look in higher scope
        if (this.enclave !== null) {
            return this.enclave.retrieve(name);
        }

        throw new Error(`Undefined variable ${name}`);
    }


    assign(name, value) {
        if(this.values.has(name)) return this.values.set(name, value);

         // look in higher scope
        if (this.enclave !== null) {
            return this.enclave.assign(name, value);
        }

        throw new Error(`Undefined variable ${name}`);
    }
    
}

module.exports = { Environment };