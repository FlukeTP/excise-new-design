import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int070102Component } from './int070102.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { SegmentModule } from 'components/segment/segment.module';
import { ButtonModule } from 'components/button/button.module';

const routes: Routes = [
  { path: '', component: Int070102Component }
];


@NgModule({
  declarations: [Int070102Component],
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
export class Int070102Module { }
