import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta030108Component } from './ta030108.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Ta030108Component }
];
@NgModule({
  declarations: [Ta030108Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class Ta030108Module { }
