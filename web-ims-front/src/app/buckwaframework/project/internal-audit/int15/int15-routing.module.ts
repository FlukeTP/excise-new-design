import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Int1501Component } from './int1501/int1501.component';
import { Int1502Component } from './int1502/int1502.component';
import { Int1503Component } from './int1503/int1503.component';
import { Int1504Component } from './int1504/int1504.component';
import { Int1505Component } from './int1505/int1505.component';

const routes: Routes = [
  { path: "01", component: Int1501Component },
  { path: "02", component: Int1502Component },
  { path: "03", component: Int1503Component },
  { path: "04", component: Int1504Component },
  { path: "05", component: Int1505Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int15RoutingModule { }
