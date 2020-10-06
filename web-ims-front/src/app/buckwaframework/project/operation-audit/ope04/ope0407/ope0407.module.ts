import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../common/templates/shared.module';
import { Ope0407Component } from './ope0407.component';
import { Ope040701Component } from './ope040701/ope040701.component';

const routes: Routes = [
  { path: '', component: Ope0407Component },
  { path: '01', component: Ope040701Component },
];

@NgModule({
  declarations: [Ope0407Component, Ope040701Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    RouterModule
  ]
})
export class Ope0407Module { }
