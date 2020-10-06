import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Int010201Component } from './int010201/int010201.component';
import { Int010202Component } from './int010202/int010202.component';
import { Int010203Component } from './int010203/int010203.component';
import { Int0102Component } from './int0102.component';

const routes: Routes = [
  { path :  ''  , 
  component:Int0102Component , children : [{
     path: '01', component: Int010201Component},
    { path: '02', component: Int010202Component},
    { path: '03', component: Int010203Component
  }]}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int0102RoutingModule { }
