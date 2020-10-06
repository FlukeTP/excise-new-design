import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Se03Component } from './se03.component';
import { RouterModule, Routes } from '@angular/router';
import { S01Component } from './s01/s01.component';
import { S02Component } from './s02/s02.component';
import { S03Component } from './s03/s03.component';
import { S04Component } from './s04/s04.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { FormSearchModule } from '../form-search/form-search.module';
import { ReactiveFormsModule } from '@angular/forms';
import { S05Component } from './s05/s05.component';




const routes: Routes = [
  { path: '', redirectTo: "s01", pathMatch: "full" },
  {
    path: '', component: Se03Component,
    children: [
      { path: 's01', component: S01Component },
      { path: 's02', component: S02Component },
      { path: 's03', component: S03Component },
      { path: 's04', component: S04Component },
      { path: 's05', component: S05Component },
    ]
  },
]
@NgModule({
  declarations: [
    Se03Component,
    S01Component,
    S02Component,
    S03Component,
    S04Component,
    S05Component,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormSearchModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class Se03Module { }
