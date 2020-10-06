import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule, FormsModule,  } from '@angular/forms';
import { Ta020201Component } from './ta020201.component';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';

  
const routes: Routes = [
  { path: "", component: Ta020201Component },
  {
    path: '', component: Ta020201Component,
    children: [
      { path: "03", loadChildren: '../ta020203/ta020203.module#Ta020203Module' },
      { path: "04", loadChildren: '../ta020204/ta020204.module#Ta020204Module' },
      { path: "05", loadChildren: '../ta020205/ta020205.module#Ta020205Module' },
      { path: "06", loadChildren: '../ta020206/ta020206.module#Ta020206Module' },
    ]
  },
];


@NgModule({
  declarations: [Ta020201Component],
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
export class Ta020201Module { }
