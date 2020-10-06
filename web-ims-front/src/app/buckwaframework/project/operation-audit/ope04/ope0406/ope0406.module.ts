import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ope0406Component } from './ope0406.component';
import { Ope040601Component } from './ope040601/ope040601.component';
import { Ope040602Component } from './ope040602/ope040602.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: Ope0406Component },
  { path: '01', component: Ope040601Component},
  { path: '02', component: Ope040602Component }
];

@NgModule({
  declarations: [
    Ope0406Component,
    Ope040601Component, 
    Ope040602Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class Ope0406Module { }
