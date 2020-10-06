import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { ExportAuditHomeComponent } from './export-audit-home.component';
import { RiskGroupComponent } from './risk-group/risk-group.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';
import { BreadcrumbModule } from '../../../common/components';
import { RiskConfigComponent } from './risk-config/risk-config.component';
import { SelectGroupComponent } from './risk-group/select-group/select-group.component';
import { SelectAreaComponent } from './risk-group/select-area/select-area.component';
import { PlanYearComponent } from './plan-year/plan-year.component';
import { OperatorDetailsComponent } from './operator-details/operator-details.component';

const routes: Routes = [
  { path: '', component: ExportAuditHomeComponent, canActivate: [AuthGuard] },
  { path: 'riskConfig', component: RiskConfigComponent, canActivate: [AuthGuard] },
  { path: 'risk-group', component: RiskGroupComponent, canActivate: [AuthGuard] },
  { path: 'plan-year', component: PlanYearComponent, canActivate: [AuthGuard] },
  { path: 'operator-details', component: OperatorDetailsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    BreadcrumbModule
  ],
  declarations: [ExportAuditHomeComponent, RiskConfigComponent, RiskGroupComponent, SelectGroupComponent, SelectAreaComponent, PlanYearComponent, OperatorDetailsComponent],
  exports: [RouterModule]
})
export class ExportAuditHomeModule {

  
 }
