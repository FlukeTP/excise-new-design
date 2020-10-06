import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from 'services/auth-guard.service';
import { Int050101Component } from './int050101.component';
import { Int05010102Component } from './int05010102/int05010102.component';
import { Int05010103Component } from './int05010103/int05010103.component';
import { Int05010104Component } from './int05010104/int05010104.component';
import { Int05010105Component } from './int05010105/int05010105.component';
import { ButtonModule } from 'components/button/button.module';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
    { path: "", component: Int050101Component, canActivate: [AuthGuard] },
    { path: "01", loadChildren: "./int05010101/int05010101.module#Int05010101Module" },
    { path: "02", component: Int05010102Component, canActivate: [AuthGuard] },
    { path: "03", component: Int05010103Component, canActivate: [AuthGuard] },
    { path: "04", component: Int05010104Component, canActivate: [AuthGuard] },
    { path: "05", component: Int05010105Component, canActivate: [AuthGuard] }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        SharedModule
    ],
    declarations: [
        Int050101Component,
        Int05010102Component,
        Int05010103Component,
        Int05010104Component,
        Int05010105Component
    ],
    exports: [RouterModule]
})
export class Int050101Module { }