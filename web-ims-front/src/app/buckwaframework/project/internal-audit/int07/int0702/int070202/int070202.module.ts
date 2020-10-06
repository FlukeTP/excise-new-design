import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int070202Component } from './int070202.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { ButtonModule } from 'components/button/button.module';
import { SegmentModule } from 'components/segment/segment.module';

const routes: Routes = [
  { path:'', component: Int070202Component }
];

@NgModule({
  declarations: [Int070202Component],
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
export class Int070202Module { }
