

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

class Global {
    constructor(name, initializer) {
        this.name = name;
        this.initializer = initializer;
    }

    accept(visitor) {
        return visitor.visitGlobalStmt(this);
    }
}



class Block {
    constructor(statements) {
        this.statements = statements;
    }

    accept(visitor) {
        return visitor.visitBlockStmt(this);
    }
}


class Function {
    constructor(name, params, body) {
        this.name = name;
        this.params = params;
        this.body = body;
        this.type = 'FUNCTION';
    }

    accept(visitor) {
        return visitor.visitFunctionStmt(this);
    }
}


class If {
    constructor(condition, thenBranch, elseBranch) {
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;

    }

    accept(visitor) {
        return visitor.visitIfStmt(this);
    }
}


class While {
    constructor(condition, body) {
        this.condition = condition;
        this.body = body;
    }

    accept(visitor) {
        return visitor.visitWhileStmt(this);
    }
}

class Loop {
    constructor(initializer, condition, increment, body) {
        this.initializer = initializer;
        this.condition = condition;
        this.increment = increment;
        this.body = body;
    }

    accept(visitor) {
        return visitor.visitLoopStmt(this);
    }
}


class Stop {
    constructor() {
        this.type = 'STOP';
    }

    accept(visitor) {
        return visitor.visitStopStmt(this);
    }
}


class Continue {
    constructor() {
        this.type = 'CONTINUE';
    }

    accept(visitor) {
        return visitor.visitContinueStmt(this);

    }
}



class Return {
    constructor(keyword, value) {
        this.keyword = keyword;
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitReturnStmt(this);
    }
}


class Push {
    constructor(name, listVal, value) {
        this.name = name;
        this.listVal = listVal;
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitPushStmt(this);
    }
}

module.exports = { Expression, Print, Declare, Global, Block, Function, If, While, Loop, Stop, Continue, Return, Push };