import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Int0902Component } from './int0902/int0902.component';
import { Int0904Component } from './int0904/int0904.component';
import { Int0905Component } from './int0905/int0905.component';
import { Int0906Component } from './int0906/int0906.component';
import { Int0907Component } from './int0907/int0907.component';
import { Int0908Component } from './int0908/int0908.component';
import { Int0909Component } from './int0909/int0909.component';
import { Int0910Component } from './int0910/int0910.component';
import { Int0911Component } from './int0911/int0911.component';
import { Int0912Component } from './int0912/int0912.component';
import { Int0913Component } from './int0913/int0913.component';
import { Int090201Component } from './int0902/int090201/int090201.component';
import { Int091201Component } from './int0912/int091201/int091201.component';
import { Int091202Component } from './int0912/int091202/int091202.component';

const routes: Routes = [
  { path: '', redirectTo: '01', pathMatch: 'full' },
  { path: '01', loadChildren: './int0901/int0901.module#Int0901Module' },
  { path: '02', component: Int0902Component },
  { path: '02/01', component: Int090201Component },
  { path: '03', loadChildren: './int0903/int0903.module#Int0903Module' },
  { path: '04', component: Int0904Component },
  { path: '05', component: Int0905Component },
  { path: '06', component: Int0906Component },
  { path: '07', component: Int0907Component },
  { path: '08', component: Int0908Component },
  { path: '09', component: Int0909Component },
  { path: '10', component: Int0910Component },
  { path: '11', component: Int0911Component },
  { path: '12', component: Int0912Component },
  { path: '12/01', component: Int091201Component },
  { path: '12/02', component: Int091202Component },
  { path: '13', loadChildren: './int0913/int0913.module#Int0913Module' }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int09RoutingModule { }
