import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
    { path: "01", loadChildren: './int120601/int120601.module#Int120601Module' }
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        SharedModule
    ],
    exports: [RouterModule],
    providers: [],
})
export class Int1206Module { }