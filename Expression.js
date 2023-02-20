class Assignment {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.type = 'Assignment';
    }

    accept(visitor) {
        return visitor.visitAssignmentExpr(this);
    }
}



class Equality {
    constructor(leftVal, operator, rightVal) {
        this.leftVal = leftVal;
        this.operator = operator;
        this.rightVal = rightVal;
        this.type = 'Equality';
    }

    accept(visitor) {
        return visitor.visitBinaryExpr(this);
    }
}



class Function {
    constructor(parameters, body) {
        this.parameters = parameters;
        this.body = body;
    }

    accept(visitor) {
        return visitor.visitFunctionExpr(this);
    }
}


class Call {
    constructor(callee, paren, args) {
        this.callee = callee;
        this.paren = paren;
        this.args = args;
        this.type = 'CALL';
    }

    accept(visitor) {
        return visitor.visitCallExpr(this);
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
        // console.log('in var expression', this);
        return visitor.visitVariableExpr(this);
    }
}


class List {
    constructor(items) {
        this.items = items;
    }

    accept(visitor) {
        return visitor.visitListExpr(this);
    }
}


class Logic {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept(visitor) {
        return visitor.visitLogicalExpr(this);
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



module.exports = { Assignment, Equality, Function, Call, Unary, Grouping, BinaryOperation, Variable, Logic, List, Literal };