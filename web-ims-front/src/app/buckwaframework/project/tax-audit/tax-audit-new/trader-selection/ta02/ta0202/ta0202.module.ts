import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Ta0202Component } from './ta0202.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from '../../ta03/ta0301/ta0301.reducers';




const routes: Routes = [
  { path: "", component: Ta0202Component },
  { path: "02", loadChildren: './ta020202/ta020202.module#Ta020202Module' },
  { path: "01", loadChildren: './ta020201/ta020201.module#Ta020201Module' },
  // { path: "03", loadChildren: './ta020203/ta020203.module#Ta020203Module' },
  { path: "04", loadChildren: './ta020204/ta020204.module#Ta020204Module' },
  { path: "05", loadChildren: './ta020205/ta020205.module#Ta020205Module' },
  { path: "06", loadChildren: './ta020206/ta020206.module#Ta020206Module' },
  { path: "07", loadChildren: './ta020207/ta020207.module#Ta020207Module' },
  { path: "08", loadChildren: './ta020208/ta020208.module#Ta020208Module' },
  // { path: "09", loadChildren: './ta020209/ta020209.module#Ta020209Module' },
  // { path: "10", loadChildren: './ta020210/ta020210.module#Ta020210Module' },
  // { path: "11", loadChildren: './ta020211/ta020211.module#Ta020211Module' },
  // { path: "12", loadChildren: './ta020212/ta020212.module#Ta020212Module' },
  // { path: "13", loadChildren: './ta020213/ta020213.module#Ta020213Module' },
  // { path: "14", loadChildren: './ta020214/ta020214.module#Ta020214Module' },
  // { path: "15", loadChildren: './ta020215/ta020215.module#Ta020215Module' },
  // { path: "16", loadChildren: './ta020216/ta020216.module#Ta020216Module' },
  // { path: "17", loadChildren: './ta020217/ta020217.module#Ta020217Module' },
];

@NgModule({
  declarations: [Ta0202Component],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ],
  exports: [
    RouterModule
  ]
})
export class Ta0202Module { }
