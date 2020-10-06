import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0107Component } from './ta0107.component';
import { Routes, RouterModule } from '@angular/router';
import { Ta01071Component } from './ta01071/ta01071.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Ta0107Component },
  { path: "01", component: Ta01071Component },
];

@NgModule({
  declarations: [
    Ta0107Component,
    Ta01071Component
  ],
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
export class Ta0107Module { }
