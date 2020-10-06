import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0206Component } from './ta0206.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
const routes = [
  { path: '', component: Ta0206Component }
]
@NgModule({
  declarations: [Ta0206Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ] ,exports: [
    RouterModule
  ]
})
export class Ta0206Module { }
