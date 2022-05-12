import { Component, Input, Output, EventEmitter } from '@angular/core';
 
// angular компонент кнопки 
@Component({
    selector: 'item-button-comp',
    styleUrls: ['./itembutton.component.scss'],
    templateUrl: './itembutton.component.html',
})
export class ItemButtonComponent {
    
    // обработчик события нажатия на кнопку
    @Output() onChanged = new EventEmitter<string>();

    // знак кнопки
    @Input() sign: string = "";

    // событие при нажатии на кнопку
    change(data:any) {
        console.log(data);
        this.onChanged.emit(data);
    }
}