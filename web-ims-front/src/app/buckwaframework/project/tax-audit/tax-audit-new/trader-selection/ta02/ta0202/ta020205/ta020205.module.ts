import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta020205Component } from './ta020205.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { SegmentModule } from 'components/segment/segment.module';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule  } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Ta020205Component },
  {
    path: '', component: Ta020205Component,
    children: [
      { path: "01", loadChildren: './ta02020501/ta02020501.module#Ta02020501Module' },
      { path: "02", loadChildren: './ta02020502/ta02020502.module#Ta02020502Module' },
      { path: "03", loadChildren: './ta02020503/ta02020503.module#Ta02020503Module' },
    ]
  },
];
@NgModule({
  declarations: [Ta020205Component],
  imports: [
    CommonModule,
    SharedModule,
    SegmentModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  exports:[
    RouterModule
  ]
})
export class Ta020205Module { }
