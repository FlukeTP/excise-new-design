import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta02020302Component } from './ta02020302.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';

const routes: Routes = [
  { path: "", component: Ta02020302Component },
];
@NgModule({
  declarations: [Ta02020302Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    BreadcrumbModule,
 
  ],
  exports: [
    RouterModule
  ]
})
export class Ta02020302Module { }
