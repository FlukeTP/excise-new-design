import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta03011001Component } from './ta03011001.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Ta03011001Component }
];

@NgModule({
  declarations: [Ta03011001Component],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class Ta03011001Module { }
