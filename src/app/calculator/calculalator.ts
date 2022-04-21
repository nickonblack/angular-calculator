export class Calculator {

    result: string = ResultType.default;

    compute(action:string) {
        switch (action) {
            case Actions.percent:
                this.result = ResultType.error;
                break;
            case Actions.clear:
                this.result = ResultType.default;
                break;
            case Actions.compute:
                this.result = ResultType.error;
                break;
            default:
                if (this.result == ResultType.default) {
                    this.result = action;
                } else {
                    this.result += action;
                }
                break;
        }
    };
}

export enum ResultType {
    default = "0",
    error = "некорректное выражение",
}

export enum Actions {
    clear = "C",
    compute = "=",
    percent = "%",
    fraction = ",",
}

