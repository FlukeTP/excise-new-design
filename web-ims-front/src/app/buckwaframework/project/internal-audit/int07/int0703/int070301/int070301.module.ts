import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int070301Component } from './int070301.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { SegmentModule } from 'components/segment/segment.module';
import { ButtonModule } from 'components/button/button.module';

const routes: Routes = [
  { path:'', component: Int070301Component },
];

@NgModule({
  declarations: [Int070301Component],
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
export class Int070301Module { }
