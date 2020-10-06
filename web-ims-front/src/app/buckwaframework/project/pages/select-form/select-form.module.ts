import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { SelectFormComponent } from './select-form.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'components/breadcrumb/breadcrumb.module';
import { ResultSelectFormComponent } from './result-select-form/result-select-form.component';


const routes: Routes = [
    { path: ':category/:coordinate', component: SelectFormComponent, canActivate: [AuthGuard] },
    { path: 'rs001', component: ResultSelectFormComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule,FormsModule,BreadcrumbModule],
  declarations: [SelectFormComponent, ResultSelectFormComponent],
  exports: [RouterModule]
})
export class SelectFormComponentModule { }