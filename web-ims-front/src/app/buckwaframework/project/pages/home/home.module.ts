import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

import { HomePage } from "./home";
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
  { path: "", component: HomePage },
];

@NgModule({
  imports: [
      RouterModule.forChild(routes),
      CommonModule,
      FormsModule,
      SharedModule
    ],
  declarations: [
      HomePage
  ],
  exports: [RouterModule]
})

export class HomeModule { }