import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxAuditManageComponent } from './tax-audit-manage.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'services/auth-guard.service';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SegmentModule } from 'components/segment/segment.module';
import { TsModule } from './ts/ts.module';
import { RecordMessageModule } from './record-message/record-message.module';
import { ButtonModule } from 'components/button/button.module';

const routes: Routes = [
    { path: "", component: TaxAuditManageComponent, canActivate: [AuthGuard] },
    { path: "record-message", loadChildren: './record-message/record-message.module#RecordMessageModule', canActivate: [AuthGuard] },
    { path: "ts", loadChildren: './ts/ts.module#TsModule', canActivate: [AuthGuard] }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        BreadcrumbModule,
        ReactiveFormsModule,
        SegmentModule,
        ButtonModule,

        //content ts and record-message page
        TsModule,
        RecordMessageModule
    ],
    declarations: [TaxAuditManageComponent],
    exports: [RouterModule],
    providers: [],
})
export class TaxAuditManageModule { }