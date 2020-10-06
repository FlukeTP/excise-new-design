import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Int1301Component } from './int1301/int1301.component';
import { Int1302Component } from './int1302/int1302.component';
import { Int1303Component } from './int1303/int1303.component';
import { Int1304Component } from './int1304/int1304.component';
import { Int1305Component } from './int1305/int1305.component';
import { Int1306Component } from './int1306/int1306.component';

const routes: Routes = [
  { path: "01", component: Int1301Component },
  { path: "02", component: Int1302Component },
  { path: "03", component: Int1303Component },
  { path: "04", component: Int1304Component },
  { path: "05", component: Int1305Component },
  { path: "06", component: Int1306Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int13RoutingModule { }
