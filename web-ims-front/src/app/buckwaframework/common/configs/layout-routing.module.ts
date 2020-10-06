import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageComponentComponent } from 'projects/page-component/page-component.component';
import { AuthGuardChild } from 'services/auth-guard-child.service';
import { LayoutComponent } from '../layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [AuthGuardChild],
    children: [

      // Admin Management
      { path: "management", loadChildren: "projects/admin-management/admin-management.module#AdminManagementModule" },

      // Excise Modules      
      { path: "home", loadChildren: "projects/pages/home/home.module#HomeModule" },
      { path: "message", loadChildren: "projects/pages/message/message.module#MessageModule" },
      { path: "add-message", loadChildren: "projects/pages/message/message-detail.module#MessageDetailModule" },
      { path: "edit-message", loadChildren: "projects/pages/message/message-detail.module#MessageDetailModule" },
      { path: "parameterInfo", loadChildren: "projects/pages/parameterInfo/parameterInfo.module#ParameterInfoPageModule" },
      { path: "parameterGroup", loadChildren: "projects/pages/parameterGroup/parameterGroup.module#ParameterGroupPageModule" },
      { path: "parameterInfoDetail", loadChildren: "projects/pages/parameterInfo/parameterInfoDetail.module#ParameterInfoDetailPageModule" },
      { path: "analysis", loadChildren: "projects/pages/analysis/analysis.component.module#AnalysisPageModule" },
      { path: "tax-audit-manage", loadChildren: "projects/pages/reports/tax-audit-reporting/tax-audit-reporting.module#TaxAuditReportingComponentModule" },
      { path: "result-analysis", loadChildren: "projects/pages/result-analysis/result-analysis.module#ResultAnalysisPageModule" },
      { path: "select-form", loadChildren: "projects/pages/select-form/select-form.module#SelectFormComponentModule" },
      { path: "create-form", loadChildren: "projects/pages/create-form/create-form.module#CreateFormComponentModule" },
      { path: "select-new-form", loadChildren: "projects/pages/select-new-form/select-new-form.module#SelectNewFormComponentModule" },
      { path: "create-new-form", loadChildren: "projects/pages/create-new-form/create-new-form.module#CreateNewFormComponentModule" },
      { path: "check-receipt-tax", loadChildren: "projects/pages/check-receipt-tax/check-receipt-tax.module#CheckReceiptTaxComponentModule" },
      { path: "check-receipt-license", loadChildren: "projects/pages/check-receipt-license/check-receipt-license.module#CheckReceiptLicenseComponentModule" },
      { path: "mgcontrol", loadChildren: "projects/management-control/mgcontrol/mgcontrol.module#MgcontrolComponentModule" },
      { path: "mgReportResult", loadChildren: "projects/management-control/mgc02/mgReportResult.module#MgReportResultComponentModule" },
      { path: "int01", loadChildren: "projects/internal-audit/int01/int01.module#Int01Module" },
      { path: "int02", loadChildren: "projects/internal-audit/int02/int02.module#Int02Module" },
      { path: "int03", loadChildren: "projects/internal-audit/int03/int03.module#Int03Module" },
      { path: "int04", loadChildren: "projects/internal-audit/int04/int04.module#Int04Module" },
      { path: "int05", loadChildren: "projects/internal-audit/int05/int05.module#Int05Module" },
      { path: "int06", loadChildren: "projects/internal-audit/int06/int06.module#Int06Module" },
      { path: "int07", loadChildren: "projects/internal-audit/int07/int07.module#Int07Module" },
      { path: "int08", loadChildren: "projects/internal-audit/int08/int08.module#Int08Module" },
      { path: "int09", loadChildren: "projects/internal-audit/int09/int09.module#Int09Module" },
      { path: "int10", loadChildren: "projects/internal-audit/int10/int10.module#Int10Module" },
      { path: "int11", loadChildren: "projects/internal-audit/int11/int11.module#Int11Module" },
      { path: "int12", loadChildren: "projects/internal-audit/int12/int12.module#Int12Module" },
      { path: "int13", loadChildren: "projects/internal-audit/int13/int13.module#Int13Module" },
      { path: "int15", loadChildren: "projects/internal-audit/int15/int15.module#Int15Module" },
      { path: "ope01", loadChildren: "projects/operation-audit/ope01/ope01.module#Ope01Module" },
      { path: "ope02", loadChildren: "projects/operation-audit/ope02/ope02.module#Ope02Module" },
      { path: "ope03", loadChildren: "projects/operation-audit/ope03/ope03.module#Ope03Module" },
      { path: "ope04", loadChildren: "projects/operation-audit/ope04/ope04.module#Ope04Module" },
      { path: "ope06", loadChildren: "projects/operation-audit/ope06/ope06.module#Ope06Module" },
      { path: "ope07", loadChildren: "projects/operation-audit/ope07/ope07.module#Ope07Module" },
      { path: "plan01", loadChildren: "projects/plan/plan01/plan01.module#Plan01Module" },
      { path: "plan02", loadChildren: "projects/plan/plan02/plan02.module#Plan02Module" },
      { path: "plan03", loadChildren: "projects/plan/plan03/plan03.module#Plan03Module" },
      { path: "tax-audit-new", loadChildren: "projects/tax-audit/tax-audit-new/tax-audit-new.module#TaxAuditNew" },
      { path: "tax-home", loadChildren: "projects/pages/tax-home/tax-home.module#TaxHomeModule" },
      { path: "export-audit-home", loadChildren: "projects/export-audit/export-audit-home/export-audit-home.module#ExportAuditHomeModule" },
      { path: "connection-product-exporter", loadChildren: "projects/external-audit/connection-product-exporter/cpe01.module#ConnectionProductExporterModule" },
      { path: "product-release-history", loadChildren: "projects/external-audit/product-release-history/product-release-history.module#ProductReleaseHistoryModule" },
      { path: "exporter-search", loadChildren: "projects/external-audit/exporter-search/exporter-search.module#ExporterSearchModule" },
      { path: "components", component: PageComponentComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }