import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ope0208Component } from './ope0208.component';
import { Ope020801Component } from './ope020801/ope020801.component';

const routes: Routes = [
  { path: '', component: Ope0208Component },
  { path: '01', component: Ope020801Component },
];

@NgModule({
  declarations: [Ope0208Component, Ope020801Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class Ope0208Module { }
