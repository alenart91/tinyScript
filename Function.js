const { Environment } = require('./Environment.js');

class Fn {
    constructor(declaration) {
        this.declaration = declaration;
    }

    call(interpreter, args) {

        let environment = new Environment(interpreter.environment);

        for(let i = 0; i < this.declaration.params.length; i++) {
            console.log('in loop', this.declaration.params[i].value, args[i]);
            environment.define(this.declaration.params[i].value, args[i]);
        }

        interpreter.executeBlock(this.declaration.body, environment);
        return null;
    }

}


module.exports = { Fn };