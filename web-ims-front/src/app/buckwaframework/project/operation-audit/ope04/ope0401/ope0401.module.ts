import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ope0401Component } from './ope0401.component';
import { Ope040102Component } from './ope040102/ope040102.component';
import { Ope040103Component } from './ope040103/ope040103.component';
import { Ope040104Component } from './ope040104/ope040104.component';
import { Ope040105Component } from './ope040105/ope040105.component';

const routes: Routes = [
  { path: '', component: Ope0401Component },
  { path: '01', loadChildren: "./ope040101/ope040101.module#Ope040101Module" },
  { path: '02', component: Ope040102Component },
  { path: '03', component: Ope040103Component },
  { path: '04', component: Ope040104Component },
  { path: '05', component: Ope040105Component },
  { path: '06', loadChildren: "./ope040106/ope040106.module#Ope040106Module"}
];

@NgModule({
  declarations: [
    Ope0401Component,
    Ope040102Component,
    Ope040103Component,
    Ope040104Component,
    Ope040105Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class Ope0401Module { }
