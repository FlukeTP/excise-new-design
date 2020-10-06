import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '01', pathMatch: 'full' },
  { path:'01', loadChildren: './int070201/int070201.module#Int070201Module' },
  { path:'02', loadChildren: './int070202/int070202.module#Int070202Module' },
  { path:'03', loadChildren: './int070203/int070203.module#Int070203Module' }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Int0702Module { }
