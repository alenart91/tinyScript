

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

module.exports = { Expression, Print, Declare, Global, Block, If, While, Loop, Stop, Continue };