import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta010101Component } from './ta010101.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '', component: Ta010101Component
  }
];

@NgModule({
  declarations: [Ta010101Component],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports:[
    RouterModule
  ]
})
export class Ta010101Module { }
