const { optable } = require('./optable.js');
const { keywords } = require('./keywords.js');
const { Token } = require('./Token.js');
const { input } = require('./program.js');
const { readFileSync } = require('fs');

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
            let symbol;
            let op = optable[this.char];
            
            op !== undefined ? symbol = this.char : symbol = undefined;

            switch(this.char) {
                case ' ':
                    while(this.current() == ' ' && this.end()) this.forward();
                    break;
    
                case '\t':
                    this.forward();
                    break;

                case '\n': 
                    this.forward();
                    this.line++;
                    this.column = 1; 
                    break;

                case '\r': 
                    this.forward();
                    this.column = 1; 
                    break;
                
                case '/': this._process_token(this.look() == '/' ? '//' : '/'); break;
                case '=': this._process_token(this.match('=') ? '==' : '='); break;
                case '<': this._process_token(this.match('=') ? '<=' : '<'); break;
                case '>': this._process_token(this.match('=') ? '>=' : '>'); break;
                case '!': this._process_token(this.match('=') ? '!=' : '!'); break;
                case symbol: this._process_token(symbol); break;

                default:
                    
                    try {
                        if (this._isalpha(this.char))  this._process_identifier();
                        else if (this._isdigit(this.char))  this._process_number();
                        else if (this.char === '"' || this.char === "'")   this._process_string(this.char);
                        
                        else throw new Error(`Unexpected token error. ${this.char} is not a valid token at line ${this.line} column ${this.column}`);

                      } catch(err) {
                            // trigger end condition for main while loop
                            console.log('in lexer error');
                            this.cursor = this.sourceLength;
                            return console.error(err.message);
                      }

                    break;
            }
     }
     
     // this.tokens.push(new Token('EOF', ""));
     return this.tokens;
    
};

    // Helper functions
    match(token) {
        if(this.look() == token) {
            this.forward();
            return true;
        }

        return false;
    } 

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
        return this.source.charAt(this.cursor);
    }

    forward() {
        // increments the cursor and returns the previous token
        this.cursor++;
        this.column++;

        this.char = this.source.charAt(this.cursor);
        return this.source.charAt(this.cursor);
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

        while(this._isdigit(this.current()) && this.end()) this.forward();
        
        let value = this.source.substring(start.cursor, this.cursor);
        let end = this.position();

        return this.tokens.push(new Token('NUMBER', Number(value), start, end));
    }


    _process_comment() {

        while(!this._isnewline(this.current()) && this.end()) this.forward();
        return;
    }


    _process_identifier() {
        let start = this.position();

        while(this._isalpha(this.current()) && this.end()) this.forward();
        
        let value = this.source.substring(start.cursor, this.cursor);
        let end = this.position();
        
        let type;
        keywords.hasOwnProperty(value) ? type = keywords[value] : type = 'IDENTIFIER';
        return this.tokens.push(new Token(type, value, start, end));

    }



    _process_string(stringQuote) {
        let start = this.position();

        while(this.look() != stringQuote && this.end()) this.forward();

        if(!this.end()) throw new Error(`Unterminated string at line ${this.line}`);
        
        this.forward();
        this.forward();

        let value = this.source.substring(start.cursor, this.cursor);
        let end = this.position();
            
        return this.tokens.push(new Token('STRING', value, start, end));
    }



    _process_token(value) {
         let type = optable[value];
         if(type == 'COMMENT') return this._process_comment();

         let start = this.position();
         this.forward();
         let end = this.position();

         return this.tokens.push(new Token(type, value, start, end));
    }

};

const program = readFileSync('./source.txt', 'utf8');

let tinyScript = new Lexer(program);

tinyScript.scanInput();
console.log(tinyScript);
// console.log(JSON.stringify(tinyScript, null, 2));

module.exports = { Lexer }; 