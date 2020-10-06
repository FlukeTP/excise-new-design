import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Ope0610Component } from './ope0610/ope0610.component';
import { Ope0611Component } from './ope0611/ope0611.component';
// import { Ope0612Component } from './ope0612/ope0612.component';
import { Ope0613Component } from './ope0613/ope0613.component';
import { Ope0614Component } from './ope0614/ope0614.component';

const routes: Routes = [
  { path: '10', component: Ope0610Component },
  { path: '11', component: Ope0611Component },
  { path: '12', loadChildren:"./ope0612/ope0612.module#Ope0612Module"  },
  { path: '13', component: Ope0613Component },
  { path: '14', component: Ope0614Component },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class Ope06RoutingModule { }
