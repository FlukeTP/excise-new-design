import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: '01', pathMatch: 'full' },
  { path:'01', loadChildren: './int070301/int070301.module#Int070301Module' },
  { path:'02', loadChildren: './int070302/int070302.module#Int070302Module' }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int0703Module { }
