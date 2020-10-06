import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Se01Component } from './se01.component';
import { S01Component } from './s01/s01.component';
import { S02Component } from './s02/s02.component';
import { S03Component } from './s03/s03.component';
import { S04Component } from './s04/s04.component';
import { S05Component } from './s05/s05.component';
import { S06Component } from './s06/s06.component';
import { S07Component } from './s07/s07.component';
import { S08Component } from './s08/s08.component';

const routes: Routes = [
  { path: '', redirectTo: "s01", pathMatch: "full" },
  {
    path: '', component: Se01Component,
    children: [
      { path: 's01', component: S01Component },
      { path: 's02', component: S02Component },
      { path: 's03', component: S03Component },
      { path: 's04', component: S04Component },
      { path: 's05', component: S05Component },
      { path: 's06', component: S06Component },
      { path: 's07', component: S07Component },
      { path: 's08', component: S08Component },
    ]
  },
]

@NgModule({
  declarations: [
    Se01Component,
    S01Component,
    S02Component,
    S03Component,
    S04Component,
    S05Component,
    S06Component,
    S07Component,
    S08Component,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class Se01Module { }
