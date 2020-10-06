import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta020501Component } from './ta020501.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'components/index';

const routes: Routes = [
  { path: "", component: Ta020501Component },
];

@NgModule({
  declarations: [Ta020501Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    BreadcrumbModule,
  ]
})
export class Ta020501Module { }
