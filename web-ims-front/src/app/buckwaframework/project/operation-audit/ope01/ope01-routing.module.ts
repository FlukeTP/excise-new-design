import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ope01Component } from './ope01.component';
import { Ope0102Component } from './ope0102/ope0102.component';
import { Ope0103Component } from './ope0103/ope0103.component';
import { Ope0104Component } from './ope0104/ope0104.component';
import { Ope0105Component } from './ope0105/ope0105.component';
import { Ope0106Component } from './ope0106/ope0106.component';
import { Ope0107Component } from './ope0107/ope0107.component';
import { Ope010701Component } from './ope0107/ope010701/ope010701.component';

const routes: Routes = [
  { path: '', component: Ope01Component },
  { path: '01', loadChildren: './ope0101/ope0101.module#Ope0101Module' },
  { path: '02', component: Ope0102Component },
  { path: '03', component: Ope0103Component },
  { path: '04', component: Ope0104Component },
  { path: '05', component: Ope0105Component },
  { path: '06', component: Ope0106Component },
  { path: '07', component: Ope0107Component },
  { path: '07/01', component: Ope010701Component },
  { path: '08', loadChildren: './ope0108/ope0108.module#Ope0108Module' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Ope01RoutingModule { }
