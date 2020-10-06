import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Int0601Component } from './int0601/int0601.component';
import { Int0602Component } from './int0602/int0602.component';
import { Int0603Component } from './int0603/int0603.component';
import { Int0604Component } from './int0604/int0604.component';
import { Int0607Component } from './int0607/int0607.component';
import { Int0608Component } from './int0608/int0608.component';
import { Int0609Component } from './int0609/int0609.component';
import { Int0611Component } from './int0611/int0611.component';
import { Int0612Component } from './int0612/int0612.component';
import { Int0613Component } from './int0613/int0613.component';

const routes: Routes = [
  { path: "01", component: Int0601Component },
  { path: "02", component: Int0602Component },
  { path: "03", component: Int0603Component },
  { path: "04", component: Int0604Component },
  { path: "", loadChildren: './int0605/int0605.module#Int0605Module' },
  { path: "06", loadChildren: './int0606/int0606.module#Int0606Module' },
  { path: "07", component: Int0607Component },
  { path: "08", component: Int0608Component },
  { path: "09", component: Int0609Component },
  { path: "10", loadChildren: './int0610/int0610.module#Int0610Module' },
  { path: "11", component: Int0611Component },
  { path: "12", component: Int0612Component },
  { path: "13", component: Int0613Component },
  { path: "14", loadChildren: './int0614/int0614.module#Int0614Module' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int06RoutingModule { }
