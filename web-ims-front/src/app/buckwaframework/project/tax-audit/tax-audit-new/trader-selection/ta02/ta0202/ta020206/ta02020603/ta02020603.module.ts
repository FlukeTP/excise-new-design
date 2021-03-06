import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta02020603Component } from './ta02020603.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { Ta0301Service } from 'projects/tax-audit/tax-audit-new/trader-selection/ta03/ta0301/ts0301.service';

const routes: Routes = [
  { path: "", component: Ta02020603Component },
];
@NgModule({
  declarations: [Ta02020603Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    BreadcrumbModule,
    SharedModule,
 
  ],
  exports: [
    RouterModule
  ],
  providers: [
    Ta0301Service
  ]
})
export class Ta02020603Module { }
