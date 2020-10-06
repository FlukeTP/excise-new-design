import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Int0202Component } from './int0202.component';
import { Int020201Component } from './int020201/int020201.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Int02Service } from '../int02.service';

const routes: Routes = [
    { path: '', component: Int0202Component },
    { path: '01', component: Int020201Component }
];

@NgModule({
    declarations: [Int0202Component, Int020201Component],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        ReactiveFormsModule,
        FormsModule
    ],
    exports: [RouterModule],
    providers: [Int02Service]
})
export class Int0202Module { }