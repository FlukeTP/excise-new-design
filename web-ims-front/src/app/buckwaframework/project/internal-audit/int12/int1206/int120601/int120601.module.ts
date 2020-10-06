import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int12060101Component } from './int12060101/int12060101.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int120601Component } from './int120601.component';

const routes: Routes = [
  { path: "", component: Int120601Component },
  { path: "01", component: Int12060101Component }
];

@NgModule({
  declarations: [Int120601Component, Int12060101Component],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule],
})
export class Int120601Module { }
