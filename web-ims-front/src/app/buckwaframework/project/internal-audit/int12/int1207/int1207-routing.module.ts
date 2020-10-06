import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Int120701Component } from './int120701/int120701.component';
import { Int12070101Component } from './int120701/int12070101/int12070101.component';
import { Int12070102Component } from './int120701/int12070102/int12070102.component';
import { Int12070103Component } from './int120701/int12070103/int12070103.component';

const routes: Routes = [
  { path: '01', component: Int120701Component },
  { path: '01/01', component: Int12070101Component },
  { path: '01/02', component: Int12070102Component },
  { path: '01/03', component: Int12070103Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int1207RoutingModule { }
