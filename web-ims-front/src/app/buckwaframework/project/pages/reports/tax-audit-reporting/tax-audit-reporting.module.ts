import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { TaxAuditReportingComponent } from './tax-audit-reporting.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../common/services';
import { Ts0101Component } from './ts01-01/ts01-01.component';
import { Ts0102Component } from './ts01-02/ts01-02.component';
import { Ts0103Component } from './ts01-03/ts01-03.component';
import { Ts0104Component } from './ts01-04/ts01-04.component';
import { Ts0105Component } from './ts01-05/ts01-05.component';
import { Ts0107Component } from './ts01-07/ts01-07.component';
import { Ts0108Component } from './ts01-08/ts01-08.component';
import { Ts0110Component } from './ts01-10/ts01-10.component';
import { Ts01101Component } from './ts01-10-1/ts01-10-1.component';
import { Ts0111Component } from './ts01-11/ts01-11.component';
import { Ts0113Component } from './ts01-13/ts01-13.component';
import { Ts0114Component } from './ts01-14/ts01-14.component';
import { Ts01141Component } from './ts01-14-1/ts01-14-1.component';
import { Ts01142Component } from './ts01-14-2/ts01-14-2.component';
import { Ts0115Component } from './ts01-15/ts01-15.component';
import { Ts0116Component } from './ts01-16/ts01-16.component';
import { Ts0117Component } from './ts01-17/ts01-17.component';
import { Ts01171Component } from './ts01-17-1/ts01-17-1.component';
import { Ts0119Component } from './ts01-19/ts01-19.component';
import { FormsModule } from '../../../../../../../node_modules/@angular/forms';
import { GetAppRovedComponent } from './get-app-roved/get-app-roved.component';
import { FollowSupervisionComponent } from './follow-supervision/follow-supervision.component';
import { Ts0118Component } from './ts01-18/ts01-18.component';
import { Solvent01Component } from './solvent-01/solvent-01.component';
import { Solvent02Component } from './solvent-02/solvent-02.component';
import { DirectivesModule } from 'app/buckwaframework/common/directives/directives.module';


const routes: Routes = [
    { path: '', component: TaxAuditReportingComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes), 
    CommonModule, 
    FormsModule,
    DirectivesModule
  ],
  declarations: [
    TaxAuditReportingComponent,
    Ts0101Component,
    Ts0102Component,
    Ts0103Component,
    Ts0104Component,
    Ts0105Component,
    Ts0107Component,
    Ts0108Component,
    Ts0110Component,
    Ts01101Component,
    Ts0111Component,
    Ts0113Component,
    Ts0114Component,
    Ts01141Component,
    Ts01142Component,
    Ts0115Component,
    Ts0116Component,
    Ts0117Component,
    Ts01171Component,
    Ts0118Component,
    Ts0119Component,
    GetAppRovedComponent,
    FollowSupervisionComponent,
    Solvent01Component,
    Solvent02Component
    
  ],
  exports: [RouterModule]
})
export class TaxAuditReportingComponentModule { }