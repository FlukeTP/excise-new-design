import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Plan02Component } from './plan02.component';
import { Plan0201Component } from './plan0201/plan0201.component';
import { Plan0202Component } from './plan0202/plan0202.component';

const routes: Routes = [
  { path: '', component: Plan02Component },
  { path: '01', component: Plan0201Component },
  { path: '02', component: Plan0202Component },
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
export class Plan02RoutingModule { }
