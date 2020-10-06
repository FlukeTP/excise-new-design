import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '01', pathMatch: 'full' },
  { path:'01', loadChildren: './int070101/int070101.module#Int070101Module' },
  { path:'02', loadChildren: './int070102/int070102.module#Int070102Module' },
  { path:'03', loadChildren: './int070103/int070103.module#Int070103Module' }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int0701Module { }
