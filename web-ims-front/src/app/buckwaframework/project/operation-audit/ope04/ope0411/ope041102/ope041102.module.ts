import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Ope041102Component } from './ope041102.component';
import { Ope04110201Component } from './ope04110201/ope04110201.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
     { path: '', component: Ope041102Component },
     { path: '01', component: Ope04110201Component },
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
          Ope041102Component,
          Ope04110201Component
     ],
     exports: [
          RouterModule
     ]
})
export class Ope041102Module { }