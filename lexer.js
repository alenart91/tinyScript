const { optable } = require('./optable.js');
const { keywords } = require('./keywords.js');
const { Token } = require('./token.js');
const { input } = require('./program.js');

class Lexer {

    constructor(source) {
        this.cursor = 0;
        this.line = 1;
        this.column = 1;
        this.source = source;
        this.sourceLength = source.length;
        this.char = source.charAt(this.cursor);
        this.tokens = [];
};
  

    scanInput() {
    
        while(this.end()) {  
            
            this._process_space();

            let op = optable[this.char];
            op !== undefined ? op = this.char : op = undefined;

            switch(this.char) {
                case op:
                   
                    if (op === '/' && this.look() === '/') {
                        this._process_comment();
                        break;
                    }

                    if (op === '=' && this.look() === '=') {

                        this._process_token('COMPARE', '==');
                        break;
                    }

                    if(op === '<' && this.look() === '=') {

                        this._process_token('LESS_EQUAL', '<=');
                        break;
                    }

                    if(op === '>' && this.look() === '=') {

                        this._process_token('GREATER_EQUAL', '>=');
                        break;
                    }

                    if(op === '!' && this.look() === '=') {

                        this._process_token('NOT_EQUAL', '!=');
                        break;
                    }
                        
                    
                    let start = this.position();
                    this.forward();
                    let end = this.position();
                    this.tokens.push(new Token(op, this.char, start, end));
                    break;
                

                default:
                    
                    try {
                        if (this._isalpha(this.char))  this._process_identifier();
                        else if (this._isdigit(this.char))  this._process_number();
                        else if (this.char === '"' || this.char === "'")   this._process_string(this.char);
                        
                        else throw new Error(`Unexpected token error. ${this.char} is not a valid token at line ${this.line} column ${this.column}`);

                      } catch(err) {
                            // trigger end condition for main while loop
                            this.cursor = this.sourceLength;
                            return console.error(err.message);
                      }

                    break;
            }
     }
     
     // this.tokens.push(new Token(toks.EOF, "", null, this.line));
     return this.tokens;
    
};


    // Helper functions

    position() {
        return { cursor: this.cursor, line: this.line, column: this.column };
    }

    end() {
        return this.cursor < this.sourceLength;
    }

    look() {
        return this.source.charAt(this.cursor + 1);
    }

    current() {
        this.char = this.source.charAt(this.cursor); 
        return this.source.charAt(this.cursor);
    }

    forward() {
        this.cursor += 1;
        this.column += 1;
    }



    // Character test functions

    _iswhitespace(s) {
        return s == ' ' || s == '\t';
    }

  
    _isnewline(l) {
        return l === '\r' || l === '\n';
    }

    _isdigit(d) {
        return d >= '0' && d <= '9';
    }

    _isalpha(a) {
        return (a >= 'a' && a <= 'z') ||
            (a >= 'A' && a <= 'Z') ||
            a === '_' || a === '$';
    }

  
    
    _process_number() {

        let start = this.position();
        while(this._isdigit(this.current()) && this.end()) {
    
            this.forward();
        }
        
        let value = this.source.substring(start.cursor, this.cursor);
        let end = this.position();

        return this.tokens.push(new Token('NUMBER', value, start, end));
    
    }


    _process_comment() {
        
        let start = this.position();
        while(!this._isnewline(this.current()) && this.end()) {
    
            this.forward();
        }
        
        let value = this.source.substring(start.cursor, this.cursor);
        let end = this.position();

        return this.tokens.push(new Token('COMMENT', value, start, end));

    }


    _process_identifier() {
       
        let start = this.position();
        while(this._isalpha(this.current()) && this.end()) {
    
            this.forward();
        }
        
        let value = this.source.substring(start.cursor, this.cursor);
        let end = this.position();

        // return keyword token if it exists
        if(keywords.hasOwnProperty(value))  
            return this.tokens.push(new Token('KEYWORD', keywords[value], start, end));

        else 
            return this.tokens.push(new Token('IDENTIFIER', value, start, end));

    }



    _process_string(char) {

        let start = this.position();
        while(this.look() != char && this.end()) {
            this.forward();
        }

        try {

            if(!this.end()) {
                throw new Error(`Unterminated string at line ${this.line}`);
            }
        
            // get the closing quote
            this.forward();
            this.forward();

            let value = this.source.substring(start.cursor, this.cursor);
            let end = this.position();

            return this.tokens.push(new Token('STRING', value, start, end));

        } catch(err) {
            this.cursor = this.sourceLength;
            return console.error(err.message);
        }
    }



    _process_token(type, value) {
         let start = this.position();
         this.cursor += 2;
         this.column += 2;
         let end = this.position();
         return this.tokens.push(new Token(type, value, start, end));
    }


    _process_space() {
       
        while (this.end()) {

            if (this._iswhitespace(this.current())) {
                this.forward();    

            } else if (this._isnewline(this.current())) {
                this.forward();
                this.column = 1;
                this.line++;
            } else {
                break;
            }

        }
    };

};



let tinyScript = new Lexer(input);

tinyScript.scanInput();
console.log(tinyScript);
console.log(JSON.stringify(tinyScript, null, 2));

module.exports = { Lexer };