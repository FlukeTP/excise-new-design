import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ta020206Component } from './ta020206.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { SegmentModule } from 'components/segment/segment.module';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule  } from '@angular/forms';

const routes: Routes = [
  { path: "", component: Ta020206Component },
  {
    path: '', component: Ta020206Component,
    children: [
      { path: "01", loadChildren: './ta02020601/ta02020601.module#Ta02020601Module' },
      { path: "02", loadChildren: './ta02020602/ta02020602.module#Ta02020602Module' },
      { path: "03", loadChildren: './ta02020603/ta02020603.module#Ta02020603Module' },
    ]
  },
];
@NgModule({
  declarations: [Ta020206Component],
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
export class Ta020206Module { }
