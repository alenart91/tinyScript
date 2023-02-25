const { Lexer } = require('./lexer.js');
const { Parser } = require('./Parser.js');
// const { keywords } = require('./keywords.js');
const { Environment } = require('./Environment.js');
const { Fn } = require('./Function.js');
const { Native } = require('./Native.js');

const { defineNatives } = require('./defineNatives.js');

const { readFileSync } = require('fs');

const { input } = require('./program.js');



class Interpreter {

    constructor() {
        // keeps the variable environment in memory as long as the interpreter is running
        this.global = new Environment();
        this.environment = this.global;
        this.nativeFunctions(Native);



        // this.global.define('log', new class extends Fn {

        //     arity() { return 1; }
            
        //     // call(interpreter, args) {
        //     //     // console.log('in call', args[0]);

        //     //     return console.log(args[0]);
        //     // }
        // });


    } 


    nativeFunctions(native) {
        
        // pass instance of Native class and the global env
        defineNatives(native, this.global);
    }

    

    interpret(expression) {
        // console.log('env', this.environment);

        try {

            for(let i = 0; i < expression.body.length; i++) {
                this.evaluate(expression.body[i]);
            }

        } catch(err) {
            console.error(err.message);
        } finally {
            // console.log(this.environment);
            return 'Program finished';
        }
    

    }
    

    visitDeclareStmt(stmt) {
        console.log('statement declare', stmt);
        let val = null;

        if(stmt.initializer != null) {
            val = this.evaluate(stmt.initializer);
        }
        
        // val is literal (Alexander)
        // name is variable declaration

        // sets and updates variables. 
        // Doesn't need env scope because if it exists it will update it else it will create it

        console.log('in declare node', val);
        this.environment.define(stmt.name, val);

        return null;
    }


    visitGlobalStmt(stmt) {

        // get to top level of environment and declare variable there

        let val = null;

        if(stmt.initializer != null) {
            val = this.evaluate(stmt.initializer);
        }

        this.environment.defineGlobal(stmt.name, val, this.global);

        return null;
    }


    visitFunctionStmt(stmt) {
        
        let func = new Fn(stmt, this.environment);
        // console.log('env in function statement', this.environment);
        // console.log('func in stmt', func);
        // stores the identifier and function body
        this.environment.define(stmt.name, func);
        // console.log('func statement env after define', this.environment);

        return null;
    }


    visitBlockStmt(stmt) {
        
        this.executeBlock(stmt.statements, new Environment(this.environment));

        return null;
    }


    executeBlock(statements, environment) {

        // console.log('in execute block', statements);
        // console.log('environment', environment);
       
        let previous = this.environment;
        

        try {
            this.environment = environment;

            for(let i = 0; i < statements.length; i++) {
                // console.log('beginning of block statement loop');
                // console.log('statement', statements[i]);

                this.evaluate(statements[i]);
            }

        } finally {
            this.environment = previous;
        }

        // return;
    }


    visitIfStmt(stmt) {

        if(this.isTruthy(this.evaluate(stmt.condition))) {
             this.evaluate(stmt.thenBranch);

        } else if(stmt.elseBranch != null) {
            this.evaluate(stmt.elseBranch);
        }

        return null;
    }


    visitLoopStmt(stmt) {

        // console.log('loop stmt', stmt);
        // console.log('this env', this.environment);
        let environment = new Environment(this.environment);


        let previous = this.environment;
        this.environment = environment;

        // let init = stmt.initializer != null ? this.evaluate(stmt.initializer) : null
        // let condition =  stmt.condition != null ? this.evaluate(stmt.condition) : true;
        // let increment = stmt.increment != null ? this.evaluate(stmt.increment) : null;


        for(stmt.initializer != null ? this.evaluate(stmt.initializer) : null; 
        stmt.condition != null ? this.evaluate(stmt.condition) : true; 
        stmt.increment != null ? this.evaluate(stmt.increment) : null) {
           
            // console.log('env', this.environment, this.environment.enclave);
            try {
            this.evaluate(stmt.body);

            } catch(statement) {
                // rethrow for errors that occur in loops
                if(statement == 'CONTINUE') continue;
                if(statement == 'STOP') break;
            }

            // console.log('end of loop');
        }

        this.environment = previous;
        // console.log('out of loop');
        return null;

    }



    visitWhileStmt(stmt) {
       
        while(this.isTruthy(this.evaluate(stmt.condition))) {

            try {
            // body is the array of statements to execute
            this.evaluate(stmt.body);

            } catch(statement) {
                // rethrow for errors that occur in loops
                if(statement == 'CONTINUE') continue;
                if(statement == 'STOP') break;
            }
        }

        return null;
    }


    visitExpressionStmt(stmt) {
        return this.evaluate(stmt.expression);
    }


    visitPrintStmt(stmt) {
        console.log('print', stmt);
        console.log(this.environment);
        let val = this.evaluate(stmt.expression);
        return console.log(val);
    }


    visitContinueStmt(stmt) {
        throw stmt.type;
    }


    visitStopStmt(stmt) {
        throw stmt.type;
    }


