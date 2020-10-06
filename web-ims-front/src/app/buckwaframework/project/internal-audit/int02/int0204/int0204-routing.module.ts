import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Int0204Component } from './int0204.component';

const routes: Routes = [
  { path: "", component: Int0204Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int0204RoutingModule { }
