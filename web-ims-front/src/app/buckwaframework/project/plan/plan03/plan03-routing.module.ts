import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Plan03Component } from './plan03.component';
import { Plan0301Component } from './plan0301/plan0301.component';

const routes: Routes = [
  { path: '', component: Plan03Component },
  { path: '01', component: Plan0301Component },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class Plan03RoutingModule { }
