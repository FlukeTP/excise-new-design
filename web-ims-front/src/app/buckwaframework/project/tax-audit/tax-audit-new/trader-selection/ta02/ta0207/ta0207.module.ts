import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0207Component } from './ta0207.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
const routes = [
  { path: '', component: Ta0207Component }
]
@NgModule({
  declarations: [Ta0207Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ] ,exports: [
    RouterModule
  ]
})
export class Ta0207Module { }
