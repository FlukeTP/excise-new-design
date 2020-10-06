import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { CheckReceiptLicenseComponent } from './check-receipt-license.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';

const routes: Routes = [
    { path: '', component: CheckReceiptLicenseComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  declarations: [CheckReceiptLicenseComponent],
  exports: [RouterModule]
})
export class CheckReceiptLicenseComponentModule { }