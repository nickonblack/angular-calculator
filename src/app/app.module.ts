import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from 'app/app.component';
import { ItemButtonComponent } from 'app/itembutton/itembutton.component';
import {MatListModule} from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';

  
@NgModule({
  imports: [ BrowserModule, FormsModule, MatListModule, FlexLayoutModule ],
  declarations: [
    AppComponent,
    ItemButtonComponent,
  ],
  providers: [],
  bootstrap: [
    AppComponent]
})
export class AppModule { }
