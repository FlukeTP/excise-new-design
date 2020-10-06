import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginPage } from "../../project/pages/login/login";
import { UnauthGuard } from "../services";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "", loadChildren: '../layout/layout.module#LayoutModule' },
  {
    path: "login",
    component: LoginPage,
    canActivate: [UnauthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
