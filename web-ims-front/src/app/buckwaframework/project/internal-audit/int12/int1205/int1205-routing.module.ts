import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '01', pathMatch: 'full' },
  { path: '01', loadChildren: "./int120501/int120501.module#Int120501Module" },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int1205RoutingModule { }
