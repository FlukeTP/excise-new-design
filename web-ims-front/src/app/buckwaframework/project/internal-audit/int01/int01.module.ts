import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../../../common/services";
import { Int01Component } from "./int01.component";
import { BreadcrumbModule, ButtonModule } from "../../../common/components";
import { SegmentModule, ModalModule } from "components/index";
import { Int01DetailsMainComponent } from "./int01-details-main/int01-details-main.component";
import { Int01DetailsDatepickerComponent } from './int01-details-datepicker/int01-details-datepicker.component';
// import { Int0102Component } from './int0102/int0102.component';
import { Int0103Component } from './int0103/int0103.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
    { path: '', component: Int01Component, canActivate: [AuthGuard] },
    { path: '01', component: Int01DetailsMainComponent, canActivate: [AuthGuard] },
    { path: '02', loadChildren: './int0102/int0102.module#Int0102Module' },
    { path: '03', component: Int0103Component, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        Int01Component,
        Int01DetailsMainComponent,
        Int01DetailsDatepickerComponent,
        // Int0102Component,
        Int0103Component,
    ],
    exports: [RouterModule],

})
export class Int01Module { }