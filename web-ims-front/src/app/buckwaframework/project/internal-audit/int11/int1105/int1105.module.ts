import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int110501Component } from './int110501/int110501.component';
import { Int1105Component } from './int1105.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Int11050101Component } from './int110501/int11050101/int11050101.component';


const routes: Routes = [
  { path: "", component: Int1105Component },
  { path: "01", component: Int110501Component },
  { path: "01/01", component: Int11050101Component },

];

@NgModule({
  declarations: [Int1105Component, Int110501Component, Int11050101Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class Int1105Module { }
