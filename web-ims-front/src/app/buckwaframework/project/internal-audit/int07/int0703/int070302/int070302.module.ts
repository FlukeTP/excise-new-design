import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { SegmentModule } from 'components/segment/segment.module';
import { ButtonModule } from 'components/button/button.module';
import { Int070302Component } from './int070302.component';
import { Int07030201Component } from './int07030201/int07030201.component';

const routes: Routes = [
  { path:'', component: Int070302Component },
  { path:'01', component: Int07030201Component },
];

@NgModule({
  declarations: [Int070302Component, Int07030201Component],
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
export class Int070302Module { }
