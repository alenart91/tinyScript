
// All native functions defined here

function defineNatives(Native, env) {

    env.define('log',  new Native(function(arguments) {

        return console.log(...arguments);
    }));


    env.define('sizeOf', new Native(function(arguments) {

        if(arguments.length < 1) throw new Error('sizeOf expects one argument');
        if(arguments.length > 1) throw new Error('sizeOf only accepts one argument');

        return arguments[0].length;

    }));

   
}


module.exports = { defineNatives };