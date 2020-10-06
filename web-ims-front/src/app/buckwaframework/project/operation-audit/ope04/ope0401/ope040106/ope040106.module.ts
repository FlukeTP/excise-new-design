import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ope040106Component } from './ope040106.component';
import { Ope04010601Component } from './ope04010601/ope04010601.component';
import { Ope04010602Component } from './ope04010602/ope04010602.component';
import { Ope04010603Component } from './ope04010603/ope04010603.component';
import { Ope04010604Component } from './ope04010604/ope04010604.component';
import { Ope04010605Component } from './ope04010605/ope04010605.component';
import { Ope04010606Component } from './ope04010606/ope04010606.component';
import { Ope04010607Component } from './ope04010607/ope04010607.component';
import { Ope04010608Component } from './ope04010608/ope04010608.component';
import { Ope04010609Component } from './ope04010609/ope04010609.component';
import { Ope04010610Component } from './ope04010610/ope04010610.component';

const routes: Routes = [
  // { path: '', redirectTo: "01", pathMatch: "full" },
  {
    path: '', component: Ope040106Component,
    children: [
      { path: '01', component: Ope04010601Component },
      { path: '02', component: Ope04010602Component },
      { path: '03', component: Ope04010603Component },
      { path: '04', component: Ope04010604Component },
      { path: '05', component: Ope04010605Component },
      { path: '06', component: Ope04010606Component },
      { path: '07', component: Ope04010607Component },
      { path: '08', component: Ope04010608Component },
      { path: '09', component: Ope04010609Component },
      { path: '10', component: Ope04010610Component },
    ]
  },
]

@NgModule({
  declarations: [
    Ope040106Component,
    Ope04010601Component,
    Ope04010602Component,
    Ope04010603Component,
    Ope04010604Component,
    Ope04010605Component,
    Ope04010606Component,
    Ope04010607Component,
    Ope04010608Component,
    Ope04010609Component,
    Ope04010610Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class Ope040106Module { }
