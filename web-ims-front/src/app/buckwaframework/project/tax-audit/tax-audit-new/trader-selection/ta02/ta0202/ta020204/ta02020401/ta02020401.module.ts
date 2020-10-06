import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta02020401Component } from './ta02020401.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: "", component: Ta02020401Component },
];
@NgModule({
  declarations: [Ta02020401Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    RouterModule
  ]
})
export class Ta02020401Module { }
