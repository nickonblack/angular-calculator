import { ReturnStatement } from '@angular/compiler';
import { BinaryTree } from '../classes/tree/tree_node';

export class Calculator {

    result: string = ResultType.default;

    compute(action:string) {
        switch (action) {
            case Actions.clear:
                this.result = ResultType.default;
                break;
            case Actions.fraction:
                // если в конце строки есть 
                if (this.result.endsWith(",")) {
                    return;
                }

                // для нахождения чисел необходимо с помощью regex необходимы . вместо ,
                let newText = this.result.replace(/,/g, '.');

                const regex = /[+-]?\d+(\.\d+)?/g;
                
                let floats = newText.match(regex)?.map(item => parseFloat(item));

                if ((floats !== undefined) && ((floats?.length ?? []) > 0)) {
                    const lastIndex = floats!.length;
                    const lastNumber = floats![lastIndex - 1];

                    // если последнее число уже float, то запятая нек нужна  
                    if (!Number.isInteger(lastNumber)) {
                        return;
                    }
                }
                
                this.result += action;
                break;
            case Actions.compute:
                console.log("Start Computing");
                
                try{
                    let expr = new Expression();
                    expr.createExpression(this.result);
                    let result = expr.calculateExpression();
                    console.log(result);

                    // console.log(this.calculate(this.result));
                    this.result = `${result}`;
                } catch (e) {
                    this.result = ResultType.error;
                }
                
                break;
            default:
                if ((<any>Object).values(ResultType).includes(this.result)) {
                    this.result = action;
                } else {
                    this.result += action;
                }
                break;
        }
    };
    
    calculate(fn:string) {
        return new Function('return ' + fn)();
    } 

    private toNumber(value: string): number | null {
      let resStr = this.replaceAllMathSigns(value);
      console.log(resStr);
      return 1;
    }

    private replaceAllMathSigns(value: string): string {
        return value.replace(SpecialSign.pi, Math.PI.toString()).replace(SpecialSign.e, Math.E.toString());
    }
}

export enum ResultType {
    default = "0",
    error = "некорректное выражение",
}

export enum Actions {
    clear = "C",
    compute = "=",
    fraction = ",",
}

export enum SpecialSign {
    pi = 'π',
    e = 'e',
}

export enum Operation {
    multiplication = "x",
    division = "÷",
    leftBrace = "(",
    rightBrace = ")",
    addition = "+",
    subtraction = "-",
    notAnOperation = "N",
}

class Expression {
    value: number = 0;
    op: Operation = Operation.notAnOperation;
    left: Expression | undefined
    right: Expression | undefined

    // убираем пробелы в строке
    private skipSpaces = (inString: string): string => {
        return inString.replace(/ /g, '.');
    }

    private isNumber(value: string | number): boolean {
        return ((value != null) && ((value != undefined)) && (value !== '') &&
           !isNaN(Number(value.toString())));
    }

    parseFloat = (model: RavCalcExp): number | null => {
        var remainingStr = this.skipSpaces(model.value);
        var result: number;

        var numSize: number = 0;
        if (remainingStr.length > 0 && this.isNumber(remainingStr[0])) {
            while (numSize < remainingStr.length && this.isNumber(remainingStr[numSize])) {
                ++numSize;
            }
            
            result = parseFloat(remainingStr.substring(0,numSize));
            model.value = remainingStr.substring(numSize);
            return result;
        }
        return null;
    }

    // парсинг оператора
    parseOperator = (model: RavCalcExp): Operation | null => {
        var remainingStr = this.skipSpaces(model.value);
        var op: Operation | null = null;
        var numSize: number = 0;

        if (remainingStr.length == 0) {
            return op;
        } 

        switch (remainingStr[0]) {
            case Operation.addition:
                op = Operation.addition; break;
            case Operation.division:
                op = Operation.division; break;
            case Operation.multiplication:
                op = Operation.multiplication; break;
            case Operation.subtraction:
                op = Operation.subtraction; break;
            default:
                op = null; break;
        }

        if (op != null) {
            model.value = remainingStr.substring(1);
        }
        
        return op;
    }

    // парсинг сложения-вычитания
    parseAddSub = (model: RavCalcExp): Expression => {
        var left = this.parseMulDiv(model); 

        while (true) {
            var op: Operation | null = Operation.notAnOperation;
            var remainStr = new RavCalcExp(model.value);
            op = this.parseOperator(remainStr);
            if ((op == null) || (op != Operation.addition && op != Operation.subtraction)) {
                return left;
            }
            model.value = remainStr.value;

            var right: Expression | null = null;

            try {
                right = this.parseMulDiv(model);
            } catch (e) {
                this.disposeExpression(left);
                throw e;
            }

            try {
                let expr = new Expression();
                expr.left = left;
                expr.right = right
                expr.op = op;
                left = expr;
            } catch (e) {
                this.disposeExpression(left);
                this.disposeExpression(right);
                throw e;
            }
        }

        return left;
    }

    // парсинг умножения-деления
    parseMulDiv =  (model: RavCalcExp): Expression => {
        var left = this.parseAtom(model);

        while (true) {
            var op: Operation | null = Operation.notAnOperation;
            var remainStr = new RavCalcExp(model.value);
            op = this.parseOperator(remainStr);
            if ((op == null) || (op != Operation.division && op != Operation.multiplication)) {
                return left;
            }
            model.value = remainStr.value;

            var right: Expression | null = null;
            try {
                right = this.parseAtom(model);
            } catch (e) {
                this.disposeExpression(left);
                throw e;
            }

            try {
                let expr = new Expression();
                expr.left = left;
                expr.right = right
                expr.op = op;
                left = expr;
            } catch (e) {
                this.disposeExpression(left);
                this.disposeExpression(right);
                throw e;
            }
            
        }

        return left; 
    }

    // парсинг числа
    parseAtom = (model:RavCalcExp): Expression => {
        let expr: Expression = new Expression();
        let newNumber = this.parseFloat(model);

        if (newNumber == null) {
            throw new Error();
        }
        expr.value = newNumber;
        return expr;
    }


    disposeExpression = (model: Expression) => {
        //this.result = ResultType.default;
    }

    // вычисление выражения 
    calculateExpression = (): number => {
        if (this.op == Operation.notAnOperation) {
            return this.value;
        }

        // assert(this.left);
        // assert(this.right);
        let leftValue = this.left?.calculateExpression();
        let rightValue = this.right?.calculateExpression();
        
        switch (this.op) {
            case Operation.addition:
                this.value = this.left!.value + this.right!.value;
                break;
            case Operation.subtraction:
                this.value = this.left!.value - this.right!.value;
                break;
            case Operation.multiplication:
                this.value = this.left!.value * this.right!.value;
                break;
            case Operation.division:
                this.value = this.left!.value / this.right!.value;
                break;
        }
        return this.value;
    }

    createExpression = (inString: string) => {
        let calcExpression = new RavCalcExp(inString);

        let ext = this.parseAddSub(calcExpression);
        this.op = ext.op;
        this.left = ext.left
        this.right = ext.right
        this.value = ext.value;
        return;
    }
}


export class RavCalcExp{
    value: string = "0"

    constructor(expr: string) {
        this.value = expr;
    }
}