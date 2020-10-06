import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from '../../../common/services';
import { Epa021Component } from './epa02-1/epa02-1.component';
import { Epa022Component } from './epa02-2/epa02-2.component';
import { Epa023Component } from './epa02-3/epa02-3.component';
import { Epa024Component } from './epa02-4/epa02-4.component';
import { Epa025Component } from './epa02-5/epa02-5.component';
import { Epa026Component } from './epa02-6/epa02-6.component';

const routes: Routes = [
  { path: '1', component: Epa021Component, canActivate: [AuthGuard] },
  { path: '2', component: Epa022Component, canActivate: [AuthGuard] },
  { path: '3', component: Epa023Component, canActivate: [AuthGuard] },
  { path: '4', component: Epa024Component, canActivate: [AuthGuard] },
  { path: '5', component: Epa025Component, canActivate: [AuthGuard] },
  { path: '6', component: Epa026Component, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), 
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    Epa021Component,
    Epa022Component, 
    Epa023Component, 
    Epa024Component, 
    Epa025Component, 
    Epa026Component
  ]
})
export class Epa02Module {}
