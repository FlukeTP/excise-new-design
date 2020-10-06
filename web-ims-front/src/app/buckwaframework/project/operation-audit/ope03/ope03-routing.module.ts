import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Ope03Component } from './ope03.component';

const routes: Routes = [
  { path: '', component: Ope03Component },
  { path: '01', loadChildren: './ope0301/ope0301.module#Ope0301Module' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Ope03RoutingModule { }
