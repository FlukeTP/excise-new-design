import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

import { Int120401Component } from './int120401.component';
import { Int12040101Component } from './int12040101/int12040101.component';

const routes: Routes = [
  { path: '', component: Int120401Component },
  { path: '01', component: Int12040101Component },
];

@NgModule({
  declarations: [Int120401Component, Int12040101Component],
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [RouterModule]
})
export class Int120401RoutingModule { }
