import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int061401Component } from './int061401/int061401.component';
import { Int061402Component } from './int061402/int061402.component';
import { Int061403Component } from './int061403/int061403.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '01', component: Int061401Component },
  { path: '02', component: Int061402Component },
  { path: '03', component: Int061403Component },
];

@NgModule({
  declarations: [Int061401Component, Int061402Component, Int061403Component],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class Int0614Module { }
