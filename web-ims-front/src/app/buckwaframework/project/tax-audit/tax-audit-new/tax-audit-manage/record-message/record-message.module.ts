import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rm01Component } from './rm01/rm01.component';
import { Rm02Component } from './rm02/rm02.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'services/auth-guard.service';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SegmentModule } from 'components/segment/segment.module';
import { ButtonModule } from 'components/button/button.module';

const routes: Routes = [
    { path: "01", component: Rm01Component, canActivate: [AuthGuard] },
    { path: "02", component: Rm02Component, canActivate: [AuthGuard] },
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
    declarations: [
        Rm01Component,
        Rm02Component
    ],
    exports: [
        RouterModule,
        Rm01Component,
        Rm02Component
    ],
    providers: [],
})
export class RecordMessageModule { }