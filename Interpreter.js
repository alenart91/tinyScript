const { Lexer } = require('./lexer.js');
const { Parser } = require('./Parser.js');
const { input } = require('./program.js');
const { keywords } = require('./keywords.js');
const { Environment } = require('./Environment.js');

const { readFileSync } = require('fs');



class Interpreter {

    constructor() {
        // keeps the variable environment in mem as long as the interpreter is running
        this.environment = new Environment();
    }

    interpret(expression) {
        // console.log('interpret expression', expression);

        try {

            for(let i = 0; i < expression.body.length; i++) {
                this.evaluate(expression.body[i]);
            }

        } catch(err) {
            console.error(err.message);
        }
    }
    

    visitDeclareStmt(stmt) {
        let val = null;

        if(stmt.initializer != null) {
            val = this.evaluate(stmt.initializer);
        }
        
        this.environment.define(stmt.name, val);
        return null;
    }


    visitExpressionStmt(stmt) {
        return this.evaluate(stmt.expression);
    }


    visitPrintStmt(stmt) {
        let val = this.evaluate(stmt.expression);
        return console.log(val);
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
                return !isEqual(left, right);

            case '==': 
                return isEqual(left, right);

            case '-': 
                this.checkNumberOperands(expr.operator, left, right);
                return left - right;

            case '+': 
                if(typeof left == 'string' && typeof right == 'string') return String(left) + String(right);
                if(typeof left == 'number' && typeof right == 'number') return Number(left) + Number(right);
                // allow type coercion?  throw new Error('Operands must be two numbers or two strings.');

            case '/': return left / right;
            case '*': return left * right;
        }

        return null;
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




    visitVariableExpr(expr) {
        return this.environment.retrieve(expr.name);
    }


    // We rely on this helper method which simply sends the expression back into the interpreter’s visitor implementation
    evaluate(expr) {
        return expr.accept(this);
  }


    isEqual(objOne, objTwo) {
        if(objOne == null && objTwo == null) return true;
        if(objOne == null) return false;

        return objOne == objTwo;
    }


    isTruthy(object) {
        if (object == null) return false;
        if (typeof object == 'Boolean') return Boolean(object);
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




// We make the field static so that successive calls to run() inside a REPL session reuse the same interpreter. 
// That doesn’t make a difference now, but it will later when the interpreter stores global variables. 
// Those variables should persist throughout the REPL session.