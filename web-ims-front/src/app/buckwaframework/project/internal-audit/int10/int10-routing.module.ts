import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Int10Component } from './int10.component';
import { Int1001Component } from './int1001/int1001.component';

const routes: Routes = [
  { path: "", component: Int10Component },
  { path: "01", component: Int1001Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int10RoutingModule { }
