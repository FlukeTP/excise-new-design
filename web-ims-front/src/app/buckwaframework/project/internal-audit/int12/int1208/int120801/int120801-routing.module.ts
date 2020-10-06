import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

import { Int120801Component } from './int120801.component';
import { Int12080101Component } from './int12080101/int12080101.component';

const routes: Routes = [
  { path: '', component: Int120801Component },
  { path: '01', component: Int12080101Component },
];

@NgModule({
  declarations: [Int120801Component, Int12080101Component],
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [RouterModule]
})
export class Int120801RoutingModule { }
