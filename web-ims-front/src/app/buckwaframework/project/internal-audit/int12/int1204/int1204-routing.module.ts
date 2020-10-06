import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '01', pathMatch: 'full' },
  { path: '01', loadChildren: "./int120401/int120401.module#Int120401Module" },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int1204RoutingModule { }
