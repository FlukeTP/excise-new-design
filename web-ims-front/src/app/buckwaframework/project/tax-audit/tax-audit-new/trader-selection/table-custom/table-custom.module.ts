import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCustomComponent } from './table-custom.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

@NgModule({
  declarations: [TableCustomComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[TableCustomComponent]
})
export class TableCustomModule { }
