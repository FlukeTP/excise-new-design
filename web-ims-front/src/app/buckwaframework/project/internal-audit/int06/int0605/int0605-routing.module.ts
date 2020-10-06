import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Int060503Component } from './int060503/int060503.component';
// import { Int060502Component } from './int060502/int060502.component';
import { Int060501Component } from './int060501/int060501.component';
import { AuthGuard } from '../../../../common/services';

const routes: Routes = [
  { path: '05', component: Int060501Component, canActivate: [AuthGuard] },
  // { path: '05/01', component: Int060502Component, canActivate: [AuthGuard] },
  { path: '05/02', component: Int060503Component, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int0605RoutingModule { }
