import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { INT1102Component } from './int1102/int1102.component';
import { Int1103Component } from './int1103/int1103.component';
import { Int11Component } from './int11.component';
import { Int1107Component } from './int1107/int1107.component';

const routes: Routes = [
  { path: "", component: Int11Component },
  { path: "01", loadChildren: './int1101/int1101.module#Int1101Module' },
  { path: "02", component: INT1102Component },
  { path: "03", component: Int1103Component },
  { path: "04", loadChildren: './int1104/int1104.module#Int1104Module' },
  { path: "05", loadChildren: './int1105/int1105.module#Int1105Module' },
  { path: "06", loadChildren: './int1106/int1106.module#Int1106Module' },
  { path: "07", component: Int1107Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int11RoutingModule { }
