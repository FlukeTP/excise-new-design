import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [TableComponent]
})
export class TableModule { }
