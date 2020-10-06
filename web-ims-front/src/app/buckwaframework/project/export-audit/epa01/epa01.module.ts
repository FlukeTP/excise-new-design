import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from '../../../common/services';
import { Epa011Component } from './epa01-1/epa01-1.component';
import { Epa012Component } from './epa01-2/epa01-2.component';
import { Epa013Component } from './epa01-3/epa01-3.component';
import { Epa014Component } from './epa01-4/epa01-4.component';
import { Epa0121Component } from "./epa01-2-1/epa01-2-1.component";
import { Epa0141Component } from "./epa01-4-1/epa01-4-1.component";

const routes: Routes = [
  { path: "1", component: Epa011Component, canActivate: [AuthGuard] },
  { path: "2", component: Epa012Component, canActivate: [AuthGuard] },
  { path: "3", component: Epa013Component, canActivate: [AuthGuard] },
  { path: "4", component: Epa014Component, canActivate: [AuthGuard] },
  { path: "21", component: Epa0121Component, canActivate: [AuthGuard] },
  { path: "41", component: Epa0141Component, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), 
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    Epa011Component,
    Epa012Component,
    Epa013Component,
    Epa014Component,
    Epa0121Component,
    Epa0141Component
  ],
  exports: [
    RouterModule
  ]
})
export class Epa01Module {}
