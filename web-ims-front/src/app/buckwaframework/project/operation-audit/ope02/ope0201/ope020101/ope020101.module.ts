import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Ope020101Component } from './ope020101.component';
import { Ope02010101Component } from './ope02010101/ope02010101.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
     { path: '', component: Ope020101Component },
     { path: '01', component: Ope02010101Component },
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
          Ope020101Component,
          Ope02010101Component
     ],
     exports: [
          RouterModule
     ]
})
export class Ope020101Module { }