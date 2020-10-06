import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Int0401Component } from './int0401/int0401.component';
import { Int0402Component } from './int0402/int0402.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';


const routes: Routes = [
    { path: "01", component: Int0401Component },
    { path: "02", component: Int0402Component },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [ Int0401Component, Int0402Component],
    exports: [RouterModule],
    providers: [],
})
export class Int04Module { }