import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ope0101Component } from './ope0101.component';
import { Ope010102Component } from './ope010102/ope010102.component';
import { Ope010103Component } from './ope010103/ope010103.component';
import { Ope010104Component } from './ope010104/ope010104.component';
import { Ope010105Component } from './ope010105/ope010105.component';

const routes: Routes = [
  { path: '', component: Ope0101Component },
  { path: '01', loadChildren: './ope010101/ope010101.module#Ope010101Module' },
  { path: '02', component: Ope010102Component },
  { path: '03', component: Ope010103Component },
  { path: '04', component: Ope010104Component },
  { path: '05', component: Ope010105Component },
  { path: '06', loadChildren: './ope010106/ope010106.module#Ope010106Module' },
]

@NgModule({
  declarations: [
    Ope0101Component,
    Ope010102Component,
    Ope010105Component,
    Ope010103Component,
    Ope010104Component
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [RouterModule]
})
export class Ope0101Module { }
