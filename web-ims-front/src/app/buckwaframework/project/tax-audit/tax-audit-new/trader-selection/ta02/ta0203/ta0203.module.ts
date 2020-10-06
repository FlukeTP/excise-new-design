import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0203Component } from './ta0203.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Ta0203Component }
];

@NgModule({
  declarations: [Ta0203Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class Ta0203Module { }