    visitReturnStmt(stmt) {
        // console.log('return stmt', stmt);
        let value = null;

        if(stmt.value != null) value = this.evaluate(stmt.value);
        // console.log('return val', value);
        throw value;
    }


    visitPushStmt(stmt) {
        console.log('in push stmt', stmt);

        // should I even evalute it?
        let item = this.evaluate(stmt.value);
        // let item = stmt.value;

        let list = this.evaluate(stmt.listVal);
        console.log('list', list);

        

        list.push(item);
        console.log('updated', list);
        // update environment
        console.log(stmt.name, list);
        this.environment.assign(stmt.name, list);

        console.log('environment after pushing item', this.environment);

        return item;
    }



    visitLogicalExpr(expr) {
       
        let left = this.evaluate(expr.left);
        
        if(expr.operator == '|') {

            if(this.isTruthy(left)) return left;

        } else {

            if(!this.isTruthy(left)) return left;
        }

        return this.evaluate(expr.right);
    }


    visitListExpr(expr) {
        console.log('in list', expr);

        // let evalArray = expr.items.map((item) => {
        //     console.log('item', item);
        //     return this.evaluate(item);
        // });


        expr.items.forEach((item, index, array) => {
            // console.log('item', item);
            array[index] = this.evaluate(item);
        });
        
        return expr.items;

    }


    visitLiteralExpr(expr) {
        return expr.value;
    }


    visitBinaryExpr(expr) {
       
        let left = this.evaluate(expr.leftVal);
        let right = this.evaluate(expr.rightVal);

        switch(expr.operator) {

            case '>': 
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) > Number(right);

            case '>=': 
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) >= Number(right);

            case '<': 
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) < Number(right);

            case '<=': 
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) <= Number(right);

            case '!=': 
                return !this.isEqual(left, right);

            case '==': 
                return this.isEqual(left, right);

            case '-': 
                this.checkNumberOperands(expr.operator, left, right);
                return left - right;

            case '+': 
                if(typeof left == 'string' && typeof right == 'string') return String(left) + String(right);
                if(typeof left == 'number' && typeof right == 'number') return Number(left) + Number(right);
                // allow type coercion?  
                throw new Error('Operands must be two numbers or two strings.');

            case '/': 
            this.checkNumberOperands(expr.operator, left, right);
            if(right == 0 ) throw new Error('Cannot divide by zero');
            return left / right;

            case '*': 
            this.checkNumberOperands(expr.operator, left, right);
            return left * right;
        }

        return null;
    }


    visitCallExpr(expr) {

        let callee = this.evaluate(expr.callee);

        let funcArguments = [];
        for(let i = 0; i < expr.args.length; i++) {
            funcArguments.push(this.evaluate(expr.args[i]));
        }
  
        if(!(callee instanceof Fn)) {
            throw new Error('Can only call functions');
        }

        let func = callee;

        return func.call(this, funcArguments);
    }


    visitGroupingExpr(expr) {
        return this.evaluate(expr.expression);
  }


    visitUnaryExpr(expr) {
        let right = this.evaluate(expr.rightVal);

        switch(expr.operator) {
            case '-': 
                this.checkNumberOperand(expr.operator, right);
                return -Number(right);  // type cast to number before evaluating

            case '!': return !this.isTruthy(right);
        }

        return null;
    }

    
    // add implicit variable declaration like JavaScript

    visitAssignmentExpr(expr) {
        // console.log('var assignment', expr);
        let value = this.evaluate(expr.value);
        // console.log('valzee', value);
        this.environment.assign(expr.name, value);
        return value;
        
    }


    visitVariableExpr(expr) {
        // console.log('var expr');
        return this.environment.retrieve(expr.name);
    }


    // We rely on this helper method which simply sends the expression back into the interpreter’s visitor implementation
    evaluate(expr) {
        // error for trying to evaluate null?
        console.log('in evaluate', expr);
        return expr.accept(this);
  }


    isEqual(objOne, objTwo) {
        if(objOne == null && objTwo == null) return true;
        if(objOne == null) return false;

        return objOne == objTwo;
    }


    isTruthy(object) {

        // need better logic for truthy function
        // console.log('truthy object', object);
        if (object == null) return false;
        if (object == undefined) return false;
        if (object == 'false') return false;
        if (object == 'true') return true;
        if (typeof object == 'boolean') return Boolean(object);
        return true;
    }

    checkNumberOperand(operator, right) {
        if(typeof right == 'number') return;

        throw new Error('Operand must be a number.');
    }

    
    checkNumberOperands(operator, left, right) {
        if(typeof left == 'number' && typeof right == 'number') {
            return;
        }

        throw new Error('Operand must be a number.');
    }


};

const program = readFileSync('./source.txt', 'utf8');
// console.log('program', program);

let tinyScript = new Lexer(program);
let programTokens = tinyScript.scanInput();

let tinyParser = new Parser(programTokens);
// console.log(tinyParser);
let ast = tinyParser.parse();
console.log(ast);


let myInterpreter = new Interpreter();
console.log(myInterpreter.interpret(ast));


module.exports = { Interpreter };