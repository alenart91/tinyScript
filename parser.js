const { Lexer } = require('./Lexer.js');
const { keywords } = require('./keywords.js');
const { input } = require('./p.js');

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
                body: this.statements  // Array of statements that make up the AST
            }

    }




    declaration() {

        try {
            if(this.match('DECLARE')) return this.variableDecl();
            return this.statement();

        } catch(err) {
            console.error(err.message);
            this.sync();
            // console.error(err.message);
            // this.position++;
            return null;
        }

    }

    
    // looks for the next statement or declaration to parse
    // discards tokens until it reaches one that can appear at taht specific point in a prod rule
    sync() {
        this.advance();

        while(!this.finished()) {
            if(this.getPreviousToken().type == 'SEMI') return;

            switch(this.getCurrentToken().type) {
                case 'DECLARE':
                case 'PRINT':
                case 'FN':
                case 'IF':
                case 'WHILE':
                case 'FOR':
                case 'RETURN':
                    return;
            }

            this.advance();
        }
        
    }




    variableDecl() {
        let name = this.consume('IDENTIFIER', 'Expected variable name');
        let initializer = null;

        if(this.match('EQUALS')) {
            initializer = this.expression();
        }

        this.consume('SEMI', 'Expected ; after variable declaration');
        return new Stmt.Declare(name.value, initializer);
    }


    
    statement() {
            // console.log('in statement', this.tokens[this.position]);
        // try {
            if(this.match('IF')) return this.ifStatement();
            if(this.match('WHILE')) return this.whileStatement();
            if(this.match('LOOP')) return this.loopStatement();
            if(this.match('STOP')) return this.stopStatement();
            if(this.match('PRINT')) return this.printStatement();
            if(this.match('L_BRACE')) return new Stmt.Block(this.block());

            return this.expressionStatement();

        // } catch(err) {
        //     console.log('in parser error');
        //     console.error(err.message);
        // }

    }


    ifStatement() {
        // console.log('in if stmt');
        this.consume('L_PAREN', 'Expect ( after if statement');
        let condition = this.expression();
        this.consume('R_PAREN', 'Expect ) after if condition');

        let thenBranch = this.statement();
        let elseBranch = null;

        if(this.match('ELSE')) elseBranch = this.statement();

        return new Stmt.If(condition, thenBranch, elseBranch);
    }


    whileStatement() {
        this.consume('L_PAREN', 'Expected ( after while keyword');
        let condition = this.expression();
        this.consume('R_PAREN', 'Expect ) after condition');
        let body = this.statement();

        return new Stmt.While(condition, body);
    }


    loopStatement() {
        this.consume('L_PAREN', 'Expected ( after for keyword');

        let initializer;

        if(this.match('SEMI')) {
            initializer = null;
        } else if(this.match('DECLARE')) {
            initializer = this.variableDecl();
        } else {
            initializer = this.expressionStatement();
        }

        let condition = null;
        if(!this.checkTokenType('SEMI')) {
            condition = this.expression();
        }

        this.consume('SEMI', 'Expect ; after loop condition');

        let increment = null;

        if(!this.checkTokenType('R_PAREN')) {
            increment = this.expression();
        }

        this.consume('R_PAREN', 'Expect ) after for clauses');

        let body = this.statement();

        if(body == 'STOP');

        if(increment != null) {
            body = new Stmt.Block([body, new Stmt.Expression(increment)]);
        }

        if(condition == null) condition = Expr.Literal(true);
        body = new Stmt.While(condition, body);

        if(initializer != null) body = new Stmt.Block([initializer, body]);

        return body;

    }


    stopStatement() {
        
    }


    printStatement() {
        let value = this.expression();
        this.consume('SEMI', 'Expect ; after expression');
        return new Stmt.Print(value);
    
    }


    block() {
        // console.log('in block');
        let statements = [];

        // console.log('token type', this.getCurrentToken().type);

        while(this.getCurrentToken().type != 'R_BRACE' && !this.finished()) {
            // console.log('triggered block statement');
            statements.push(this.declaration());
        }

        this.consume('R_BRACE', 'Expect } after block');
        return statements;
    }

