import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../../../../common/templates/shared.module';
import { Ope010101Component } from './ope010101.component';
import { Ope01010101Component } from './ope01010101/ope01010101.component';

const routes: Routes = [
     { path: '', component: Ope010101Component },
     { path: '01', component: Ope01010101Component },
];

@NgModule({
     imports: [
          CommonModule,
          FormsModule,
          ReactiveFormsModule,
          RouterModule.forChild(routes),
          SharedModule
     ],
     declarations: [
          Ope010101Component,
          Ope01010101Component
     ],
     exports: [
          RouterModule
     ]
})
export class Ope010101Module { }