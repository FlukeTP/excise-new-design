import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { MessageDetailPage } from './message-detail';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';

const routes: Routes = [
    { path: '', component: MessageDetailPage, canActivate: [AuthGuard] },
    { path: ':id', component: MessageDetailPage, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  declarations: [MessageDetailPage],
  exports: [RouterModule]
})
export class MessageDetailModule { }