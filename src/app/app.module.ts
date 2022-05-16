import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from 'app/app.component';
import { ItemButtonComponent } from 'app/itembutton/itembutton.component';
import {MatListModule} from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';

import { InputDirective } from 'app/input/input.directive';
  
@NgModule({
  imports: [ BrowserModule, FormsModule, MatListModule, FlexLayoutModule],
  declarations: [
    AppComponent,
    ItemButtonComponent,
    InputDirective,
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ],
    
})
export class AppModule { }
