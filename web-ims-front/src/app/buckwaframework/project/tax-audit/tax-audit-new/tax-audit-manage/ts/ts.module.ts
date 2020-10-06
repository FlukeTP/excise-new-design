import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ts0101Component } from './ts0101/ts0101.component';
import { AuthGuard } from 'services/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SegmentModule } from 'components/segment/segment.module';
import { ButtonModule } from 'components/button/button.module';

const routes: Routes = [
    { path: "01-01", component: Ts0101Component, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BreadcrumbModule,
        ReactiveFormsModule,
        SegmentModule,
        ButtonModule
    ],
    declarations: [Ts0101Component],
    exports: [
        RouterModule,
        Ts0101Component
    ],
    providers: [],
})
export class TsModule { }