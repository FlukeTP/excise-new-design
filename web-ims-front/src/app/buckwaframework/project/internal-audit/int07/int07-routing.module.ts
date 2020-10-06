import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', redirectTo: '01', pathMatch: 'full' },
  { path:'01', loadChildren: './int0701/int0701.module#Int0701Module' },
  { path:'02', loadChildren: './int0702/int0702.module#Int0702Module' },
  { path:'03', loadChildren: './int0703/int0703.module#Int0703Module' }
];

@NgModule({
  imports: [CommonModule,RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int07RoutingModule { }
