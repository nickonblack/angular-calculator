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
                
                const binaryTree = new BinaryTree();
                binaryTree.insert(5).insert(4.44).insert("fsf");

                console.log(this.calculate(this.result));
                this.result = ResultType.error;
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
    multiply = "x",
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

    calculate = (): number => {
        if (this.op == Operation.notAnOperation) {
            return this.value;
        }

        // assert(this.left);
        // assert(this.right);
        let leftValue = this.left?.calculate();
        let rightValue = this.right?.calculate();
        
        switch (this.op) {
            case Operation.addition:
                this.value = this.left!.value + this.right!.value;
                break;
            case Operation.subtraction:
                this.value = this.left!.value - this.right!.value;
                break;
            case Operation.multiply:
                this.value = this.left!.value * this.right!.value;
                break;
            case Operation.division:
                this.value = this.left!.value / this.right!.value;
                break;
        }

        return this.value;
    } 
}
