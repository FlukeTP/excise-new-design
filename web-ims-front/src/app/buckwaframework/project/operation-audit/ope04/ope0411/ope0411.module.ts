import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ope0411Component } from './ope0411.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ope041101Component } from './ope041101/ope041101.component';
import { Ope041103Component } from './ope041103/ope041103.component';
import { Ope041104Component } from './ope041104/ope041104.component';
import { Ope041105Component } from './ope041105/ope041105.component';


const routes: Routes = [
  { path: '', component: Ope0411Component },
  { path: '01', component: Ope041101Component },
  { path: '02', loadChildren: "./ope041102/ope041102.module#Ope041102Module" },
  { path: '03', component: Ope041103Component },
  { path: '04', component: Ope041104Component },
  { path: '05', component: Ope041105Component },
];

@NgModule({
  declarations: [
    Ope0411Component,
    Ope041101Component,
    Ope041103Component,
    Ope041104Component,
    Ope041105Component

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    RouterModule
  ]
})
export class Ope0411Module { }
