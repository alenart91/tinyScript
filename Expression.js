
class Equality {
    constructor(leftVal, operator, rightVal) {
        this.leftVal = leftVal;
        this.operator = operator;
        this.rightVal = rightVal;
        this.type = 'Equality';
    }
}



class Comparison {
    constructor(leftVal, operator, rightVal) {
        this.leftVal = leftVal;
        this.operator = operator;
        this.rightVal = rightVal;
        this.type = 'Comparison';
    }
}



class Unary {
    constructor(operator, literal) {
        this.operator = operator;
        this.literal = literal;
        this.type = 'Unary';
    }
};


class Grouping {
    constructor(expression, start, end) {
        this.expression = expression;
        this.start = start;
        this.end = end;
        this.type = 'Grouping';
    }

    accept(visitor) {
        return visitor.visitGroupingExpr(this);
    }
}



class BinaryOperation {
    constructor(leftVal, operator, rightVal) {
        // super();
        this.leftVal = leftVal;
        this.operator = operator;
        this.rightVal = rightVal;
        this.type = 'Binary';
    }

    accept(visitor) {
        return visitor.visitBinaryExpr(this);
    }  
};



class Variable {
    constructor(name) {
        this.name = name;
    }

    accept(visitor) {
        return visitor.visitVariableExpr(this);
    }
}



class Literal {
    constructor(value, start, end) {
        this.value = value;
        this.start = start;
        this.end = end;
        this.type = 'Literal';
    }

    accept(visitor) {
        return visitor.visitLiteralExpr(this);
    }
}



module.exports = { Equality, Comparison, Unary, Grouping, BinaryOperation, Variable, Literal };