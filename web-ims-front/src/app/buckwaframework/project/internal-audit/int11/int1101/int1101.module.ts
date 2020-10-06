import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int110101Component } from './int110101/int110101.component';
import { INT1101Component } from './int1101.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: INT1101Component },
  { path: "01", component: Int110101Component },

];


@NgModule({
  declarations: [INT1101Component,Int110101Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class Int1101Module { }
