import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ParameterInfoDetailPage } from "./parameterinfoDetail";

import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../../../common/services";

const routes: Routes = [
  { path: "", component: ParameterInfoDetailPage, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  declarations: [ParameterInfoDetailPage],
  exports: [RouterModule]
})
export class ParameterInfoDetailPageModule {}
