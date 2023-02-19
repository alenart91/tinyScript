class Environment {
    constructor(enclave = null) {
        this.values = new Map();
        this.enclave = enclave;
    }

    define(name, value) {
        if(this.values.has(name)) {
            throw new Error('name already declared previously');
        } else {
        this.values.set(name, value); 
        }
    }

    defineGlobal(name, value, globalEnv) {

        // if(this.enclave == null) {
        // console.log('global env', globalEnv);

        if(globalEnv.values.has(name)) {
            throw new Error('name already declared in global namespace');
        } else {
            globalEnv.values.set(name, value);
        }
            


        // }

        // if(this.enclave !== null) {
        //     return this.enclave.defineGlobal(name, value);
        // }
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