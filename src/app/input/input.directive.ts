import {Directive, ElementRef, Renderer2, HostListener, Input} from '@angular/core';
import { Calculator } from 'app/calculator/calculalator';
import { Operation } from 'app/models/operation';
import { ResultType } from 'app/models/result_type';
 
@Directive({
    selector: '[inputDirective]'
})
export class InputDirective{

    @Input() calculator: Calculator | null;
     
    constructor(private element: ElementRef) {
        this.calculator = null;
    }

    @HostListener('input', ['$event']) public onInput(event: InputEvent): void {
        let val: string = "";

        if (event.data != "," && event.data != "." && this.calculator?.prevResult == ResultType.empty || this.calculator?.prevResult == ResultType.error) {
            val = event.data ?? "";
        } else {
            val = this.element.nativeElement.value as string;
        }
        
        const filterPattern = /[0-9\(\)\*\/\+\-\,\.\p\e\x\÷]/g;
        
        let validCharacters = val.match(filterPattern)?.join("") ?? "";
        if (validCharacters == "") {
            validCharacters = ResultType.empty;
        }

        validCharacters = validCharacters.replace(/\./g, ',');

        validCharacters = validCharacters.replace(/\*/g, Operation.multiplication);
        validCharacters = validCharacters.replace(/\//g, Operation.division);

        this.element.nativeElement.value = validCharacters;
        if (this.calculator != null)
            this.calculator.prevResult = validCharacters;
    }

}
