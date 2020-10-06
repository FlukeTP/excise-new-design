import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Int1104Component } from './int1104.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int110401Component } from './int110401/int110401.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Int1104Component },
  { path: "01", component: Int110401Component },

];

@NgModule({
  declarations: [
    Int1104Component,
    Int110401Component,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class Int1104Module { }
