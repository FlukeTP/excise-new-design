import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';

import { BreadcrumbModule } from '../../../common/components';

import { ProductReleaseHistoryComponent } from './product-release-history.component';
import { StepComponent } from './step/step.component';

const routes: Routes = [
  { path: '', component: ProductReleaseHistoryComponent, canActivate: [AuthGuard] },
  { path: 'step', component: StepComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    BreadcrumbModule
  ],
  declarations: [ProductReleaseHistoryComponent,StepComponent],
  exports: [RouterModule]
})

export class ProductReleaseHistoryModule { }
