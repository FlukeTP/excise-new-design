import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Se02Component } from './se02.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Se02Component }
];

@NgModule({
  declarations: [Se02Component],
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
export class Se02Module { }
