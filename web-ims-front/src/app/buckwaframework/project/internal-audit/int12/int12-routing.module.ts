import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Int120101Component } from './int1201/int120101/int120101.component';
import { Int120102Component } from './int1201/int120102/int120102.component';
import { Int02010101Component } from './int1201/int120101/int02010101/int02010101.component';

const routes: Routes = [
  { path: "01/01", component: Int120101Component },
  { path: "01/01/01", component: Int02010101Component },
  { path: "01/02", component: Int120102Component },
  { path: "02", loadChildren: './int1202/int1202.module#Int1202Module' },
  { path: "03", loadChildren: './int1203/int1203.module#Int1203Module' },
  { path: "04", loadChildren: './int1204/int1204.module#Int1204Module' },
  { path: "05", loadChildren: './int1205/int1205.module#Int1205Module' },
  { path: "06", loadChildren: './int1206/int1206.module#Int1206Module' },
  { path: "07", loadChildren: './int1207/int1207.module#Int1207Module' },
  { path: "08", loadChildren: './int1208/int1208.module#Int1208Module' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int12RoutingModule { }
