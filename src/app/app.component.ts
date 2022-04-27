import { Component } from '@angular/core';
import { ButtonData } from 'app/models/button_data';
import { getFlex } from 'app/utils/help_funcs';
import { Calculator} from 'app/calculator/calculalator';
import { SpecialSign } from 'app/models/special_sign';
import { Operation } from 'app/models/operation';
import { Action } from 'app/models/action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  // 
  calculatorButtons: ButtonData[][] = [
    [new ButtonData('7', getFlex(1)), new ButtonData('8', getFlex(1)), new ButtonData('9', getFlex(1)), new ButtonData(Operation.division, getFlex(1)), new ButtonData(Action.clear, getFlex(2))],
    [new ButtonData('4', getFlex(1)), new ButtonData('5', getFlex(1)), new ButtonData('6', getFlex(1)), new ButtonData(Operation.multiplication, getFlex(1)), new ButtonData(Operation.leftBrace, getFlex(1)), new ButtonData(Operation.rightBrace, getFlex(1))],
    [new ButtonData('1', getFlex(1)), new ButtonData('2', getFlex(1)), new ButtonData('3', getFlex(1)), new ButtonData(Operation.subtraction, getFlex(1)), new ButtonData(SpecialSign.pi, getFlex(1)), new ButtonData(SpecialSign.e, getFlex(1))],
    [new ButtonData('0', getFlex(2)), new ButtonData(Action.fraction, getFlex(1)), new ButtonData('+', getFlex(1)), new ButtonData(Action.compute, getFlex(2))],
  ];

  calculator:Calculator = new Calculator();
  valuechange(newValue: string) {
      //TODO: - решить проблему с вводом с клавиатуры
      //При использовании клавиатуры newValue = всей строке 
      //TODO: - сделать центрирование калькулятора отнтосительно границ
      this.calculator.compute(newValue);
  }
}