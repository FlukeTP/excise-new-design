import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from '../../../common/services';
import { Epa031Component } from './epa03-1/epa03-1.component';
import { Epa032Component } from './epa03-2/epa03-2.component';
import { Epa033Component } from './epa03-3/epa03-3.component';

const routes: Routes = [
  { path: '1', component: Epa031Component, canActivate: [AuthGuard] },
  { path: '2', component: Epa032Component, canActivate: [AuthGuard] },
  { path: '3', component: Epa033Component, canActivate: [AuthGuard] }
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
    Epa031Component, 
    Epa032Component, 
    Epa033Component
  ]
})
export class Epa03Module { }
