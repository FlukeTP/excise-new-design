import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ope0108Component } from './ope0108.component';
import { Ope010801Component } from './ope010801/ope010801.component';

const routes: Routes = [
  { path: '', component: Ope0108Component },
  { path: '01', component: Ope010801Component },
];

@NgModule({
  declarations: [Ope0108Component, Ope010801Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class Ope0108Module { }
