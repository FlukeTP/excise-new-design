import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Select18Component } from './select18.component';
import { AuthGuard } from 'services/auth-guard.service';
import { Se01Component } from '../select18/se01/se01.component';
import { Se02Component } from '../select18/se02/se02.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Select18Component, canActivate: [AuthGuard] },
  { path: "se01", component: Se01Component, canActivate: [AuthGuard] },
  { path: "se02", component: Se02Component, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [Select18Component,Se02Component,Se01Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ],
  exports:[
    RouterModule
  ]
})
export class Select18Module { }
