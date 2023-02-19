const { Environment } = require('./Environment.js');

class Fn {
    constructor(declaration, closure) {
        this.declaration = declaration;
        this.closure = closure;
    }

    call(interpreter, args) {

        // closure is the environment when the function was declared
        // everytime we create an environemnt we create a new enclave and set that as the old environment

        let environment = new Environment(this.closure);

        // console.log('function environment', environment);
        // console.log('declaration', this.declaration);

        for(let i = 0; i < this.declaration.params.length; i++) {
            
            // allow different number of parameters and arguments
            // if(i > args.length)

            // arguments are scoped to the function body
            environment.define(this.declaration.params[i].value, args[i]);
        }

        // console.log('function environment after define', environment);

        try {
        interpreter.executeBlock(this.declaration.body, environment);

        } catch(returnVal) {
           
            if(returnVal.name == 'Error') throw returnVal;
            return returnVal;
        }

        return null;
    }


    arity() {
        return this.declaration.params.length;
    }

}


module.exports = { Fn };