import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "services/auth-guard.service";

import { Int120501Component } from "./int120501.component";
import { Int12050101Component } from "./int12050101/int12050101.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DirectivesModule } from "app/buckwaframework/common/directives/directives.module";
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
  { path: "", component: Int120501Component, canActivate: [AuthGuard] },
  { path: "01", component: Int12050101Component, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    DirectivesModule,
    SharedModule
  ],
  declarations: [Int120501Component, Int12050101Component],
  exports: [RouterModule]
})
export class Int120501Module {}
