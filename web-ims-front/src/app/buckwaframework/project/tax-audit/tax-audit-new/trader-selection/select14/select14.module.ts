import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from 'services/auth-guard.service';
import { Select14Component } from './select14.component';
import { Routes, RouterModule } from '@angular/router';
import { Se01Component } from './se01/se01.component';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { ButtonModule } from 'components/button/button.module';
import { SegmentModule } from 'components/segment/segment.module';


const routes: Routes = [
  { path: "", component: Select14Component, canActivate: [AuthGuard] },
  { path: "se01", component: Se01Component, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    Select14Component,
    Se01Component
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    SegmentModule,
    RouterModule.forChild(routes),
    ButtonModule
  ],
  exports: [
    RouterModule
  ]
})
export class Select14Module { }
