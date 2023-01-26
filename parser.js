const { Lexer } = require('./lexer.js');
const { input } = require('./program.js');
const { keywords } = require('./keywords.js');


class Parser {

    constructor(tokens) {
        this.tokens = tokens;
        this.lookAhead = this.tokens[this.position + 1];
        this.position = 0;
    }


    parse() {
        // check if there are any more tokens
        while(this.position < this.tokens.length) {
            
            return {
                type: 'Program',
                body: this.statement()  // this will recursivley build the AST from here
            }
        }
    }

    statement() {
        // let currentToken = this.tokens[this.position];
        // if(currentToken.type === 'KEYWORD') return this.variableDeclaration();

        // if(this.match(keywords['let']) || this.match(keywords['const'])) return this.variableDeclaration();
        // if(this.checkTokenType(keywords['let']) || this.checkTokenType(keywords['const'])) return this.variableDeclaration();
        // if(this.match(keywords['function'])) return this.functionDeclaration();

        // other statements like FOR, WHILE, RETURN, LEFT BRACE, PRINT ECT.
        return this.term();

    }




    term() {
        
        // recursively goes into the higher precendence grammar rules until it returns a value
        console.log('before factor');
        let left = this.factor();
        console.log('after factor');

       while(this.match('+', '-')) {
        
        let operator = this.getPreviousToken().value;
        let right = this.factor();
        left = new BinaryOperation(left, operator, right);
       }

        return left;
    }


    
    primary() {
        if(this.match('NUMBER', 'STRING')) {
            // console.log('primary value', this.getPreviousToken().value);
            return this.getPreviousToken().value;
        }
    }



    factor() {

        let left = this.primary();

        while(this.match('/', '*')) {

            let operator = this.getPreviousToken().value;
            let right = this.primary();
            
            // console.log('before left', left);
            left = new BinaryOperation(left, operator, right);
            // console.log(left);
        }

        return left;
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

        // console.log('get current token', this.getCurrentToken().type);
        // console.log('get current token value', this.getCurrentToken().value);

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
    
    // peek()
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
    // consume(type) {
    //     console.log('in consume', type);
    //     if (this.checkTokenType(type)) return this.advance();

    //    // throw this.error(this.peek(), message);
    // }
   

    // Then, the ( ... )* loop in the rule maps to a while loop. We need to know when to exit that loop. 
    // We can see that inside the rule, we must first find either a != or == token. So, if we don’t see one of 
    // those, we must be done with the sequence of equality operators. We express that check using a handy match() method.


    match(...types) {

        // console.log('types', types, ...types);

        for (let type of types) {

            // console.log('type checking:', type);

            if (this.checkTokenType(type)) {

                console.log('check token type match', type);
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


    parseError(message) {
        return message;
    }


};




class BinaryOperation {
    constructor(leftVal, operator, rightVal) {
        this.leftVal = leftVal;
        this.operator = operator;
        this.rightVal = rightVal;
    }

};





let tinyScript = new Lexer(input);
let programTokens = tinyScript.scanInput();


let tinyParser = new Parser(programTokens);
console.log(tinyParser.parse());
// let ast = tinyParser.parse();
// console.log('parser tokens', JSON.stringify(ast));



// loops through and looks for terminals like + or / and if it doesn't find them it moves down to items with higher
// precendence

// expression     → equality ;
// equality       → comparison ( ( "!=" | "==" ) comparison )* ;
// comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
// term           → factor ( ( "-" | "+" ) factor )* ;
// factor         → unary ( ( "/" | "*" ) unary )* ;
// unary          → ( "!" | "-" ) unary
//                | primary ;
// primary        → NUMBER | STRING | "true" | "false" | "nil"
//                | "(" expression ")" ;