import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int070103Component } from './int070103.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { SegmentModule } from 'components/segment/segment.module';
import { ButtonModule } from 'components/button/button.module';

const routes: Routes = [
  { path: '', component: Int070103Component }
];

@NgModule({
  declarations: [Int070103Component],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    BreadcrumbModule,
    SegmentModule,
    ButtonModule
  ],
  exports: [RouterModule]
})
export class Int070103Module { }
