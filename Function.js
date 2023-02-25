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

        for(let i = 0; i < this.declaration.params.length; i++) {

            // allow different number of parameters and arguments
            if(this.declaration.params.length != args.length) {

                // more params
                if(i > args.length - 1) {
                    environment.define(this.declaration.params[i].value, null);
                    continue;
                }

                // more arguments
                if(i > this.declaration.params.length - 1) {
                    break;
                } 

            }

            // arguments are scoped to the function body
            environment.define(this.declaration.params[i].value, args[i]);
        }

        console.log('env after loop', environment);


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





// parameters
function something(a, b) {
    return a + b;
}

something(1, 2, 3);


// arguments
something(1, 2, 3);
something(1);