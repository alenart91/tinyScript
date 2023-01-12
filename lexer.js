const { optable } = require('./optable.js');
const { keywords } = require('./keywords.js');
const { Token } = require('./token.js');

// split lexer, parser and interpreter into three parts to make it modular

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
    
        while(this.cursor < this.sourceLength) {  
            
            // move this down?
            this._process_space();

            // Look it up in the table of operators
            // Hashmap should be O(1)
            let op = optable[this.char];
            op !== undefined ? op = this.char : op = undefined;

            let peep = this.source.charAt(this.cursor + 1);

            switch(this.char) {
                case op:
                    // if I can eliminate outer while loop for the parser we don't need break and can use 1 line
                    if (op === '/' && peep === '/') {
                        this._process_comment();
                        break;
                    }
                    // if (op === '=' && peep === '=') {
                    //     new Token('COMPARE', '==', start, end);
                    //     break;
                    // }
                        
                    
                    let start = this.position();
                    this.cursor++;
                    this.column++;
                    let end = this.position();
                    this.tokens.push(new Token(op, this.char, start, end));

                    this.char = this.source.charAt(this.cursor);
                    break;

                default:
                    console.log('in switch default');
                    try {
                        if (this._isalpha())  this._process_identifier();
                        else if (this._isdigit())  this._process_number();
                        else if (this.char === '"' || this.char === "'")   this._process_string();
        
                        else throw new Error(`Token error at ${this.cursor} ${this.char}`);

                      } catch(err) {
                        this.cursor = this.sourceLength;
                        return console.log(err.message);
                      }

                    break;
            }
     }

    // EOF (end of file) stuff goes here
}
    
    lookAhead(something) {
        return;
    }

    position() {
        return { cursor: this.cursor, line: this.line, column: this.column };
    }

    _iswhitespace() {
        return this.char == ' ' || this.char == '\t' || this.char == '\r';
    }

  
    _isnewline() {
        return this.char === '\r' || this.char === '\n';
    }

    _isdigit() {
        return this.char >= '0' && this.char <= '9';
    }

    _isalpha() {
        return (this.char >= 'a' && this.char <= 'z') ||
            (this.char >= 'A' && this.char <= 'Z') ||
            this.char === '_' || this.char === '$';
    }


    // make these 3 functions one flexible function
  
    _process_number() {

    let start = this.position();
    let endcursor = this.cursor;
    this.char = this.source.charAt(endcursor);

    while (endcursor < this.sourceLength && this._isdigit()) {
        endcursor++;
        this.column++;
        this.char = this.source.charAt(endcursor);
    }

    let value = this.source.substring(this.cursor, endcursor);
    this.cursor = endcursor;
    let end = this.position();

    return this.tokens.push(new Token('NUMBER', value, start, end));
    }

    _process_comment() {

    let start = this.position();
    let endcursor = this.cursor + 2;
    this.char = this.source.charAt(endcursor);

    while ((endcursor < this.sourceLength) && (!this._isnewline()) ) {
        endcursor++;
        this.column++;
        this.char = this.source.charAt(endcursor);
    }

    let value = this.source.substring(this.cursor, endcursor);
    this.cursor = endcursor + 1;
    let end = this.position();

    return this.tokens.push(new Token('COMMENT', value, start, end));
    }

    _process_identifier() {

        let start = this.position();
        let endcursor = this.cursor;
        this.char = this.source.charAt(endcursor);

        while (endcursor < this.sourceLength && this._isalpha()) {
            endcursor++;
            this.column++;
            this.char = this.source.charAt(endcursor);
        }

        let value = this.source.substring(this.cursor, endcursor);

        // update cursor to correct position
        this.cursor = endcursor;
        let end = this.position();

        // return keyword token if it exists
        if(keywords.hasOwnProperty(value))  
            return this.tokens.push(new Token('KEYWORD', keywords[value], start, end));

        else 
            return this.tokens.push(new Token('IDENTIFIER', value, start, end));
    };

    _process_string() {
    // this.cursor points at the opening quote. Find the ending quote.
    let start = this.position();
    let end_index = this.source.indexOf(this.char, this.cursor + 1);

    try {
    if (end_index === -1) {
        throw new Error(`Unterminated string at ${this.cursor}`);
    } 
        } catch(err) {

        // trigger end condition for main while loop
        this.cursor = this.sourceLength;
        return console.log(err.message);
    }
        
        this.char = this.source.charAt(end_index);
        let value = this.source.substring(this.cursor, end_index + 1);
        this.cursor = end_index + 1;
        let end = this.position();
        
        return this.tokens.push(new Token('STRING', value, start, end)); 
    }


    _process_space() {
       
        while (this.cursor < this.sourceLength) {
            this.char = this.source.charAt(this.cursor);

            // /r is carriage return
            if (this._iswhitespace()) {
            this.cursor++;
            this.column++;

            } else if (this._isnewline()) {
                this.cursor++;
                this.line++;
                this.column = 1;
            } else {
                break;
            }
        }
};

};




let input = `function myfn() {
    // this is a comment
    let a = 90;
    let mystring = "alex";
    if(myString == undefined) {
        return 'string is not defined';
    } else {
        return a;
    }
}`;

let inputTwo = `routine name<> { }`;

let inputThree = `function myfn() {
    let a = 'my string';
    // this variable is a string
}`;



let tinyScript = new Lexer(input);

tinyScript.scanInput();
console.log(tinyScript);