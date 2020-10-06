import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ope0409Component } from './ope0409.component';
import { Ope040901Component } from './ope040901/ope040901.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
  { path: '', component: Ope0409Component },
  { path: '01', component: Ope040901Component },
];

@NgModule({
  declarations: [
    Ope0409Component,
    Ope040901Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    RouterModule
  ]
})
export class Ope0409Module { }
