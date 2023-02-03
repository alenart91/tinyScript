class Environment {
    constructor() {
        this.values = new Map();
    }

    define(name, value) {
        this.values.set(name, value);
    }


    retrieve(name) {
        if(this.values.has(name)) return this.values.get(name);
        throw new Error(`Undefined variable ${name}`);
    }
    
}


module.exports = { Environment };



// let testMap = {};

// testMap.name = 'alex';
// testMap.age = 12;

// testMap['name'] = 'kyle';

// console.log(testMap);