const { Fn } = require('./Function.js');


class Native extends Fn {

    // static

    constructor(funcDef) {
        super();
        this.funcDef = funcDef;
    }

    

    call(interpreter, args) {
        return this.funcDef(args);
    }

}



module.exports = { Native };