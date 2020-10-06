import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Ta0201Component } from './ta0201.component';
import { Ta020101Component } from './ta020101/ta020101.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Ta0201Component },
  { path: "01", component: Ta020101Component },
];

@NgModule({
  declarations: [Ta0201Component,Ta020101Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ], exports: [
    RouterModule
  ]
})
export class Ta0201Module { }
