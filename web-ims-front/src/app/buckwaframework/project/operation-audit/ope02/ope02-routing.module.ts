import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ope02Component } from './ope02.component';
import { Ope0202Component } from './ope0202/ope0202.component';
import { Ope0203Component } from './ope0203/ope0203.component';
import { Ope0204Component } from './ope0204/ope0204.component';
import { Ope0205Component } from './ope0205/ope0205.component';
import { Ope0206Component } from './ope0206/ope0206.component';
import { Ope0207Component } from './ope0207/ope0207.component';
import { Ope020701Component } from './ope0207/ope020701/ope020701.component';

const routes: Routes = [
  { path: '', component: Ope02Component },
  { path: '01', loadChildren: './ope0201/ope0201.module#Ope0201Module' },
  { path: '02', component: Ope0202Component },
  { path: '03', component: Ope0203Component },
  { path: '04', component: Ope0204Component },
  { path: '05', component: Ope0205Component },
  { path: '06', component: Ope0206Component },
  { path: '07', component: Ope0207Component },
  { path: '07/01', component: Ope020701Component },
  { path: '08', loadChildren: './ope0208/ope0208.module#Ope0208Module' },
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Ope02RoutingModule { }
