import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ope04Component } from './ope04.component';
import { Ope0402Component } from './ope0402/ope0402.component';
import { Ope0403Component } from './ope0403/ope0403.component';
import { Ope0404Component } from './ope0404/ope0404.component';
import { Ope0405Component } from './ope0405/ope0405.component';
import { Ope0408Component } from './ope0408/ope0408.component';
import { Ope0410Component } from './ope0410/ope0410.component';
import { Ope0412Component } from './ope0412/ope0412.component';
import { Ope041201Component } from './ope0412/ope041201/ope041201.component';
import { Ope041202Component } from './ope0412/ope041202/ope041202.component';

const routes: Routes = [
  { path: '', component: Ope04Component },
  { path: '01', loadChildren: './ope0401/ope0401.module#Ope0401Module' },
  { path: '02', component: Ope0402Component },
  { path: '03', component: Ope0403Component },
  { path: '04', component: Ope0404Component },
  { path: '05', component: Ope0405Component },
  { path: '06', loadChildren: './ope0406/ope0406.module#Ope0406Module' },
  { path: '07', loadChildren: './ope0407/ope0407.module#Ope0407Module' },
  { path: '08', component: Ope0408Component },
  { path: '09', loadChildren: './ope0409/ope0409.module#Ope0409Module' },
  { path: '10', component: Ope0410Component },
  { path: '11', loadChildren: './ope0411/ope0411.module#Ope0411Module' },
  { path: '12', component: Ope0412Component },
  { path: '12/01', component: Ope041201Component },
  { path: '12/02', component: Ope041202Component },
  { path: '13', loadChildren: './ope0413/ope0413.module#Ope0413Module' },
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Ope04RoutingModule { }
