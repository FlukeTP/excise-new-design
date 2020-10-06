import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { Select17Component } from './select17.component';

import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
    { path: '', component: Select17Component }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes), 
    CommonModule, 
    SharedModule
  ],
  declarations: [Select17Component],
  exports: [RouterModule]
})
export class Select17Module { }