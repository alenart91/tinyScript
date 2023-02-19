TinyScript is a dynamic strongly typed language. It is an interpreted language interpreted by whatever JS engine is
used to run the code. This means memory is also handled by JS. TinyScript is pretty slow given the implementation, but
is meant to serve as more of a learning exercise on how high level language are built. A lot of the implementation was heavily inspired by Bob Nystrom and his "Crafting Interpreters" book. TinyScript uses an LL(1) Parser with a Tree-Walk
Interpreter. The interpreter implements the "visitor" pattern as it interprets each node in the AST.

Scope:

TinyScript uses lexical scoping. Variables and functions share the same namespace, which means if they're in the same scope they cannot share the same name. There is no hoisting. It uses semantic analysis to assign variables before runtime.


Native Functions:


Grammar:

Backus-Naur Form (BNF) notation:

<program>       ::=  <declaration>*

<declaration>   ::= <fnDecl> | <variableDecl> | <statement>

<fnDecl>        ::= "fn" <function>
<variableDecl>  ::= "declare" IDENTIFIER ( "=" <expression> )? ";"
<globalDecl>    ::= "global" IDENTIFIER ( "=" <expression> )? ";"


<statement>      ::= <exprStmt> | <loopStmt> | <whileStmt> | <stopStmt> | <continueStmt> | <ifStmt> | <returnStmt> |
                     <block>

<exprStmt>       ::= <expression> ";"
<loopStmt>       ::= "loop" "(" ( <varDecl> | <exprStmt> | ";" ) <expression>? ";" <expression>? ")" <statement>
<ifStmt>         ::= "if" "(" <expression> ")" <statement> ( "else" <statement> )?
<logStmt>        ::= "print" <expression> ";"
<returnStmt>     ::= "return" <expression>? ";"
<whileStmt>      ::= "while" "(" <expression> ")" <statement>
<stopStmt>       ::= "stop" ";"
<continueStmt>   ::= "continue" ";"
<block>          ::= "{" <declaration>* "}"



<expression>     ::= <assignment>
<assignment>     ::= IDENTIFIER "=" <assignment> | <logic_or>
<logic_or>       ::= <logic_and> ( "|" <logic_and> )*
<logic_and>      ::= <equality> ( "&" <equality> )*
<equality>       ::= <comparison> ( ( "!=" | "==" ) <comparison> )*
<comparison>     ::= <term> ( ( ">" | ">=" | "<" | "<=" ) <term> )*
<term>           ::= <factor> ( ( "-" | "+" ) <factor> )*
<factor>         ::= <unary> ( ( "/" | "*" ) <unary> )*
<unary>          ::= ( "!" | "-" ) <unary> | <call>
<call>           ::= <primary> "(" <arguments>? ")"
<primary>        ::= "true" | "false" | "null" | NUMBER | STRING | IDENTIFIER | "(" <expression> ")"



<function>       ::= IDENTIFIER "(" <parameters>? ")" <block>
<parameters>     ::= IDENTIFIER ( "," IDENTIFIER )*
<arguments>      ::= <expression> ( "," <expression> )*




Note: All of the examples are in the source.txt which is used to write the program that will be interpreted


Example Program:

declare v = 5;
declare x = 10;
declare p = 10;

if( v == x | v == p) return "something";

After running Lexical Analysis the Lexer outputs an array of tokens according to the optable and keywords. Comments
and whitespace are removed.

Tokens after running the Lexer:

tokens: [
    Token { type: 'IF', value: 'if', start: [Object], end: [Object] },
    Token {
      type: 'L_PAREN',
      value: '(',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'IDENTIFIER',
      value: 'v',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'COMPARE',
      value: '==',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'IDENTIFIER',
      value: 'x',
      start: [Object],
      end: [Object]
    },
    Token { type: 'OR', value: '|', start: [Object], end: [Object] },
    Token {
      type: 'IDENTIFIER',
      value: 'v',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'COMPARE',
      value: '==',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'IDENTIFIER',
      value: 'p',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'R_PAREN',
      value: ')',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'RETURN',
      value: 'return',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'STRING',
      value: '"something"',
      start: [Object],
      end: [Object]
    },
    Token { type: 'SEMI', value: ';', start: [Object], end: [Object] }
  ][
    Token {
      type: 'DECLARE',
      value: 'declare',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'IDENTIFIER',
      value: 'v',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'EQUALS',
      value: '=',
      start: [Object],
      end: [Object]
    },
    Token { type: 'NUMBER', value: 5, start: [Object], end: [Object] },
    Token { type: 'SEMI', value: ';', start: [Object], end: [Object] },
    Token {
      type: 'DECLARE',
      value: 'declare',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'IDENTIFIER',
      value: 'x',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'EQUALS',
      value: '=',
      start: [Object],
      end: [Object]
    },
    Token { type: 'NUMBER', value: 10, start: [Object], end: [Object] },
    Token { type: 'SEMI', value: ';', start: [Object], end: [Object] },
    Token {
      type: 'DECLARE',
      value: 'declare',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'IDENTIFIER',
      value: 'p',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'EQUALS',
      value: '=',
      start: [Object],
      end: [Object]
    },
    Token { type: 'NUMBER', value: 10, start: [Object], end: [Object] },
    Token { type: 'SEMI', value: ';', start: [Object], end: [Object] },
    Token { type: 'IF', value: 'if', start: [Object], end: [Object] },
    Token {
      type: 'L_PAREN',
      value: '(',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'IDENTIFIER',
      value: 'v',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'COMPARE',
      value: '==',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'IDENTIFIER',
      value: 'x',
      start: [Object],
      end: [Object]
    },
    Token { type: 'OR', value: '|', start: [Object], end: [Object] },
    Token {
      type: 'IDENTIFIER',
      value: 'v',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'COMPARE',
      value: '==',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'IDENTIFIER',
      value: 'p',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'R_PAREN',
      value: ')',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'RETURN',
      value: 'return',
      start: [Object],
      end: [Object]
    },
    Token {
      type: 'STRING',
      value: '"something"',
      start: [Object],
      end: [Object]
    },
    Token { type: 'SEMI', value: ';', start: [Object], end: [Object] }
  ]
 



The Parser returns:

{
  type: 'Program',
  body: [
    Declare { name: 'v', initializer: [Literal] },
    Declare { name: 'x', initializer: [Literal] },
    Declare { name: 'p', initializer: [Literal] },
    If { condition: [Logic], thenBranch: [Return], elseBranch: null }
  ]
}


The Interpreter will then evaluate each of these nodes.

