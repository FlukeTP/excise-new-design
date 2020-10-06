import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ope0703Component } from './ope0703.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from '../table/table.module';

const routes: Routes = [
  { path: '', component: Ope0703Component },  
]

@NgModule({
  declarations: [Ope0703Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TableModule
  ],
  exports: [RouterModule]  
})
export class Ope0703Module { }
