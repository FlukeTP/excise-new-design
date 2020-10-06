import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Ed01Component } from './ed01/ed01.component';
import { Ed0101Component } from './ed01/ed0101/ed0101.component';
import { Ed0102Component } from './ed01/ed0102/ed0102.component';
import { Ed02Component } from './ed02/ed02.component';
import { Ed0201Component } from './ed02/ed0201/ed0201.component';
import { Ed03Component } from './ed03/ed03.component';
import { Ed04Component } from './ed04/ed04.component';

const routes: Routes = [
  { path: "ed01", component: Ed01Component },
  { path: "ed01/01", component: Ed0101Component },
  { path: "ed01/02", component: Ed0102Component },
  { path: "ed02", component: Ed02Component },
  { path: "ed02/01", component: Ed0201Component },
  { path: "ed03", component: Ed03Component },
  { path: "ed04", component: Ed04Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EDRoutingModule { }
