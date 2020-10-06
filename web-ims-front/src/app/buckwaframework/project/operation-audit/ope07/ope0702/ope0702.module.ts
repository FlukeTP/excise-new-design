import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ope0702Component } from './ope0702.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from '../table/table.module';

const routes: Routes = [
  { path: '', component: Ope0702Component },  
]
@NgModule({
  declarations: [Ope0702Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TableModule

  ],
  exports:[RouterModule]
})
export class Ope0702Module { }
