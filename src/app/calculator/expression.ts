import { SpecialSign } from "app/models/special_sign";
import { Operation } from "app/models/operation";
import { isIn } from "app/utils/help_funcs";

declare namespace Expression {
    type RavCalcExp = typeof Expression.RavCalcExp.prototype
}

export class Expression {

    value: number = 0;
    op: Operation = Operation.notAnOperation;
    left: Expression | undefined
    right: Expression | undefined

    //Обертка вокруг стринги(для мутабельности при передачи в функцию)
    //TODO:- стоит вынести в отдельное поле класса Expression
    static RavCalcExp = class {
        value: string;
        constructor(expr: string) {
            this.value = expr;
        }
    }

    // убираем пробелы в строке
    private skipSpaces = (inString: string): string => {
        return inString.replace(/ /g, '.');
    }

    // проверка является ли числом строка
    private isNumber(value: string | number): boolean {
        return ((value != null) && ((value != undefined)) && (value !== '') &&
           !isNaN(Number(value.toString())));
    }

    // парсинг числа   
    private parseFloat = (model: Expression.RavCalcExp): number | null => {
        const remainingStr = this.skipSpaces(model.value);

        let countDots = 0;

        // включает в себя специальные символы
        const includeSpecialSigns = function (constter: string) {  
            return (constter == Operation.addition) || (constter == Operation.subtraction);
        };

        let numSize: number = 0;
        if (remainingStr.length > 0) {
            if (this.isNumber(remainingStr[numSize]) ||  (remainingStr[numSize] == '.')) {
                // если начинается с числа или точки    
                if (remainingStr[numSize] == ".") 
                ++countDots;
            } else if (includeSpecialSigns(remainingStr[numSize]) && remainingStr.length > 1 && this.isNumber(remainingStr[1])) {
                numSize = 1;
                // если начинается с + или - и далее идет число
            } else {
                return null;
            }
            
            while (numSize < remainingStr.length && (this.isNumber(remainingStr[numSize]) ||  remainingStr[numSize] == '.') && (countDots < 2)) {
                ++numSize;
                if (remainingStr[numSize] == ".") 
                ++countDots;
            }

            model.value = remainingStr.substring(numSize);
            return parseFloat(remainingStr.substring(0,numSize));
        }
        
        return null;
    }

