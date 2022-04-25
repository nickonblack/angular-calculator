import { Component } from '@angular/core';
import { ButtonData } from './classes/button_data';
import { getFlex } from './utils/help_funcs';
import { Calculator, Actions, ResultType, SpecialSign, Operation } from './calculator/calculalator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  calculatorButtons: ButtonData[][] = [
    [new ButtonData('7', getFlex(1)), new ButtonData('8', getFlex(1)), new ButtonData('9', getFlex(1)), new ButtonData(Operation.division, getFlex(1)), new ButtonData(Actions.clear, '2 0 calc(90px)')],
    [new ButtonData('4', getFlex(1)), new ButtonData('5', getFlex(1)), new ButtonData('6', getFlex(1)), new ButtonData(Operation.multiply, getFlex(1)), new ButtonData(Operation.leftBrace, getFlex(1)), new ButtonData(Operation.rightBrace, getFlex(1))],
    [new ButtonData('1', getFlex(1)), new ButtonData('2', getFlex(1)), new ButtonData('3', getFlex(1)), new ButtonData(Operation.subtraction, getFlex(1)), new ButtonData(SpecialSign.pi, getFlex(1)), new ButtonData(SpecialSign.e, getFlex(1))],
    [new ButtonData('0', '2 0 calc(90px)'), new ButtonData(Actions.fraction, getFlex(1)), new ButtonData('+', getFlex(1)), new ButtonData(Actions.compute, '2 0 calc(90px)')],
  ];

  calculator:Calculator = new Calculator();
  valuechange(newValue: string) {
      this.calculator.compute(newValue);
  }
}