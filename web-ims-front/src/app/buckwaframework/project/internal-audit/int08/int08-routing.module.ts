import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

import { Int0801Component } from './int0801/int0801.component';
import { Int0802Component } from './int0802/int0802.component';
import { Int0804Component } from './int0804/int0804.component';
import { Int0803Component } from './int0803/int0803.component';

const routes: Routes = [
  { path: '', redirectTo: '01', pathMatch: 'full' },
  { path: '01', component: Int0801Component },
  { path: '02', component: Int0802Component },
  { path: '03', component: Int0803Component },
  { path: "04", component: Int0804Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int08RoutingModule { }
