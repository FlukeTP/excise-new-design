import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { ReportIntComponent } from './report-int/report-int.component';
import { ReportOptComponent } from './report-opt/report-opt.component';
import { ReportOutComponent } from './report-out/report-out.component';
import { ReportTaxComponent } from './report-tax/report-tax.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
    { path: 'int', component: ReportIntComponent, canActivate: [AuthGuard] },
    { path: 'opt', component: ReportOptComponent, canActivate: [AuthGuard] },
    { path: 'out', component: ReportOutComponent, canActivate: [AuthGuard] },
    { path: 'tax', component: ReportTaxComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule
    ],
    declarations: [
        ReportIntComponent,
        ReportOptComponent,
        ReportOutComponent,
        ReportTaxComponent
    ],
    exports: [RouterModule]
})
export class ReportsModule { }