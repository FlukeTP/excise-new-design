import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int070201Component } from './int070201.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { SegmentModule } from 'components/segment/segment.module';
import { ButtonModule } from 'components/button/button.module';
import { ModalModule } from 'components/modal/modal.module';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
  { path:'', component: Int070201Component }
];

@NgModule({
  declarations: [Int070201Component],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    BreadcrumbModule,
    SegmentModule,
    ModalModule,
    ButtonModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class Int070201Module { }
