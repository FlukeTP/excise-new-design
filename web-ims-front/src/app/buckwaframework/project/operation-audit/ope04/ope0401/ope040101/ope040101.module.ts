import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Ope040101Component } from './ope040101.component';
import { Ope04010101Component } from './ope04010101/ope04010101.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
     { path: '', component: Ope040101Component },
     { path: '01', component: Ope04010101Component },
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
          Ope040101Component,
          Ope04010101Component
     ],
     exports: [
          RouterModule
     ]
})
export class Ope040101Module { }