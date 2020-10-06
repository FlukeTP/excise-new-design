import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { MessagePage } from './message';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';

const routes: Routes = [
    { path: '', component: MessagePage, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  declarations: [MessagePage],
  exports: [RouterModule]
})
export class MessageModule { }