    // парсинг оператора
    private parseOperator = (model: Expression.RavCalcExp): Operation | null => {
        const remainingStr = this.skipSpaces(model.value);
        let op: Operation | null = null;

        if (remainingStr.length === 0) {
            return op;
        } 

        switch (remainingStr[0]) {
            case Operation.addition:
                op = Operation.addition; 
                break;
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
    private parseAddSub = (model: Expression.RavCalcExp): Expression => {
        let left = this.parseMulDiv(model); 

        while (true) {
            let op: Operation | null = Operation.notAnOperation;
            const remainStr = new Expression.RavCalcExp(model.value);
            op = this.parseOperator(remainStr);
            if ((op == null) || (op != Operation.addition && op != Operation.subtraction)) {
                return left;
            }
            model.value = remainStr.value;

            let right: Expression | null = null;

            try {
                right = this.parseMulDiv(model);
            } catch (e) {
                throw e;
            }

            try {
                const expr = new Expression();
                expr.left = left;
                expr.right = right
                expr.op = op;
                left = expr;
            } catch (e) {
                throw e;
            }
        }

        return left;
    }

    // парсинг умножения-деления
    private parseMulDiv =  (model: Expression.RavCalcExp): Expression => {
        let left = this.parseAtom(model);

        while (true) {
            let op: Operation | null = Operation.notAnOperation;
            const remainStr = new Expression.RavCalcExp(model.value);
            op = this.parseOperator(remainStr);
            if ((op == null) || (op != Operation.division && op != Operation.multiplication)) {
                return left;
            }
            model.value = remainStr.value;

            let right: Expression | null = null;
            try {
                right = this.parseAtom(model);
            } catch (e) {
                throw e;
            }

            try {
                const expr = new Expression();
                expr.left = left;
                expr.right = right
                expr.op = op;
                left = expr;
            } catch (e) {
                throw e;
            }
            
        }

        return left; 
    }

    // парсинг числа
    private parseAtom = (model: Expression.RavCalcExp): Expression => {
        const expr: Expression = new Expression();

        // Если находим левую скобку запускаем заново вычисление выражения
        if (model.value[0] == Operation.leftBrace) {
            // скобку и запускаем заново вычисление
            model.value = model.value.substring(1);
            const subExpr =  this.parseAddSub(model);

            if (model.value.length == 0) {
                //неожиданный конец выражения
                throw new Error();
            }

            // если находим правую скобку, то возвращаем результат
            if (model.value[0] == Operation.rightBrace){
                model.value = model.value.substring(1);
                return subExpr;
            } else {
                //нет закрывающей скобки 
                throw new Error();
            }

        } else {
            const newNumber = this.parseFloat(model);

            if (newNumber == null) {
                throw new Error();
            }
            expr.value = newNumber;
            return expr;
        }
    }

    // вычисление выражения 
    calculateExpression = (): number => {
        if (this.op == Operation.notAnOperation) {
            return this.value;
        }

        // assert(this.left);
        // assert(this.right);
        const leftValue = this.left?.calculateExpression();
        const rightValue = this.right?.calculateExpression();
        
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
        let modifiedStr = this.replaceAllMathSigns(inString.replace(/,/g, '.'));
        modifiedStr = this.fillAllMultSigns(modifiedStr);
        const leftBracketsCount =  (modifiedStr.match(/\(/g) || []).length;
        const rightBracketsCount =  (modifiedStr.match(/\)/g) || []).length;

        // базовая проверка, количество закрывающихся скобок должно быть равно открывающимся
        if (leftBracketsCount != rightBracketsCount)
            throw new Error();

        const calcExpression = new Expression.RavCalcExp(modifiedStr);

        const ext = this.parseAddSub(calcExpression);
        this.op = ext.op;
        this.left = ext.left
        this.right = ext.right
        this.value = ext.value;
        return;
    }

    private replaceAllMathSigns = (value: string): string => {
        let resultStr = value;

        let specialSignIndex = resultStr.indexOf(SpecialSign.pi);
        while (specialSignIndex != -1) {
            const leftToSpecialSignIndex = specialSignIndex - 1;
            let rightToSpecialSignIndex = specialSignIndex + 1;
            if (isIn(leftToSpecialSignIndex, resultStr) && Operation.parse(resultStr[leftToSpecialSignIndex]) == Operation.notAnOperation) {
                resultStr = resultStr.substring(0, specialSignIndex) + Operation.multiplication + resultStr.substring(specialSignIndex);
                rightToSpecialSignIndex+=1;
            }

            if (isIn(rightToSpecialSignIndex, resultStr) && Operation.parse(resultStr[rightToSpecialSignIndex]) == Operation.notAnOperation) {
                resultStr = resultStr.substring(0, rightToSpecialSignIndex) + Operation.multiplication + resultStr.substring(rightToSpecialSignIndex);
            }

            resultStr = resultStr.replace(SpecialSign.pi,Math.PI.toString());
            specialSignIndex = resultStr.indexOf(SpecialSign.pi);
        }

        specialSignIndex = resultStr.indexOf(SpecialSign.e);
        while (specialSignIndex != -1) {
            const leftToSpecialSignIndex = specialSignIndex - 1;
            let rightToSpecialSignIndex = specialSignIndex + 1;
            if (isIn(leftToSpecialSignIndex, resultStr) && Operation.parse(resultStr[leftToSpecialSignIndex]) == Operation.notAnOperation) {
                resultStr = resultStr.substring(0, specialSignIndex) + Operation.multiplication + resultStr.substring(specialSignIndex);
                rightToSpecialSignIndex+=1;
            }

            if (isIn(rightToSpecialSignIndex, resultStr) && Operation.parse(resultStr[rightToSpecialSignIndex]) == Operation.notAnOperation) {
                resultStr = resultStr.substring(0, rightToSpecialSignIndex) + Operation.multiplication + resultStr.substring(rightToSpecialSignIndex);
            }

            resultStr = resultStr.replace(SpecialSign.e,Math.E.toString());
            specialSignIndex = resultStr.indexOf(SpecialSign.e);
        }

        return resultStr;
    }

    //Проставляем все знаки умножения( в основном до и после скобок)
    private fillAllMultSigns = (value: string): string => {
        let resultStr = value;

        // ищем все левые скобки
        let count = [...resultStr.matchAll(/\(/g)].map(a => a.index).length

        for (let i = 0; i < count ; ++i) {
            let specialSignIndex = [...resultStr.matchAll(/\(/g)].map(a => a.index)[i] ?? 0;
            let leftToSpecialSignIndex = specialSignIndex -1;
            if (isIn(leftToSpecialSignIndex, resultStr)) {
                const op =  Operation.parse(resultStr[leftToSpecialSignIndex]);
                if (op == Operation.notAnOperation || op == Operation.rightBrace) {
                    resultStr = resultStr.substring(0, specialSignIndex) + Operation.multiplication + resultStr.substring(specialSignIndex);
                }
            }
        }

        // ищем все правые скобки
        count = [...resultStr.matchAll(/\)/g)].map(a => a.index).length

        for (let i = 0; i < count ; ++i) {
            let specialSignIndex = [...resultStr.matchAll(/\)/g)].map(a => a.index)[i] ?? 0;
            let rightToSpecialSignIndex = specialSignIndex + 1;
            if (isIn(rightToSpecialSignIndex, resultStr)) {
                const op =  Operation.parse(resultStr[rightToSpecialSignIndex]);
                if (op == Operation.notAnOperation || op == Operation.leftBrace) {
                    resultStr = resultStr.substring(0, specialSignIndex) + Operation.multiplication + resultStr.substring(specialSignIndex);
                }
            }
        }

        return resultStr;
    }
}