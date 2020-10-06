import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ta0102Component } from './ta0102.component';
import { ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  { path: "", component: Ta0102Component },
  { path: "01", loadChildren: './ta010201/ta010201.module#Ta010201Module' },
];
@NgModule({
  declarations: [
    Ta0102Component
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]

})
export class Ta0102Module { }
