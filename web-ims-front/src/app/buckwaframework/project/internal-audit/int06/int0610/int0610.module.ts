import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int061001Component } from './int061001/int061001.component';
import { Routes, RouterModule } from '@angular/router';
import { Int0610Component } from './int0610.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    { path: "", component: Int0610Component },
    { path: "01", component: Int061001Component }

];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [Int0610Component, Int061001Component]
})
export class Int0610Module { }