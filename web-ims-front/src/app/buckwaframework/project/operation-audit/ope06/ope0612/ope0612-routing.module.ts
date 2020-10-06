import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Ope0612Component } from './ope0612.component';
import { Ope061201Component } from './ope061201/ope061201.component';
import { Ope061202Component } from './ope061202/ope061202.component';
import { Ope061203Component } from './ope061203/ope061203.component';

const routes: Routes = [
  { path: "", component: Ope0612Component },
  { path: "01", component: Ope061201Component },
  { path: "02", component: Ope061202Component },
  { path: "03", component: Ope061203Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Ope0612RoutingModule { }
