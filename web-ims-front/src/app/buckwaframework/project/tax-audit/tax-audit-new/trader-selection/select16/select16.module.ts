import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select16Component } from './select16.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Se01Component } from './se01/se01.component';

const routes: Routes = [

  { path: "", component: Select16Component },
  { path: "se01", component: Se01Component },
];

@NgModule({
  declarations: [Select16Component, Se01Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class Select16Module { }
