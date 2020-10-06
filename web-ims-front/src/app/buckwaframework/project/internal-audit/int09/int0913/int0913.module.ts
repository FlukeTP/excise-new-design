import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'components/button/button.module';
import { ModalModule } from 'components/modal/modal.module';
import { SegmentModule } from 'components/segment/segment.module';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { BreadcrumbModule } from 'components/index';
import { Int0913Component } from '../int0913/int0913.component';
import { Int091303Component } from '../int0913/int091303/int091303.component';
import { Int091301Component } from './int091301/int091301.component';
import { Int091302Component } from './int091302/int091302.component';
import { Int091304Component } from './int091304/int091304.component';
import { Int091305Component } from './int091305/int091305.component';

const routes: Routes = [
    { path: '', component: Int0913Component },
    { path: '01', component: Int091301Component },
    { path: '02', component: Int091302Component },
    { path: '03', component: Int091303Component },
    { path: '04', component: Int091304Component },
    { path: '05', component: Int091305Component },
];

@NgModule({
    declarations: [
        Int0913Component,
        Int091303Component,
        Int091301Component,
        Int091302Component,
        Int091304Component,
        Int091305Component
    ],
    imports: [CommonModule, RouterModule.forChild(routes),
        FormsModule,
        SharedModule,
        BreadcrumbModule,
        SegmentModule,
        ModalModule,
        ButtonModule,
        ReactiveFormsModule],
    exports: [RouterModule]
})
export class Int0913Module { }