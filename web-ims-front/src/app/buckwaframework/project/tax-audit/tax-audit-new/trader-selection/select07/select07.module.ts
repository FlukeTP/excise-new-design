import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'services/auth-guard.service';
import { Select07Component } from './select07.component';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Se04Component } from './se04/se04.component';
import { Se05Component } from './se05/se05.component';


const routes: Routes = [
  { path: "", component: Select07Component, canActivate: [AuthGuard] },
  { path: "se01", loadChildren: './se01/se01.module#Se01Module' },
  { path: "se02", loadChildren: './se02/se02.module#Se02Module'},
  { path: "se03", loadChildren: './se03/se03.module#Se03Module'},
  { path: "se04", component: Se04Component, canActivate: [AuthGuard] },
  { path: "se05", component: Se05Component, canActivate: [AuthGuard] },
 
]
@NgModule({
  declarations: [
    Select07Component,
    Se04Component,
    Se05Component,
  
  
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    BreadcrumbModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class Select07Module { }
