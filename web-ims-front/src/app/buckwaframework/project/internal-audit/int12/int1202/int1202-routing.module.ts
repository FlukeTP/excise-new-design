import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Int1202Component } from './int1202.component';
import { Int120201Component } from './int120201/int120201.component';
import { Int120202Component } from './int120202/int120202.component';
import { Int12020101Component } from './int120201/int12020101/int12020101.component';
import { Int12020102Component } from './int120201/int12020102/int12020102.component';

const routes: Routes = [
  { path: "", component: Int1202Component },
  { path: "01", component: Int120201Component },
  { path: "01/01", component: Int12020101Component },
  { path: "01/02", component: Int12020102Component },
  { path: "02", component: Int120202Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int1202RoutingModule { }
