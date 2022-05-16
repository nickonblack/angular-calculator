import { ResultType } from "app/models/result_type";
import { Action } from "app/models/action";
import { Expression } from "app/calculator/expression"

export class Calculator {

    result: string = ResultType.empty;
    // предыдущее значение текстового поля. Для анализа и сравнения
    prevResult: string = ResultType.empty;

    compute(action:string) {
        switch (action) {
            case Action.clear:
                this.result = ResultType.empty;
                this.prevResult = this.result;
                break;
            case Action.fraction:
                // если в конце строки есть запятая, то не добавляем ее 
                if (this.result.endsWith(",")) {
                    return;
                }

                // для нахождения чисел необходимо с помощью regex необходимы . вместо ,
                const resultToParse = this.result.replace(/,/g, '.');
                
                const floats = resultToParse.match(/[+-]?\d+(\.\d+)?/g)?.map(item => parseFloat(item));

                if ((floats !== undefined) && ((floats?.length ?? []) > 0)) {
                    // если последнее число уже float, то запятая не нужна  
                    if (!Number.isInteger(floats![floats!.length - 1])) {
                        return;
                    }
                }
                
                this.result += action;
                this.prevResult = this.result;
                break;
            case Action.compute:
                console.log("Start Computing");

                try{
                    const expr = new Expression();
                    expr.createExpression(this.result);
                    const calculationResult = expr.calculateExpression();
                    const resultStr = `${calculationResult}`.replace(/\./g,',');;
                    this.result = resultStr;
                    this.prevResult = this.result;
                } catch (e) {
                    this.result = ResultType.error;
                    this.prevResult = this.result; 
                }
                break;
            default:
                if ((<any>Object).values(ResultType).includes(this.result)) {
                    this.result = action;
                    this.prevResult = this.result; 
                } else {
                    this.result += action;
                    this.prevResult = this.result; 
                }
                break;
        }
    };
}


