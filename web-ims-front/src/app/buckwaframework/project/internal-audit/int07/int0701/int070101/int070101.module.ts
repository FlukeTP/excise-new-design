import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int070101Component } from './int070101.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { SegmentModule } from 'components/segment/segment.module';
import { ButtonModule } from 'components/button/button.module';
import { Int07010101Component } from './int07010101/int07010101.component';
import { Int07010102Component } from './int07010102/int07010102.component';


const routes: Routes = [
  { path: '', component: Int070101Component },
  // { path: '01', component: Int07010101Component },
  { path: '02', component: Int07010102Component }
];

@NgModule({
  declarations: [Int070101Component, Int07010101Component, Int07010102Component],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    BreadcrumbModule,
    SegmentModule,
    ButtonModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class Int070101Module { }
