import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { TaxHomeComponent } from './tax-home.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';
import { BreadcrumbModule } from '../../../common/components';
import { TaxHomeBoardComponent } from './tax-home-board/tax-home-board.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
  { path: '', component: TaxHomeComponent, canActivate: [AuthGuard] },
  { path: 'tax-home-board', component: TaxHomeBoardComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    BreadcrumbModule,
    SharedModule
  ],
  declarations: [TaxHomeComponent, TaxHomeBoardComponent],
  exports: [RouterModule]
})
export class TaxHomeModule { }
