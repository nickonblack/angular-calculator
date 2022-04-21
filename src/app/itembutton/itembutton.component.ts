import { Component, Input, Output, EventEmitter } from '@angular/core';
      
@Component({
    selector: 'item-button-comp',
    styleUrls: ['./itembutton.component.css'],
    templateUrl: './itembutton.component.html',
})
export class ItemButtonComponent {
    
    @Output() onChanged = new EventEmitter<string>();

    @Input() sign: string = "";

    // функция = выполнения 
    change(increased:any) {
        console.log(increased);
        this.onChanged.emit(increased);
    }
}