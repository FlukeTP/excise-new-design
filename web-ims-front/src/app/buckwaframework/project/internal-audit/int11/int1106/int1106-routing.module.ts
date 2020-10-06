import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Int1106Component } from './int1106.component';

const routes: Routes = [
  { path: "", component: Int1106Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int1106RoutingModule { }
