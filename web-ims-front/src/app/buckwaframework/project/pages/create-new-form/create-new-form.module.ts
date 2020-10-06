import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { CreateNewFormComponent } from './create-new-form.component';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';

const routes: Routes = [
    { path: '', component: CreateNewFormComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  declarations: [CreateNewFormComponent],
  exports: [RouterModule]
})
export class CreateNewFormComponentModule { }