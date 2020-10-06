import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Int0606Component } from './int0606.component';

const routes: Routes = [
  {path: "", component: Int0606Component },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int0606RoutingModule { }
