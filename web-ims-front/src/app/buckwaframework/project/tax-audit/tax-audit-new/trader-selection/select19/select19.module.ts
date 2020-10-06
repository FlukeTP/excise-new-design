import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select19Component } from './select19.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", component: Select19Component },
];


@NgModule({
  declarations: [Select19Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class Select19Module { }
