import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { CreateFormComponent } from './create-form.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';

const routes: Routes = [
    { path: '', component: CreateFormComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  declarations: [CreateFormComponent],
  exports: [RouterModule]
})
export class CreateFormComponentModule { }