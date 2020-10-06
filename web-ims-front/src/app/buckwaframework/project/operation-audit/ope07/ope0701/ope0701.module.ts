import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ope0701Component } from './ope0701.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableModule } from '../table/table.module';

const routes: Routes = [
  { path: '', component: Ope0701Component },  
]
@NgModule({
  declarations: [Ope0701Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TableModule

  ], exports: [RouterModule]
})
export class Ope0701Module { }
