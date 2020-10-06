import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Int0903Component } from './int0903.component';
import { Int090301Component } from './int090301/int090301.component';
import { Int090302Component } from './int090302/int090302.component';
import { Int090303Component } from './int090303/int090303.component';
import { Int090304Component } from './int090304/int090304.component';
import { Int090305Component } from './int090305/int090305.component';
import { Int090306Component } from './int090306/int090306.component';
import { Int090307Component } from './int090307/int090307.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'components/button/button.module';
import { ModalModule } from 'components/modal/modal.module';
import { SegmentModule } from 'components/segment/segment.module';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { BreadcrumbModule } from 'components/index';
import { Int090308Component } from './int090308/int090308.component';
import { Int090309Component } from './int090309/int090309.component';
import { Int090310Component } from './int090310/int090310.component';

const routes: Routes = [
  { path: '', redirectTo: '01', pathMatch: 'full' },
  { path:'01', component: Int090301Component },
  { path:'02', component: Int090302Component },
  { path:'03', component: Int090303Component },
  { path:'04', component: Int090304Component },
  { path:'05', component: Int090305Component },
  { path:'06', component: Int090306Component },
  { path:'07', component: Int090307Component },
  { path:'08', component: Int090308Component },
  { path:'09', component: Int090309Component },
  { path:'10', component: Int090310Component },
];

@NgModule({
  declarations: [
    Int0903Component,
    Int090301Component,
    Int090302Component,
    Int090303Component,
    Int090304Component,
    Int090305Component,
    Int090306Component,
    Int090307Component,
    Int090308Component,
    Int090309Component,
    Int090310Component
  ],
  imports: [CommonModule, RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    BreadcrumbModule,
    SegmentModule,
    ModalModule,
    ButtonModule,
    ReactiveFormsModule],
  exports: [RouterModule]
})
export class Int0903Module { }
