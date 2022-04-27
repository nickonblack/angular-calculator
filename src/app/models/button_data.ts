import { getFlex } from 'app/utils/help_funcs';
// Контейнер с данными 
export class ButtonData {
    sign: string;
    flexConstraint: string;

    constructor(sign: string, flex: number) {
        this.sign = sign;
        this.flexConstraint = getFlex(flex);
    } 
}