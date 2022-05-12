import { Component } from '@angular/core';
import { ButtonData } from 'app/models/button_data';
import { Calculator} from 'app/calculator/calculalator';
import { SpecialSign } from 'app/models/special_sign';
import { Operation } from 'app/models/operation';
import { Action } from 'app/models/action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  // 
  calculatorButtons: ButtonData[][] = [
    [new ButtonData('7', 1), new ButtonData('8', 1), new ButtonData('9', 1), new ButtonData(Operation.division, 1), new ButtonData(Action.clear, 2)],
    [new ButtonData('4', 1), new ButtonData('5', 1), new ButtonData('6', 1), new ButtonData(Operation.multiplication, 1), new ButtonData(Operation.leftBrace, 1), new ButtonData(Operation.rightBrace, 1)],
    [new ButtonData('1', 1), new ButtonData('2', 1), new ButtonData('3', 1), new ButtonData(Operation.subtraction, 1), new ButtonData(SpecialSign.pi, 1), new ButtonData(SpecialSign.e, 1)],
    [new ButtonData('0', 2), new ButtonData(Action.fraction, 1), new ButtonData('+', 1), new ButtonData(Action.compute, 2)],
  ];

  calculator:Calculator = new Calculator();
  valuechange(newValue: string) {
      //TODO: - решить проблему с вводом с клавиатуры
      //При использовании клавиатуры newValue = всей строке 
      this.calculator.compute(newValue);
  }
}