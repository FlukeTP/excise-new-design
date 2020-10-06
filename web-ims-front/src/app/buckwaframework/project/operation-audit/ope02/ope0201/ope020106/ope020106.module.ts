import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ope020106Component } from './ope020106.component';
import { Ope02010601Component } from './ope02010601/ope02010601.component';
import { Ope02010602Component } from './ope02010602/ope02010602.component';
import { Ope02010603Component } from './ope02010603/ope02010603.component';
import { Ope02010604Component } from './ope02010604/ope02010604.component';
import { Ope02010605Component } from './ope02010605/ope02010605.component';
import { Ope02010606Component } from './ope02010606/ope02010606.component';
import { Ope02010607Component } from './ope02010607/ope02010607.component';
import { Ope02010608Component } from './ope02010608/ope02010608.component';
import { Ope02010609Component } from './ope02010609/ope02010609.component';
import { Ope02010610Component } from './ope02010610/ope02010610.component';

const routes: Routes = [
  // { path: '', redirectTo: "03", pathMatch: "full" },
  {
    path: '', component: Ope020106Component,
    children: [
      { path: '01', component: Ope02010601Component },
      { path: '02', component: Ope02010602Component },
      { path: '03', component: Ope02010603Component },
      { path: '04', component: Ope02010604Component },
      { path: '05', component: Ope02010605Component },
      { path: '06', component: Ope02010606Component },
      { path: '07', component: Ope02010607Component },
      { path: '08', component: Ope02010608Component },
      { path: '09', component: Ope02010609Component },
      { path: '10', component: Ope02010610Component },
    ]
  },
]

@NgModule({
  declarations: [
    Ope020106Component,
    Ope02010601Component,
    Ope02010602Component,
    Ope02010603Component,
    Ope02010604Component,
    Ope02010605Component,
    Ope02010606Component,
    Ope02010607Component,
    Ope02010608Component,
    Ope02010609Component,
    Ope02010610Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class Ope020106Module { }
