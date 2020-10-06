import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int070203Component } from './int070203.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { SegmentModule } from 'components/segment/segment.module';
import { ButtonModule } from 'components/button/button.module';
import { Int07020301Component } from './int07020301/int07020301.component';
import { Int07020302Component } from './int07020302/int07020302.component';

const routes: Routes = [
  { path:'', component: Int070203Component },
  { path:'01', component: Int07020301Component },
  { path:'02', component: Int07020302Component },
];

@NgModule({
  declarations: [Int070203Component, Int07020301Component, Int07020302Component],
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
export class Int070203Module { }
