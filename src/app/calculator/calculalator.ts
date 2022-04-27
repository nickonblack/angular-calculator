import { ResultType } from "app/models/result_type";
import { Action } from "app/models/action";
import { Expression } from "app/calculator/expression"

export class Calculator {

    result: string = ResultType.empty;

    compute(action:string) {
        switch (action) {
            case Action.clear:
                this.result = ResultType.empty;
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
                break;
            case Action.compute:
                console.log("Start Computing");

                try{
                    const expr = new Expression();
                    expr.createExpression(this.result);
                    const calculationResult = expr.calculateExpression();
                    const resultStr = `${calculationResult}`.replace(/\./g,',');;
                    this.result = resultStr;
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
}


