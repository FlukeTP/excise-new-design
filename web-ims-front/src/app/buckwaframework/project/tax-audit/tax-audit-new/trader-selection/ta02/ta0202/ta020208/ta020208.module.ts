import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta020208Component } from './ta020208.component';
import { Ta02020801Component } from './ta02020801/ta02020801.component';
import { Ta02020802Component } from './ta02020802/ta02020802.component';
import { Ta02020803Component } from './ta02020803/ta02020803.component';
import { Ta02020804Component } from './ta02020804/ta02020804.component';
import { Ta02020805Component } from './ta02020805/ta02020805.component';
import { SegmentModule } from 'components/segment/segment.module';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'components/button/button.module';
import { AuthGuard } from 'services/auth-guard.service';
import { FormSearchModule } from '../form-search/form-search.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';



const routes: Routes = [
  { path: '', redirectTo: "01", pathMatch: "full" },
  {
    path: '', component: Ta020208Component,
    children: [
      { path: '01', component: Ta02020801Component },
      { path: '02', component: Ta02020802Component },
      { path: '03', component: Ta02020803Component },
      { path: '04', component: Ta02020804Component },
      { path: '05', component: Ta02020805Component },
    ]
  },
]
  

@NgModule({
  declarations: [Ta020208Component, Ta02020801Component, Ta02020802Component, Ta02020803Component, Ta02020804Component, Ta02020805Component],
  imports: [
    CommonModule,

    SegmentModule,
    RouterModule.forChild(routes),
    ButtonModule,
    FormSearchModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  exports: [
    RouterModule
  ]
})
export class Ta020208Module { }
