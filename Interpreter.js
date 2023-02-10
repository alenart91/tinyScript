const { Lexer } = require('./lexer.js');
const { Parser } = require('./Parser.js');
const { keywords } = require('./keywords.js');
const { Environment } = require('./Environment.js');

const { readFileSync } = require('fs');

const { input } = require('./p.js');

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
        
        // need to return something so it's not undefined
        // return;

    }
    

    visitDeclareStmt(stmt) {
        let val = null;

        if(stmt.initializer != null) {
            val = this.evaluate(stmt.initializer);
        }
        
        this.environment.define(stmt.name, val);

        return null;
    }


    visitBlockStmt(stmt) {
        // console.log('stmt in visit block', stmt);
        // this.environment is the enclave of the current scope
        this.executeBlock(stmt.statements, new Environment(this.environment));
        return null;
    }


    executeBlock(statements, environment) {

        console.log('in execute block');
        console.log('environment', environment);
        console.log('statements', statements);

        // return;

        let previous = this.environment;

        try {
            this.environment = environment;

            for(let i = 0; i < statements.length; i++) {
                // console.log('eval');
                this.evaluate(statements[i]);
            }

        } finally {
            this.environment = previous;
        }

        // return;

    }


    visitIfStmt(stmt) {
         console.log('visit if statementt', stmt, 'end');

         console.log('statement truthy test', this.isTruthy(this.evaluate(stmt.condition)));
         console.log('statment actual value', this.evaluate(stmt.condition));

        if(this.isTruthy(this.evaluate(stmt.condition))) {
            console.log('in executing then branch', stmt);
            this.evaluate(stmt.thenBranch);

        } else if(stmt.elseBranch != null) {
            this.evaluate(stmt.elseBranch);
        }

        return null;
    }



    visitWhileStmt(stmt) {
        console.log(stmt);
        console.log('evaluate', this.evaluate(stmt.condition));
        // return;
        while(this.isTruthy(this.evaluate(stmt.condition))) {
            this.evaluate(stmt.body);
        }

        return null;
    }


    visitExpressionStmt(stmt) {
        return this.evaluate(stmt.expression);
    }


    visitPrintStmt(stmt) {
        let val = this.evaluate(stmt.expression);
        return console.log(val);
    }



    visitLogicalExpr(expr) {
        // console.log('in logical expression', expr);
        let left = this.evaluate(expr.left);
        // console.log('left', left, typeof left);
        // console.log('the truth', this.isTruthy(left), left == 'true', left == 'false');
        
        if(expr.operator == '|') {

            if(this.isTruthy(left)) return left;
            // if(left == 'true') {
            //     console.log('in first true');
            //     return left;
            // }

        } else {

            if(!this.isTruthy(left)) return left;
            // if(left == 'false') {
            //     console.log('in false comparison');
            //     return left;
            // }
        }

        // console.log('expression right', expr.right);

        return this.evaluate(expr.right);
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
                // console.log('in operation', expr.operator, left, right);
                console.log('res of operation', Number(left) > Number(right));
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
                // console.log(left, right);
                // console.log('hello' + 'I am');
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

    
    // add implicit variable declaration like JavaScript

    visitAssignmentExpr(expr) {
        let value = this.evaluate(expr.value);
        this.environment.assign(expr.name, value);
        return value;
        
    }


    visitVariableExpr(expr) {
        console.log('visit var expression', expr);
        console.log('variable result', this.environment.retrieve(expr.name));
        return this.environment.retrieve(expr.name);
    }


    // We rely on this helper method which simply sends the expression back into the interpreter’s visitor implementation
    evaluate(expr) {
        // console.log('eval expr', expr);
        return expr.accept(this);
  }


    isEqual(objOne, objTwo) {
        if(objOne == null && objTwo == null) return true;
        if(objOne == null) return false;

        return objOne == objTwo;
    }


    isTruthy(object) {

        // need better logic for truthy function
        console.log('truthy object', object);
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

let tinyScript = new Lexer(input);
let programTokens = tinyScript.scanInput();

let tinyParser = new Parser(programTokens);
// console.log(tinyParser);
let ast = tinyParser.parse();
// console.log(ast);


let myInterpreter = new Interpreter();
console.log(myInterpreter.interpret(ast));




// We make the field static so that successive calls to run() inside a REPL session reuse the same interpreter. 
// That doesn’t make a difference now, but it will later when the interpreter stores global variables. 
// Those variables should persist throughout the REPL session.