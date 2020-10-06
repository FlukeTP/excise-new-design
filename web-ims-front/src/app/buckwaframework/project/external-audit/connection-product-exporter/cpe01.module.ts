import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';

import { ConnectionProductExporterComponent } from './cpe01.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Cpe0101Component } from './cpe0101/cpe0101.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

const routes: Routes = [
  { path: '', component: ConnectionProductExporterComponent, canActivate: [AuthGuard] },
  { path: '01', component: Cpe0101Component, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ConnectionProductExporterComponent, Cpe0101Component],
  exports: [RouterModule]
})

export class ConnectionProductExporterModule { }
