import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { Ta0101Component } from './ta0101.component';
import { Ta010101Component } from './ta010101/ta010101.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '', component: Ta0101Component
  }, 
  { path: '01', loadChildren: './ta010101/ta010101.module#Ta010101Module' }
];


@NgModule({
  declarations: [
    Ta0101Component
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports:[
    RouterModule
  ]
})
export class Ta0101Module { }
