import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { CheckReceiptTaxComponent } from './check-receipt-tax.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
    { path: '', component: CheckReceiptTaxComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule],
  declarations: [CheckReceiptTaxComponent],
  exports: [RouterModule]
})
export class CheckReceiptTaxComponentModule { }