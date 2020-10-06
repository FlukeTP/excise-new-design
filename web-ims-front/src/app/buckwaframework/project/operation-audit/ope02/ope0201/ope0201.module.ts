import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ope0201Component } from '../ope0201/ope0201.component';
import { Ope020102Component } from './ope020102/ope020102.component';
import { Ope020103Component } from './ope020103/ope020103.component';
import { Ope020104Component } from './ope020104/ope020104.component';
import { Ope020105Component } from './ope020105/ope020105.component';
import { StoreModule } from '@ngrx/store';
import { Ope020103Reducer } from './ope020103/ope020103.reducer';

const routes: Routes = [
  { path: '', component: Ope0201Component },
  { path: '01', loadChildren: "./ope020101/ope020101.module#Ope020101Module" },
  { path: '02', component: Ope020102Component },
  { path: '03', component: Ope020103Component },
  { path: '04', component: Ope020104Component },
  { path: '05', component: Ope020105Component },
  { path: '06', loadChildren: "./ope020106/ope020106.module#Ope020106Module"}
];

@NgModule({
  declarations: [
    Ope0201Component,
    Ope020102Component,
    Ope020103Component,
    Ope020104Component,
    Ope020105Component
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
export class Ope0201Module { }
