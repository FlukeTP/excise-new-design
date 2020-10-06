import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../../../common/templates/shared.module';
import { Ope010106Component } from './ope010106.component';
import { Ope01010601Component } from './ope01010601/ope01010601.component';
import { Ope01010602Component } from './ope01010602/ope01010602.component';
import { Ope01010604Component } from './ope01010604/ope01010604.component';
import { Ope01010606Component } from './ope01010606/ope01010606.component';
import { Ope01010607Component } from './ope01010607/ope01010607.component';
import { Ope01010608Component } from './ope01010608/ope01010608.component';
import { Ope01010609Component } from './ope01010609/ope01010609.component';
import { Ope01010610Component } from './ope01010610/ope01010610.component';
import { Ope01010611Component } from './ope01010611/ope01010611.component';

const routes: Routes = [
  {
    path: '', component: Ope010106Component,
    children: [
      { path: '01', component: Ope01010601Component },
      { path: '02', component: Ope01010602Component },
      { path: '04', component: Ope01010604Component },
      { path: '06', component: Ope01010606Component },
      { path: '07', component: Ope01010607Component },
      { path: '08', component: Ope01010608Component },
      { path: '09', component: Ope01010609Component },
      { path: '10', component: Ope01010610Component },
      { path: '11', component: Ope01010611Component },
    ]
  },
]

@NgModule({
  declarations: [
    Ope010106Component,
    Ope01010601Component,
    Ope01010602Component,
    Ope01010604Component,
    Ope01010606Component,
    Ope01010607Component,
    Ope01010608Component,
    Ope01010609Component,
    Ope01010610Component,
    Ope01010611Component
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
export class Ope010106Module { }
