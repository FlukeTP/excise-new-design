import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../common/services';

import { ExporterSearchComponent } from './exporter-search.component';
import { ExporterDetailsComponent } from './exporter-details/exporter-details.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';


const routes: Routes = [
  { path: '', component: ExporterSearchComponent, canActivate: [AuthGuard] },
  { path: 'app-exporter-details', component: ExporterDetailsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule
  ],
  declarations: [ExporterSearchComponent, ExporterDetailsComponent],
  exports: [RouterModule]
})

export class ExporterSearchModule { }
