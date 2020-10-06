import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int05010101Component } from './int05010101.component';
import { Int0501010101Component } from './int0501010101/int0501010101.component';
import { AuthGuard } from 'services/auth-guard.service';

const routes: Routes = [
    { path: "", component: Int05010101Component, canActivate: [AuthGuard] },
    { path: "01", component: Int0501010101Component, canActivate: [AuthGuard] }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        Int05010101Component,
        Int0501010101Component
    ],
    exports: [RouterModule],
    providers: [],
})
export class Int05010101Module { }