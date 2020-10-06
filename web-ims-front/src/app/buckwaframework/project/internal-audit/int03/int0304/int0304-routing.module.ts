import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Int0304Component } from './int0304.component';
import { Int030401Component } from './int030401/int030401.component';
import { Int030402Component } from './int030402/int030402.component';
import { Int030403Component } from './int030403/int030403.component';
import { Int030404Component } from './int030404/int030404.component';
import { Int030405Component } from './int030405/int030405.component';
import { Int030406Component } from './int030406/int030406.component';
import { Int030407Component } from './int030407/int030407.component';
import { Int030408Component } from './int030408/int030408.component';

const routes: Routes = [
  { path: "", component: Int0304Component },
  { path: "01", component: Int030401Component },
  { path: "02", component: Int030402Component },
  { path: "03", component: Int030403Component },
  { path: "04", component: Int030404Component },
  { path: "05", component: Int030405Component },
  { path: "06", component: Int030406Component },
  { path: "08", component: Int030408Component },
  { path: "07", component: Int030407Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int0304RoutingModule { }
