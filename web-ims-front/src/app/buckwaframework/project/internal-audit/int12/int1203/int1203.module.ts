import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int120301Component } from './int120301/int120301.component';
import { Int12030101Component } from './int120301/int12030101/int12030101.component';

const routes: Routes = [
    { path: "01", component: Int120301Component },
    { path: "01/01", component: Int12030101Component }

];

@NgModule({
    declarations: [Int120301Component, Int12030101Component],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        SharedModule
    ],
    exports: [RouterModule],
    providers: [],
})
export class Int1203Module { }