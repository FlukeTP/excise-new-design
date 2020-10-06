import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Int0901Component } from './int0901.component';
import { Int090101Component } from './int090101/int090101.component';
import { Int090102Component } from './int090102/int090102.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule, ModalModule, SegmentModule, BreadcrumbModule } from 'components/index';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Int0901011Service } from './int090101/int090101-1.service';
import { Int0901013Service } from './int090101/int090101-3.service';
import { Int09010101Component } from './int090101/int09010101/int09010101.component';
import { Int09010102Component } from './int090101/int09010102/int09010102.component';


const routes: Routes = [
  { path: '', redirectTo: '01', pathMatch: 'full' },
  { path:'01', component: Int090101Component },
  { path:'02', component: Int090102Component },
  { path:'01/01', component: Int09010101Component },
  { path:'01/02', component: Int09010102Component },
];

@NgModule({
  declarations: [Int0901Component, Int090101Component, Int090102Component,Int09010101Component,Int09010102Component],
  imports: [CommonModule, RouterModule.forChild(routes),
    SharedModule,
    BreadcrumbModule,
    SegmentModule,
    ModalModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule
    ],
    providers:[
      Int0901011Service,
      Int0901013Service
    ],
  exports: [RouterModule]
})
export class Int0901Module { }
