import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int0501Component } from './int0501.component';
import { Routes, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from 'services/auth-guard.service';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';


const routes: Routes = [
    { path: "", component: Int0501Component, canActivate: [AuthGuard] },
    { path: "01", loadChildren: "./int050101/int050101.module#Int050101Module" },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    declarations: [Int0501Component],
    exports: [RouterModule]
})
export class Int0501Module { }