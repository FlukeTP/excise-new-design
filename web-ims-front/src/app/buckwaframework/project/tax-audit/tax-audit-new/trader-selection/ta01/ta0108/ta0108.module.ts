import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta0108Component } from './ta0108.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Ta0108Component },
];

@NgModule({
  declarations: [Ta0108Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class Ta0108Module { }
