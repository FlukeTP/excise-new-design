import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta1001Component } from './ta1001.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [

  { path: "", component: Ta1001Component, }
]

@NgModule({
  declarations: [Ta1001Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class Ta1001Module { }
