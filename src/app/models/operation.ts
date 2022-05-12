export enum Operation {
    multiplication = "x",
    division = "÷",
    leftBrace = "(",
    rightBrace = ")",
    addition = "+",
    subtraction = "-",
    notAnOperation = "N",
}

export namespace Operation {
    export function parse(operation: string): Operation {
        switch (operation) {
            case Operation.addition:
                return Operation.addition;
            case Operation.division:
                return Operation.division;
            case Operation.leftBrace:
                return Operation.leftBrace;
            case Operation.rightBrace:
                return Operation.rightBrace;
            case Operation.multiplication:
                return Operation.multiplication;
            case Operation.subtraction:
                return Operation.subtraction;
            default:
                return Operation.notAnOperation;
        }       
    }
}