//    An expression statement is an expression used in a place where a statement is expected. 
//    The expression is evaluated and its result is discarded
//    therefore, it makes sense only for expressions that have side effects, 
//    such as executing a function or updating a variable.

//    a function call such as: this.evaluate(something); would create a side effect potentially,
//    but the result isn't stored in memory anywhere

    expressionStatement() {
        let expression = this.expression();
        this.consume('SEMI', 'Expect ; after expression');
        return new Stmt.Expression(expression);
    }



    expression() {
        return this.assignment();
    }



    assignment() {
        let expression = this.or();
        // let left = this.equality();

        if(this.match('EQUALS')) {
            let equals = this.getPreviousToken().value;
            let val = this.assignment();

            // console.log('in assign match', val);
            // console.log('left', left);
            
            if(expression instanceof Expr.Variable) {


                let name = expression.name;
                // console.log('left', left);
                return new Expr.Assignment(name, val);
            }

            // this.parseError(equals, 'Invalid assignment');
        }

        return expression;
    }


    or() {
        let expression = this.and();

        while(this.match('OR')) {
            let operator = this.getPreviousToken().value;
            console.log('operator', operator);
            let right = this.and();
            expression = new Expr.Logic(expression, operator, right);
        }

        return expression;
    }



    and() {
        let expression = this.equality();

        while(this.match('AND')) {
            let operator = this.getPreviousToken().value;
            let right = this.equality();
            expression = new Expr.Logic(expression, operator, right);
        }

        return expression;
    }




    equality() {
        let left = this.comparison();

        while(this.match('NOT_EQUAL', 'COMPARE')) {
            let operator = this.getPreviousToken().value;
            let right = this.comparison();
            left = new Expr.Equality(left, operator, right);
        }

        return left;

    }



    comparison() {

        let left = this.term();

        while(this.match('R_ANG', 'L_ANG', 'GREATER_EQUAL', 'LESS_EQUAL')) {
            let operator = this.getPreviousToken().value;
            let right = this.term();
            left = new Expr.BinaryOperation(left, operator, right);
        }

        return left;
    }



    term() {
        
        // recursively goes into the higher precendence grammar rules until it returns a value
        let left = this.factor();

        while(this.match('PLUS', 'MINUS')) {
        
        let operator = this.getPreviousToken().value;
        let right = this.factor();
        left = new Expr.BinaryOperation(left, operator, right);
       }

        return left;
    }



    factor() {

        let left = this.unary();

        while(this.match('DIVIDE', 'MULTIPLY')) {

            let operator = this.getPreviousToken().value;
            let right = this.unary();
            
            left = new Expr.BinaryOperation(left, operator, right);
        }

        return left;
    }



    unary() {
        
        if(this.match('MINUS', 'EXCLAMATION')) {
            let operator = this.getPreviousToken().value;
            let right = this.unary();
            return new Expr.Unary(operator, right);
        }

        return this.primary();
    }


     
    primary() {

        if(this.match('TRUE')) {
            let token = this.getPreviousToken();
            return new Expr.Literal(token.value, token.start, token.end);
        }

        if(this.match('FALSE')) {
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

        if(this.match('L_PAREN')) {
            
            let start = this.getPreviousToken().start;
            let left = this.expression();
            
            this.consume('R_PAREN', 'Expected ) after expression');
            let end = this.getPreviousToken().end;

            return new Expr.Grouping(left, start, end);
        }

        throw new Error('Expected an expression');
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
            // console.log('token type true', tokenType);
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
        throw new Error( `${message} instead of ${token.value}`);
    }


};


// try {
// let tinyScript = new Lexer(input);
// let programTokens = tinyScript.scanInput();


// let tinyParser = new Parser(programTokens);
// // console.log(tinyParser.tokens);
// tinyParser.parse();

// } catch(err) {
//     return console.error(err.message);
// }



let tinyScript = new Lexer(input);
let programTokens = tinyScript.scanInput();


let tinyParser = new Parser(programTokens);
// console.log(tinyParser.tokens);
console.log(tinyParser.parse());

// let ast = tinyParser.parse();
// console.log('parser tokens', JSON.stringify(ast, null, 3));



module.exports = { Parser };