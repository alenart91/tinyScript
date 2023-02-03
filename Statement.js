

class Expression {
    constructor(expression) {
        this.expression = expression;
    }

    accept(visitor) {
        return visitor.visitExpressionStmt(this);
    }
}


class Print {
    constructor(expression) {
        this.expression = expression;
    }

    accept(visitor) {
        return visitor.visitPrintStmt(this);
    }
}



class Declare {
    constructor(name, initializer) {
        this.name = name;
        this.initializer = initializer;
    }

    accept(visitor) {
        return visitor.visitDeclareStmt(this);
    }
}

module.exports = { Expression, Print, Declare };