const { Lexer } = require('./Lexer.js');
const { input } = require('./program.js');
const { keywords } = require('./keywords.js');

const Expr = require('./Expression.js');
const Stmt = require('./Statement.js');


class Parser {

    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
        this.statements = [];
    }


    parse() {

        while(!this.finished()) {
            this.statements.push(this.declaration());
        }

         return {
                type: 'Program',
                body: this.statements  // this.declaration()  // this will recursivley build the AST from here
            }

    }



    declaration() {

        try {
            if(this.match('declare')) return this.variableDecl();
            return this.statement();
        } catch(err) {
            // this.synchronize();
            return null;
        }

    }



    variableDecl() {
        let name = this.consume('IDENTIFIER', 'Expected variable name');

        let initializer = null;
        if(this.match('=')) {
            initializer = this.expression();
        }

        this.consume(';', 'Expected ; after variable declaration');
        return new Stmt.Declare(name.value, initializer);
    }


    statement() {
       
        try {
            if(this.match('print')) return this.printStatement();

            return this.expressionStatement();

        } catch(err) {
            console.error(err.message);
        }

    }


    printStatement() {
        let value = this.expression();
        this.consume(';', 'Expect ; after expression');
        return new Stmt.Print(value);
    
    }



    expressionStatement() {
        let expression = this.expression();
        this.consume(';', 'Expect ; after expression');
        return new Stmt.Expression(expression);
    }



    expression() {
        return this.equality();
    }




    equality() {
        let left = this.comparison();

        while(this.match('!=', '==')) {
            let operator = this.getPreviousToken().value;
            let right = this.comparison();
            left = new Expr.Equality(left, operator, right);
        }

        return left;

    }



    comparison() {

        let left = this.term();

        while(this.match('>', '<', '>=', '<=')) {
            let operator = this.getPreviousToken().value;
            let right = this.term();
            left = new Expr.Comparison(left, operator, right);
        }

        return left;
    }



    term() {
        
        // recursively goes into the higher precendence grammar rules until it returns a value
        let left = this.factor();

        while(this.match('+', '-')) {
        
        let operator = this.getPreviousToken().value;
        let right = this.factor();
        left = new Expr.BinaryOperation(left, operator, right);
       }

        return left;
    }



    factor() {

        let left = this.unary();

        while(this.match('/', '*')) {

            let operator = this.getPreviousToken().value;
            let right = this.unary();
            
            left = new Expr.BinaryOperation(left, operator, right);
        }

        return left;
    }



    unary() {
        
        if(this.match('-', '!')) {
            let operator = this.getPreviousToken().value;
            let right = this.unary();
            return new Expr.Unary(operator, right);
        }

        return this.primary();
    }


     
    primary() {

        if(this.match('true')) {
            let token = this.getPreviousToken();
            return new Expr.Literal(token.value, token.start, token.end);
        }

        if(this.match('false')) {
            let token = this.getPreviousToken();
            return new Expr.Literal(token.value, token.start, token.end);
        }

        if(this.match('NUMBER', 'STRING')) {
            
            let token = this.getPreviousToken();
            return new Expr.Literal(token.value, token.start, token.end);
        }

        if(this.match('IDENTIFIER')) {
            return new Expr.Variable(this.getPreviousToken().value);
        }

        if(this.match('(')) {
            
            let start = this.getPreviousToken().start;
            let left = this.expression();
            
            this.consume(')', 'Expected ) after expression');
            let end = this.getPreviousToken().end;

            return new Expr.Grouping(left, start, end);
        }

        // throw error();
    }




    finished() {
        return this.getCurrentToken() === undefined;
    }

    

    // The check() method returns true if the current token is of the 
    // given type. Unlike match(), it never consumes the token, it only looks at it.

    checkTokenType(tokenType) {

        if(this.finished()) {
            return false;
        }


        if(this.getCurrentToken().type == tokenType) {
            console.log('token type true', tokenType);
            return true;
        }

        // need to define grammar better for keywords and variables
        // return this.parseError('unexpected token type');

        // returning a value here makes every checkTokenType true which will cause the 
        // match to always trigger and the grammar rule while loops to keep looping
        return;
    }

    
    // It’s sort of like advance(), but doesn’t consume the character. This is called lookahead. 
    // Since it only looks at the current unconsumed character, we have one character of lookahead.
    
    getCurrentToken() {
        return this.tokens[this.position];
    }


    getPreviousToken() {
        return this.tokens[this.position - 1];
    }

    
    getNextToken() {
        return this.tokens[this.position + 1];
    }

    
    // After parsing the expression, the parser looks for the closing ) by calling consume().
    consume(type, message) {
        if (this.checkTokenType(type)) return this.advance();

        this.parseError(this.getCurrentToken(), message);
    }
   

    // Then, the ( ... )* loop in the rule maps to a while loop. We need to know when to exit that loop. 
    // We can see that inside the rule, we must first find either a != or == token. So, if we don’t see one of 
    // those, we must be done with the sequence of equality operators. We express that check using a handy match() method.


    match(...types) {

        for (let type of types) {

            if (this.checkTokenType(type)) {

                this.advance();
                return true;
            }
        }
        return false; 
    }
    

    // The advance() method consumes the next character in the source file and returns it.
    advance() {
        // updates the position property, but it get the previous token which is the current token in this instance
        // this means the position is updated and the current token is retrieved

        if(!this.finished()) {
            this.position++;
        }


        return this.getPreviousToken();

    }


    parseError(token, message) {
        console.log('parser error', token, message);
        throw new Error( `${message} instead of ${token}`);
    }


};



// let tinyScript = new Lexer(input);
// let programTokens = tinyScript.scanInput();


// let tinyParser = new Parser(programTokens);
// console.log(tinyParser.tokens);
// console.log(tinyParser.parse());
// let ast = tinyParser.parse();
// console.log('parser tokens', JSON.stringify(ast, null, 3));



module.exports = { Parser };