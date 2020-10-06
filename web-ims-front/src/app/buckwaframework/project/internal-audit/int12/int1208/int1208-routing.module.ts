import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { Int120801Component } from './int120801/int120801.component';


const routes: Routes = [
  { path: '', redirectTo: '01', pathMatch: 'full' },
  { path: '01',  loadChildren: "./int120801/int120801.module#Int120801Module" },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int1208RoutingModule { }
