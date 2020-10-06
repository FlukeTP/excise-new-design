import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BreadcrumbModule } from '../../../common/components';
import { Tan01Component } from 'projects/tax-audit/tax-audit-new/tan01/tan01.component';
import { Tan0101Component } from 'projects/tax-audit/tax-audit-new/tan01/tan01-01/tan01-01.component';
import { Tan0102Component } from 'projects/tax-audit/tax-audit-new/tan01/tan01-02/tan01-02.component';
import { Tan0103Component } from 'projects/tax-audit/tax-audit-new/tan01/tan01-03/tan01-03.component';
import { Ta0106Component } from './trader-selection/ta01/ta0106/ta0106.component';
import { Select04Component } from './trader-selection/select04/select04.component';
import { Select05Component } from './trader-selection/select05/select05.component';
import { Select12Component } from './trader-selection/select12/select12.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { FlameandtoffeeComponent } from './flameandtoffee/flameandtoffee.component';
import { TableCustomModule } from './trader-selection/table-custom/table-custom.module';
import { SelectService } from './trader-selection/select.service';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './trader-selection/ta03/ta0301/ta0301.reducers';
const routes: Routes = [

    { path: "f", component: FlameandtoffeeComponent, },

    { path: "tan01", component: Tan01Component },
    { path: "tan01/01", component: Tan0101Component },
    { path: "tan01/02", component: Tan0102Component },
    { path: "tan01/03", component: Tan0103Component },

    { path: "ta0401", loadChildren: './trader-selection/ta04/ta0401/ta0401.module#Ta0401Module' },
    { path: "ta01", loadChildren: './trader-selection/ta01/ta01.module#Ta01Module' },
    { path: "ta02", loadChildren: './trader-selection/ta02/ta02.module#Ta02Module' },
    { path: "ta03", loadChildren: './trader-selection/ta03/ta03.module#Ta03Module' },
    { path: "ta05", loadChildren: './trader-selection/ta05/ta05.module#Ta05Module' },
    { path: "ta10", loadChildren: './trader-selection/ta10/ta10.module#Ta10Module' },


    { path: "select04", component: Select04Component },
    { path: "select05", component: Select05Component },
    { path: "select07", loadChildren: './trader-selection/select07/select07.module#Select07Module' },
    { path: "select12", component: Select12Component },
    { path: "select14", loadChildren: './trader-selection/select14/select14.module#Select14Module' },
    { path: "select16", loadChildren: './trader-selection/select16/select16.module#Select16Module' },
    { path: "select17", loadChildren: './trader-selection/select17/select17.module#Select17Module' },
    { path: "select18", loadChildren: './trader-selection/select18/select18.module#Select18Module' },
    { path: "select19", loadChildren: './trader-selection/select19/select19.module#Select19Module' },
    { path: "select20", loadChildren: './trader-selection/select20/select20.module#Select20Module' },
    { path: "tax-audit-manage", loadChildren: './tax-audit-manage/tax-audit-manage.module#TaxAuditManageModule' }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        BreadcrumbModule,
        ReactiveFormsModule,
        SharedModule,
        TableCustomModule,
        StoreModule.forFeature('Ta0301', reducers),
        StoreDevtoolsModule.instrument({
          maxAge: 25, // Retains last 25 states      
        }),
    ],
    declarations: [
        Tan01Component,
        Tan0101Component,
        Tan0102Component,
        Tan0103Component,       
        Select04Component,
        Select05Component,
        Select12Component,
        FlameandtoffeeComponent,

    ],
    exports: [RouterModule],
    providers: [
        SelectService
    ]
})
export class TaxAuditNew { }
